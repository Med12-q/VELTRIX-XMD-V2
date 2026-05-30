import { statusProtections } from "../protections.js";

export const name = "warnadmin";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return natsu.sendMessage(jid, {
      text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: WarnAdmin ${statusProtections.warnAdmin ? "activé ✅" : "désactivé ❌"}\nUsage : .warnadmin <on/off>`,
    }, { quoted: msg });
  }
  statusProtections.warnAdmin = args[0] === "on";
  await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: WarnAdmin ${args[0] === "on" ? "activé ✅" : "désactivé ❌"} !` }, { quoted: msg });
}
