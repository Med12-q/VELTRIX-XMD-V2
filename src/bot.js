import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  isJidBroadcast,
  proto,
} from "@whiskeysockets/baileys";
import fs from "fs";
import path from "path";
import {
  BOT_NAME, BOT_VERSION, BOT_DEV, BOT_IMAGE, MENU_AUDIO,
  OWNER_NUMBERS, NEWSLETTER_IDS, PREFIX, AUTH_DIR, RECONNECT_DELAY,
} from "./config.js";
import { loadSudo, getBareNumber, unwrapMessage, pickText, silentLogger, log } from "./utils.js";
import { initProtections } from "./protections.js";

export const botState = {
  status: "disconnected",
  qr: null,
  pairingCode: null,
  pairingNumber: null,
  connectedNumber: null,
  connectedName: null,
  uptime: 0,
  startTime: null,
  commandCount: 0,
  socket: null,
};

const msgStore = new Map();

const emojiMap = {
  menu: "📋", ping: "🏓", infos: "🗒️", owner: "👑", device: "📱",
  delete: "🗑️", vv: "👁️", whois: "🖼️", setpp: "🖼️", autorecording: "🎙️",
  sticker: "🖼️", save: "💾", photo: "🖼️", url: "🔗", add: "👥",
  kick: "❌", kickall: "😼", tagall: "🌍", tag: "👥", tagadmin: "👑",
  promote: "↗️", demote: "↘️", demoteall: "↘️", promoteall: "↗️",
  gclink: "🔗", left: "👋", mute: "🔇", unmute: "🔊", purge: "⚜️",
  principal: "👑", setppg: "🖼️", settimeg: "⏰", writetoall: "📣",
  wasted: "💀", antibot: "🤖", antidemote: "⚜️", antilink: "🔗",
  antipromote: "⚜️", antispam: "✅", warnadmin: "⚔️", listonline: "🟢",
  delsudo: "❌", listsudo: "📋", setsudo: "✅", "mute-time": "⏰",
  autojoin: "📡",
};

async function autoFollowNewsletters(natsu) {
  for (const id of NEWSLETTER_IDS) {
    try {
      if (typeof natsu.newsletterFollow === "function") await natsu.newsletterFollow(id);
    } catch {}
  }
}

async function loadCommands() {
  global.commands = {};
  const cmdDir = new URL("./commands", import.meta.url).pathname;
  if (!fs.existsSync(cmdDir)) return;
  const files = fs.readdirSync(cmdDir).filter((f) => f.endsWith(".js"));
  for (const file of files) {
    try {
      const mod = await import(path.resolve(cmdDir, file) + "?t=" + Date.now());
      const cmd = mod.default ?? mod;
      if (cmd?.name && typeof cmd.execute === "function") {
        global.commands[cmd.name] = cmd;
      }
    } catch (e) {
      log.warn(`Echec import commande ${file}: ${e?.message ?? e}`);
    }
  }
  botState.commandCount = Object.keys(global.commands).length;
  log.info(`${botState.commandCount} commandes chargées`);
}

export async function requestPairingCode(phoneNumber) {
  if (!botState.socket) throw new Error("Socket non initialisé. Attends que le bot démarre.");
  if (typeof botState.socket.requestPairingCode !== "function") {
    throw new Error("requestPairingCode non disponible sur cette version de Baileys.");
  }
  const clean = String(phoneNumber).replace(/[^0-9]/g, "");
  if (clean.length < 7) throw new Error("Numéro invalide.");
  const code = await botState.socket.requestPairingCode(clean);
  botState.pairingCode = code;
  botState.pairingNumber = clean;
  botState.status = "pairing";
  log.info(`Code de couplage généré pour ${clean}: ${code}`);
  return code;
}

export async function startBot() {
  try {
    let version;
    try {
      const res = await fetchLatestBaileysVersion();
      version = res.version;
      log.info("Version Baileys: " + version.join("."));
    } catch {
      version = [2, 3000, 1015901307];
      log.warn("Version Baileys de secours utilisée");
    }

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    const natsu = makeWASocket({
      version,
      logger: silentLogger,
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, silentLogger),
      },
      msgRetryCounterCache: new Map(),
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      generateHighQualityLinkPreview: true,
      getMessage: async (key) => {
        const stored = msgStore.get(key.id);
        if (stored) return stored;
        return proto.Message.fromObject({ conversation: "" });
      },
    });

    botState.socket = natsu;
    botState.status = "connecting";

    natsu.ev.on("creds.update", saveCreds);

    natsu.ev.on("messages.upsert", ({ messages }) => {
      for (const msg of messages) {
        if (msg.key?.id && msg.message) {
          msgStore.set(msg.key.id, msg.message);
          if (msgStore.size > 500) {
            const firstKey = msgStore.keys().next().value;
            msgStore.delete(firstKey);
          }
        }
      }
    });

    natsu.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        botState.qr = qr;
        botState.status = "qr_ready";
        log.info("QR Code disponible via le dashboard web");
      }

      if (connection === "open") {
        botState.status = "connected";
        botState.qr = null;
        botState.pairingCode = null;
        botState.startTime = Date.now();

        const userJid = natsu.user?.id || null;
        const bareConnected = getBareNumber(userJid);
        botState.connectedNumber = bareConnected || null;
        botState.connectedName = natsu.user?.name || null;

        global.owners = bareConnected ? [...new Set([bareConnected, ...OWNER_NUMBERS])] : [...OWNER_NUMBERS];
        log.info("✅ Bot connecté ! Propriétaires : " + global.owners.join(", "));

        try { initProtections(natsu); } catch (e) { log.error("Erreur initProtections: " + e?.message); }

        await loadCommands();
        await autoFollowNewsletters(natsu);

        try {
          const selfJid = natsu.user?.id || null;
          const bareJid = selfJid ? selfJid.split(":")[0] : null;
          if (bareJid) {
            await natsu.sendMessage(bareJid + "@s.whatsapp.net", {
              image: { url: BOT_IMAGE },
              caption: `🎉 *${BOT_NAME}* est ACTIF !\n\nTape ${PREFIX}menu pour les commandes\n\n_Connecté via le dashboard web_`,
            });
          }
        } catch {}
      }

      if (connection === "close") {
        botState.status = "disconnected";
        botState.socket = null;
        let reason = "inconnu";
        try {
          reason = lastDisconnect?.error?.output?.statusCode ?? lastDisconnect?.error?.message ?? String(lastDisconnect);
        } catch {}
        log.error("Déconnecté : " + reason);
        const loggedOut =
          lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut ||
          /loggedOut/i.test(String(reason));
        if (!loggedOut) {
          log.warn(`Reconnexion dans ${RECONNECT_DELAY}ms...`);
          setTimeout(startBot, RECONNECT_DELAY);
        } else {
          botState.status = "logged_out";
          log.error("Session terminée — reconnecte depuis le dashboard web.");
        }
      }
    });

    natsu.ev.on("messages.upsert", async ({ messages }) => {
      try {
        const msg = messages?.[0];
        if (!msg?.message) return;

        const from = msg.key.remoteJid;
        if (!from || isJidBroadcast(from)) return;

        const isGroup = from.endsWith("@g.us");
        let sender = msg.key.fromMe
          ? natsu.user?.id
          : isGroup
          ? msg.key.participant
          : msg.key.remoteJid;

        if (!sender) return;
        if (String(sender).includes("@lid")) {
          try { sender = natsu.decodeJid(sender); } catch {}
        }

        const senderNum = getBareNumber(sender);
        const ownersNums = (global.owners || []).map(getBareNumber);
        const sudoNums = loadSudo().map(getBareNumber);
        if (!ownersNums.includes(senderNum) && !sudoNums.includes(senderNum)) return;

        const rawMsg = unwrapMessage(msg.message);
        const body = pickText(rawMsg);
        if (!body || !body.startsWith(PREFIX)) return;

        const args = body.slice(PREFIX.length).trim().split(/ +/);
        const commandName = (args.shift() || "").toLowerCase();
        const cmd = global.commands?.[commandName];

        try { await natsu.sendMessage(from, { react: { text: "📡", key: msg.key } }); } catch {}

        if (cmd) {
          const emoji = emojiMap[commandName];
          if (emoji) {
            try { await natsu.sendMessage(from, { react: { text: emoji, key: msg.key } }); } catch {}
          }
          try {
            await cmd.execute(natsu, msg, args, from);
          } catch (e) {
            log.error(`Erreur commande ${commandName}: ${e?.message}`);
            try {
              await natsu.sendMessage(from, {
                text: `> ⚠️ Erreur lors de l'exécution de la commande : *${commandName}*`,
              }, { quoted: msg });
            } catch {}
          }
        }
      } catch (e) {
        if (e?.message?.includes("Bad MAC") || e?.message?.includes("decrypt")) return;
        log.warn("Erreur messages.upsert: " + e?.message);
      }
    });

  } catch (e) {
    log.error("Erreur critique: " + (e?.message ?? e));
    botState.status = "error";
    setTimeout(startBot, RECONNECT_DELAY);
  }
}

process.on("unhandledRejection", (r) => {
  const msg = String(r);
  if (msg.includes("Bad MAC") || msg.includes("decrypt") || msg.includes("No sessions")) return;
  log.error("Rejection non gérée: " + msg);
});

process.on("uncaughtException", (e) => {
  const msg = e?.message || String(e);
  if (msg.includes("Bad MAC") || msg.includes("decrypt") || msg.includes("No sessions")) return;
  log.error("Exception non gérée: " + msg);
});
