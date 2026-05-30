import fs from "fs";

const SUDO_FILE = "./sudo.json";

export function loadSudo() {
  if (!fs.existsSync(SUDO_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(SUDO_FILE, "utf-8")); } catch { return []; }
}
export function saveSudo(list) {
  fs.writeFileSync(SUDO_FILE, JSON.stringify(list, null, 2));
}
export function addSudo(num) {
  const s = new Set(loadSudo());
  s.add(num);
  saveSudo([...s]);
  return [...s];
}
export function removeSudo(num) {
  const list = loadSudo().filter((n) => n !== num);
  saveSudo(list);
  return list;
}
export function isSudo(num) {
  return loadSudo().includes(num);
}

export function normalizeJid(jid) {
  if (!jid) return null;
  const bare = String(jid).trim().split(":")[0];
  return bare.includes("@") ? bare : bare + "@s.whatsapp.net";
}
export function getBareNumber(jid) {
  if (!jid) return "";
  return String(jid).split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
}
export function normalizeNumber(raw) {
  if (!raw) return null;
  const n = String(raw).replace(/[^0-9]/g, "");
  return n.length >= 7 ? n : null;
}

export function pickText(message) {
  if (!message) return;
  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    message.buttonsResponseMessage?.selectedButtonId ||
    message.listResponseMessage?.singleSelectReply?.selectedRowId ||
    message.templateButtonReplyMessage?.selectedId ||
    message.interactiveResponseMessage?.text
  );
}

export function unwrapMessage(msg) {
  return (
    msg?.viewOnceMessage?.message ||
    msg?.viewOnceMessageV2?.message ||
    msg?.ephemeralMessage?.message ||
    msg?.documentWithCaptionMessage?.message ||
    msg
  );
}

export const log = {
  info: (...a) => console.log("[INFO]", ...a),
  warn: (...a) => console.log("[WARN]", ...a),
  error: (...a) => console.log("[ERROR]", ...a),
};

export const silentLogger = {
  level: "silent",
  child: () => silentLogger,
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
  trace: () => {},
  fatal: () => {},
};
