import { BOT_NAME, BOT_VERSION } from "../config.js";

export const name = "infos";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const uptime = process.uptime();
  const h = Math.floor(uptime / 3600);
  const m = Math.floor((uptime % 3600) / 60);
  const s = Math.floor(uptime % 60);
  const uptimeStr = `${h}h ${m}m ${s}s`;
  const usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
  let totalMemGB = "N/A";
  let platform = "N/A";
  try {
    const os = await import("os");
    totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    platform = `${os.platform()} ${os.release()}`;
  } catch {}
  const start = Date.now();
  await natsu.sendMessage(jid, { text: "⏳ Récupération des infos..." }, { quoted: msg }).catch(() => {});
  const latency = Date.now() - start;
  const botJid = (natsu?.user?.id || "Inconnu").split(":")?.[0];

  const text = `
╭━━━〔 ${BOT_NAME} 〕
┃✪╭━━━━━━━━━━━━━━━≽
┃✪│📱 *Numéro:* ${botJid}
┃✪│📦 *Version:* ${BOT_VERSION}
┃✪│⏱️ *Uptime:* ${uptimeStr}
┃✪│♾️ *Latence:* ${latency} ms
┃✪│💾 *RAM:* ${usedMem} MB / ${totalMemGB} GB
┃✪│🖥️ *Système:* ${platform}
┃✪│🔧 *Node.js:* ${process.version}
╰━━━━━━━━━━━━━━━━━≽

> ©2026 ${BOT_NAME} powered by NATSUorDENTSU`;

  await natsu.sendMessage(jid, { text }, { quoted: msg }).catch((e) => console.error("infos error:", e));
}
