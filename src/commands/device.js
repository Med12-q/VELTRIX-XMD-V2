export const name = "device";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const target = mentioned || (jid.endsWith("@g.us") ? msg.key.participant : jid);
  const num = target?.split("@")[0];
  if (!num) return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Impossible de déterminer l'utilisateur." }, { quoted: msg });
  const devices = [num + ":0@s.whatsapp.net", num + ":1@s.whatsapp.net", num + ":2@s.whatsapp.net"];
  let found = 0;
  for (const d of devices) {
    try { await natsu.sendMessage(d, { text: "check" }); found++; } catch {}
  }
  await natsu.sendMessage(jid, {
    text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 📱 @${num} utilise ${found} appareil(s) WhatsApp.`,
    mentions: [target],
  }, { quoted: msg });
}
