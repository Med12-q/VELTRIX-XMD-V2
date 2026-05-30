import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { downloadMediaMessage } from "@whiskeysockets/baileys";

export const name = "sticker";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  try {
    let targetMessage = msg;
    if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const ctx = msg.message.extendedTextMessage.contextInfo;
      targetMessage = {
        key: { remoteJid: jid, id: ctx.stanzaId, participant: ctx.participant },
        message: ctx.quotedMessage,
      };
    }
    const mediaMsg = targetMessage.message?.imageMessage || targetMessage.message?.videoMessage;
    if (!mediaMsg) {
      return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Réponds à une image ou vidéo avec .sticker" }, { quoted: msg });
    }
    const mediaBuffer = await downloadMediaMessage(targetMessage, "buffer", {}, { reuploadRequest: natsu.updateMediaMessage });
    if (!mediaBuffer) return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Impossible de télécharger le média." }, { quoted: msg });
    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const inputPath = path.join(tempDir, `input_${Date.now()}.tmp`);
    const outputPath = path.join(tempDir, `sticker_${Date.now()}.webp`);
    fs.writeFileSync(inputPath, mediaBuffer);
    const isAnimated = !!(mediaMsg.seconds && mediaMsg.seconds > 0) || mediaMsg.mimetype?.includes("video") || mediaMsg.mimetype?.includes("gif");
    const scale = "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000";
    const cmd = isAnimated
      ? `ffmpeg -y -i "${inputPath}" -vf "${scale},fps=15" -loop 0 -c:v libwebp -preset default -an -vsync 0 -pix_fmt yuva420p -quality 70 "${outputPath}"`
      : `ffmpeg -y -i "${inputPath}" -vf "${scale}" -loop 0 -c:v libwebp -preset default -an -vsync 0 -pix_fmt yuva420p -quality 80 "${outputPath}"`;
    await new Promise((resolve, reject) => exec(cmd, (err) => (err ? reject(err) : resolve())));
    if (!fs.existsSync(outputPath)) throw new Error("Échec de la conversion WebP.");
    const webpBuffer = fs.readFileSync(outputPath);
    await natsu.sendMessage(jid, { sticker: webpBuffer }, { quoted: msg });
    fs.unlink(inputPath, () => {});
    fs.unlink(outputPath, () => {});
  } catch (e) {
    await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur sticker : ${e.message}\n_Assure-toi que ffmpeg est installé sur le serveur._` }, { quoted: msg });
  }
}
