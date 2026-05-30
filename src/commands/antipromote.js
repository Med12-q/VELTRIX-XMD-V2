import { statusProtections } from "../protections.js";

export const name = "antipromote";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Anti-promote ${statusProtections.antiPromote ? "actif ✅" : "inactif ❌"}\nUsage : .antipromote <on/off>` }, { quoted: msg });
  }
  statusProtections.antiPromote = args[0] === "on";
  await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Anti-promote ${args[0] === "on" ? "actif ✅" : "inactif ❌"} !` }, { quoted: msg });
}
