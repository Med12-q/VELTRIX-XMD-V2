import { OWNER_NUMBERS } from "./config.js";

export const statusProtections = {
  antiLink: false,
  antiPromote: false,
  antiDemote: false,
  antiBot: false,
  antiSpam: false,
  warnAdmin: false,
};

const SPAM_LIMIT = 4;
const TIME_LIMIT_MS = 5000;
const messageHistory = {};
const blockedLinks = ["chat.whatsapp.com", "bit.ly", "t.me"];

async function isBotAdmin(natsu, groupId) {
  try {
    const meta = await natsu.groupMetadata(groupId);
    const botId = natsu.user?.id;
    const bot = meta.participants.find((p) => p.id === botId || p.id.startsWith(botId?.split(":")[0]));
    return bot?.admin != null;
  } catch {
    return false;
  }
}

export function antiLink(natsu) {
  natsu.ev.on("messages.upsert", async ({ messages }) => {
    if (!statusProtections.antiLink) return;
    const msg = messages[0];
    if (!msg?.message) return;
    const from = msg.key.remoteJid;
    if (!from?.endsWith("@g.us")) return;
    const sender = msg.key.participant || from;
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption;
    if (!text) return;
    try {
      const meta = await natsu.groupMetadata(from);
      const senderInfo = meta.participants.find((p) => p.id === sender);
      if (senderInfo?.admin) return;
      for (const link of blockedLinks) {
        if (text.includes(link)) {
          await natsu.sendMessage(from, {
            text: `> 🛡️ VELTRIX XMD — Anti-lien activé.\n> @${sender.split("@")[0]} a été sanctionné pour avoir partagé un lien.`,
            mentions: [sender],
          });
          await natsu.sendMessage(from, { delete: msg.key });
          const isAdmin = await isBotAdmin(natsu, from);
          if (isAdmin) await natsu.groupParticipantsUpdate(from, [sender], "remove");
          return;
        }
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) console.log("[WARN][ANTILINK]", e?.message ?? e);
    }
  });
}

export function antiPromote(natsu) {
  natsu.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.antiPromote) return;
    if (update.action !== "promote") return;
    const groupId = update.id;
    try {
      const isAdmin = await isBotAdmin(natsu, groupId);
      for (const p of update.participants) {
        if (isAdmin) await natsu.groupParticipantsUpdate(groupId, [p], "demote");
        console.log(`[ANTI-PROMOTE] ${p} rétrogradé dans ${groupId}`);
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) console.log("[WARN][ANTIPROMOTE]", e?.message ?? e);
    }
  });
}

export function antiDemote(natsu) {
  natsu.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.antiDemote) return;
    if (update.action !== "demote") return;
    const groupId = update.id;
    try {
      const isAdmin = await isBotAdmin(natsu, groupId);
      for (const p of update.participants) {
        if (isAdmin) await natsu.groupParticipantsUpdate(groupId, [p], "promote");
        console.log(`[ANTI-DEMOTE] ${p} re-promu dans ${groupId}`);
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) console.log("[WARN][ANTIDEMOTE]", e?.message ?? e);
    }
  });
}

export function antiBot(natsu) {
  natsu.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.antiBot) return;
    if (update.action !== "add") return;
    try {
      const isAdmin = await isBotAdmin(natsu, update.id);
      if (!isAdmin) return;
      for (const p of update.participants) {
        if (p.includes("bot")) {
          await natsu.groupParticipantsUpdate(update.id, [p], "remove");
          console.log(`[ANTI-BOT] Bot ${p} expulsé dans ${update.id}`);
        }
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) console.log("[WARN][ANTIBOT]", e?.message ?? e);
    }
  });
}

export function antiSpam(natsu) {
  natsu.ev.on("messages.upsert", async ({ messages }) => {
    if (!statusProtections.antiSpam) return;
    const msg = messages[0];
    if (!msg?.message) return;
    const from = msg.key.remoteJid;
    if (!from?.endsWith("@g.us")) return;
    const sender = msg.key.participant || from;
    const timestamp = (msg.messageTimestamp ?? 0) * 1000;
    try {
      const meta = await natsu.groupMetadata(from);
      const senderInfo = meta.participants.find((p) => p.id === sender);
      if (senderInfo?.admin || msg.key.fromMe) return;
      if (!messageHistory[sender]) messageHistory[sender] = [];
      messageHistory[sender].unshift({ key: msg.key, timestamp });
      if (messageHistory[sender].length > SPAM_LIMIT) messageHistory[sender].pop();
      if (messageHistory[sender].length === SPAM_LIMIT) {
        const newest = messageHistory[sender][0].timestamp;
        const oldest = messageHistory[sender][SPAM_LIMIT - 1].timestamp;
        if (newest - oldest <= TIME_LIMIT_MS) {
          const keys = messageHistory[sender].map((m) => m.key);
          await Promise.allSettled(keys.map((k) => natsu.sendMessage(from, { delete: k })));
          messageHistory[sender] = [];
          await natsu.sendMessage(from, {
            text: `> 🚫 VELTRIX XMD — Anti-Spam : @${sender.split("@")[0]} a envoyé trop de messages rapidement.`,
            mentions: [sender],
          });
        }
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) console.log("[WARN][ANTISPAM]", e?.message ?? e);
    }
  });
}

export function warnAdmin(natsu) {
  natsu.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.warnAdmin) return;
    try {
      const groupId = update.id;
      const meta = await natsu.groupMetadata(groupId);
      if (update.action === "promote" || update.action === "demote") {
        for (const p of update.participants) {
          const tag = "@" + p.split("@")[0];
          const msg =
            update.action === "promote"
              ? `👑 ${tag} a été *promu admin* dans *${meta.subject}* !`
              : `⚠️ ${tag} a été *rétrogradé* dans *${meta.subject}* !`;
          await natsu.sendMessage(groupId, { text: `> ⚔️ VELTRIX XMD — Alerte Admin\n${msg}`, mentions: [p] });
        }
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) console.log("[WARN][WARNADMIN]", e?.message ?? e);
    }
  });
}

export function initProtections(natsu) {
  antiLink(natsu);
  antiPromote(natsu);
  antiDemote(natsu);
  antiBot(natsu);
  antiSpam(natsu);
  warnAdmin(natsu);
}
