export const name = "autorecording";
let autoRecording = false;
export function isAutoRecording() { return autoRecording; }

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 🎙️ Autorecording ${autoRecording ? "activé ✅" : "désactivé ❌"}\nUsage : .autorecording <on/off>` }, { quoted: msg });
  }
  autoRecording = args[0] === "on";
  if (autoRecording) {
    const interval = setInterval(async () => {
      if (!autoRecording) { clearInterval(interval); return; }
      try { await natsu.sendPresenceUpdate("recording", jid); } catch {}
    }, 5000);
  }
  await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 🎙️ Autorecording ${autoRecording ? "activé ✅" : "désactivé ❌"}` }, { quoted: msg });
}
