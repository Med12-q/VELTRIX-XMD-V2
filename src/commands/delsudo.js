import { removeSudo, normalizeNumber } from "../utils.js";

export const name = "delsudo";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const raw = mentioned ? mentioned.split("@")[0] : args[0];
  const bare = normalizeNumber(raw);
  if (!bare) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Usage : .delsudo @mention ou .delsudo 224xxxxxxxx" }, { quoted: msg });
  }
  removeSudo(bare);
  await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 🗑️ Le numéro *${bare}* a été retiré des sudo.` }, { quoted: msg });
}
