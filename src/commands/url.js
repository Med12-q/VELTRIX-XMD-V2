import { downloadContentFromMessage } from "@whiskeysockets/baileys";
import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";

export const name = "url";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  try {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || msg.message;
    let type = null;
    if (quoted.imageMessage) type = "image";
    else if (quoted.videoMessage) type = "video";
    else if (quoted.audioMessage) type = "audio";
    if (!type) return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Réponds à une image, vidéo ou audio." }, { quoted: msg });
    const stream = await downloadContentFromMessage(quoted[`${type}Message`], type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const ext = type === "image" ? "jpg" : type === "video" ? "mp4" : "mp3";
    const filePath = path.join(tempDir, `media_${Date.now()}.${ext}`);
    fs.writeFileSync(filePath, buffer);
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", fs.createReadStream(filePath));
    const upload = await axios.post("https://catbox.moe/user/api.php", form, { headers: form.getHeaders() });
    fs.unlink(filePath, () => {});
    await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ URL générée :\n${upload.data}` }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur URL : " + e.message }, { quoted: msg });
  }
}
