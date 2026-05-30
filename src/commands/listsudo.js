import { loadSudo } from "../utils.js";

export const name = "listsudo";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const list = loadSudo();
  if (!list.length) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 📋 Aucun sudo défini." }, { quoted: msg });
  }
  const text = `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 📋 *Liste Sudo:*\n${list.map((n, i) => `${i + 1}. +${n}`).join("\n")}`;
  await natsu.sendMessage(jid, { text }, { quoted: msg });
}
