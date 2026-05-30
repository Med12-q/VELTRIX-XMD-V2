import { downloadContentFromMessage } from "@whiskeysockets/baileys";

export const name = "photo";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  try {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
    if (!quoted) {
      return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Réponds à un sticker pour le convertir en image." }, { quoted: msg });
    }
    const stream = await downloadContentFromMessage(quoted, "sticker");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    await natsu.sendMessage(jid, { image: buffer, caption: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ Conversion sticker → image réussie !" }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur conversion sticker → photo : " + e.message }, { quoted: msg });
  }
}
