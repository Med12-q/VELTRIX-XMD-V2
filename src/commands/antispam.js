import { statusProtections } from "../protections.js";

export const name = "antispam";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: AntiSpam ${statusProtections.antiSpam ? "actif ✅" : "inactif ❌"}\nUsage : .antispam <on/off>` }, { quoted: msg });
  }
  statusProtections.antiSpam = args[0] === "on";
  await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Anti-spam ${args[0] === "on" ? "actif ✅" : "inactif ❌"} !` }, { quoted: msg });
}
