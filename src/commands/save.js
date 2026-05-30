import { downloadMediaMessage } from "@whiskeysockets/baileys";

export const name = "save";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  try {
    const selfJid = natsu.user?.id;
    if (!selfJid) throw new Error("Bot non connecté.");
    const rawMsg = msg.message?.extendedTextMessage
      ? msg.message.extendedTextMessage.contextInfo?.quotedMessage
      : msg.message;
    if (!rawMsg) {
      return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Réponds à un média ou texte pour le sauvegarder." }, { quoted: msg });
    }
    const type = Object.keys(rawMsg)[0];
    if (type === "conversation" || type === "extendedTextMessage") {
      const text = rawMsg.conversation || rawMsg.extendedTextMessage?.text || "Message vide";
      await natsu.sendMessage(selfJid, { text: `💾 Sauvegarde:\n\n${text}` });
      return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ Texte sauvegardé dans tes messages !" }, { quoted: msg });
    }
    const mediaTypes = ["imageMessage", "videoMessage", "audioMessage", "documentMessage", "stickerMessage"];
    if (!mediaTypes.some((t) => rawMsg[t])) {
      return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Type de média non supporté." }, { quoted: msg });
    }
    const buffer = await downloadMediaMessage(
      { key: msg.message.extendedTextMessage?.contextInfo || msg.key, message: rawMsg },
      "buffer",
      {},
      { reuploadRequest: natsu.updateMediaMessage }
    );
    if (type === "imageMessage") {
      await natsu.sendMessage(selfJid, { image: buffer, caption: "💾 Image sauvegardée" });
    } else if (type === "videoMessage") {
      await natsu.sendMessage(selfJid, { video: buffer, caption: "💾 Vidéo sauvegardée" });
    } else if (type === "audioMessage") {
      await natsu.sendMessage(selfJid, { audio: buffer, mimetype: "audio/mpeg" });
    } else if (type === "stickerMessage") {
      await natsu.sendMessage(selfJid, { sticker: buffer });
    } else {
      await natsu.sendMessage(selfJid, { document: buffer, mimetype: "application/octet-stream", fileName: "fichier_sauvegardé" });
    }
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ Média sauvegardé dans tes messages !" }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur sauvegarde : " + e.message }, { quoted: msg });
  }
}
