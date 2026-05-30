import { statusProtections } from "../protections.js";

export const name = "antidemote";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Anti-demote ${statusProtections.antiDemote ? "actif ✅" : "inactif ❌"}\nUsage : .antidemote <on/off>` }, { quoted: msg });
  }
  statusProtections.antiDemote = args[0] === "on";
  await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: AntiDemote ${args[0] === "on" ? "actif ✅" : "inactif ❌"} !` }, { quoted: msg });
}
