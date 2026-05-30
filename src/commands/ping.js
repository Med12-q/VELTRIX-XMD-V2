export const name = "ping";

export async function execute(natsu, msg, args, from) {
  try {
    const jid = from || msg.key.remoteJid;
    const start = Date.now();
    const sentMsg = await natsu.sendMessage(jid, { text: "🏓 Pong..." }, { quoted: msg });
    const latency = Date.now() - start;
    await natsu.sendMessage(jid, {
      text: `╭━≽⚛️ PONG ⚛️══╮\n> │ 🏎️ Bot opérationnel\n> │ ⏱️ Latence : ${latency} ms\n> ╰━━━━━━━━━━━━≽`,
    }, { quoted: sentMsg });
  } catch (e) {
    await natsu.sendMessage(from || msg.key.remoteJid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Impossible de calculer la latence." }, { quoted: msg });
  }
}
