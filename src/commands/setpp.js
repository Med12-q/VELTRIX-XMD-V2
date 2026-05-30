import { downloadContentFromMessage } from "@whiskeysockets/baileys";

export const name = "setpp";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const ctxInfo = msg.message?.extendedTextMessage?.contextInfo;
  if (!ctxInfo?.quotedMessage?.imageMessage) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Réponds à une image pour changer la photo de profil du bot." }, { quoted: msg });
  }
  try {
    const stream = await downloadContentFromMessage(ctxInfo.quotedMessage.imageMessage, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    await natsu.updateProfilePicture(natsu.user.id, buffer);
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ Photo de profil du bot mise à jour !" }, { quoted: msg });
  } catch {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Impossible de changer la photo de profil." }, { quoted: msg });
  }
}
