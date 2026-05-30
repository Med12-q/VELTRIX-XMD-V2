import { statusProtections } from "../protections.js";

export const name = "antibot";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Anti-bot ${statusProtections.antiBot ? "activé ✅" : "désactivé ❌"}\nUsage : .antibot <on/off>` }, { quoted: msg });
  }
  statusProtections.antiBot = args[0] === "on";
  await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: AntiBot ${args[0] === "on" ? "activé ✅" : "désactivé ❌"} !` }, { quoted: msg });
}
