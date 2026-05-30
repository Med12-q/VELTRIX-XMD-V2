import { downloadMediaMessage } from "@whiskeysockets/baileys";

export const name = "vv";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const quoted = msg.message?.extendedTextMessage?.contextInfo;
  if (!quoted?.quotedMessage) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Réponds à un message éphémère (view once)." }, { quoted: msg });
  }
  try {
    const qMsg = {
      key: { remoteJid: jid, id: quoted.stanzaId, participant: quoted.participant },
      message: quoted.quotedMessage,
    };
    const buffer = await downloadMediaMessage(qMsg, "buffer", {}, { reuploadRequest: natsu.updateMediaMessage });
    const type = quoted.quotedMessage.imageMessage ? "image" : quoted.quotedMessage.videoMessage ? "video" : null;
    if (!type) return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Type de média non supporté." }, { quoted: msg });
    await natsu.sendMessage(jid, { [type]: buffer, caption: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 👁️ Média récupéré !" }, { quoted: msg });
  } catch {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Impossible de récupérer le média." }, { quoted: msg });
  }
}
