import { downloadContentFromMessage } from "@whiskeysockets/baileys";

export const name = "setppg";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  const ctxInfo = msg.message?.extendedTextMessage?.contextInfo;
  if (!ctxInfo?.quotedMessage?.imageMessage) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Réponds à une image pour changer la photo de profil du groupe." }, { quoted: msg });
  }
  try {
    const stream = await downloadContentFromMessage(ctxInfo.quotedMessage.imageMessage, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    await natsu.updateProfilePicture(jid, buffer);
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ Photo de profil du groupe mise à jour !" }, { quoted: msg });
  } catch {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Impossible de changer la photo (vérifiez mes droits admin)." }, { quoted: msg });
  }
}
