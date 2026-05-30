import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import qrcode from "qrcode";
import { botState, requestPairingCode } from "./bot.js";
import { PORT, BOT_NAME, BOT_VERSION, BOT_DEV, SESSION_SECRET } from "./config.js";
import { log } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/status", (req, res) => {
  const uptime = botState.startTime ? Math.floor((Date.now() - botState.startTime) / 1000) : 0;
  const h = Math.floor(uptime / 3600);
  const m = Math.floor((uptime % 3600) / 60);
  const s = uptime % 60;
  res.json({
    status: botState.status,
    connectedNumber: botState.connectedNumber,
    connectedName: botState.connectedName,
    pairingCode: botState.pairingCode,
    pairingNumber: botState.pairingNumber,
    commandCount: botState.commandCount,
    uptime: botState.startTime ? `${h}h ${m}m ${s}s` : "—",
    botName: BOT_NAME,
    botVersion: BOT_VERSION,
    botDev: BOT_DEV,
  });
});

app.get("/api/qr", async (req, res) => {
  if (!botState.qr) {
    return res.json({ qr: null, message: "Aucun QR disponible. Le bot est peut-être déjà connecté." });
  }
  try {
    const qrImage = await qrcode.toDataURL(botState.qr);
    res.json({ qr: qrImage });
  } catch (e) {
    res.status(500).json({ error: "Impossible de générer le QR code." });
  }
});

app.post("/api/pair", async (req, res) => {
  const { number } = req.body;
  if (!number) {
    return res.status(400).json({ error: "Numéro manquant. Fournis le champ 'number'." });
  }
  const clean = String(number).replace(/[^0-9]/g, "");
  if (clean.length < 7) {
    return res.status(400).json({ error: "Numéro invalide. Format international sans +, ex: 224669288332" });
  }
  if (botState.status === "connected") {
    return res.status(400).json({ error: "Bot déjà connecté. Déconnecte d'abord la session." });
  }
  try {
    const code = await requestPairingCode(clean);
    res.json({ code, number: clean, message: `Code de couplage: ${code}. Entre ce code dans WhatsApp > Appareils liés > Lier un appareil.` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/disconnect", (req, res) => {
  if (!botState.socket) {
    return res.json({ message: "Bot non connecté." });
  }
  try {
    botState.socket.logout();
    res.json({ message: "Déconnexion en cours..." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export function startWeb() {
  return new Promise((resolve) => {
    app.listen(PORT, "0.0.0.0", () => {
      log.info(`🌐 Dashboard web disponible sur le port ${PORT}`);
      resolve();
    });
  });
}
