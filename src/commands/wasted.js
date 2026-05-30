import axios from "axios";

export const name = "wasted";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  try {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const participant = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const userToWaste = mentioned?.length ? mentioned[0] : participant || null;
    if (!userToWaste) {
      return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Mentionne quelqu'un ou réponds à son message." }, { quoted: msg });
    }
    let profilePic;
    try { profilePic = await natsu.profilePictureUrl(userToWaste, "image"); }
    catch { profilePic = "https://i.imgur.com/2wzGhpF.jpeg"; }
    const apiUrl = `https://some-random-api.com/canvas/overlay/wasted?avatar=${encodeURIComponent(profilePic)}`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 10000 });
    await natsu.sendMessage(jid, { image: Buffer.from(response.data), caption: `⚰️ *Wasted* : @${userToWaste.split("@")[0]} 💀\n\nRepose en paix…`, mentions: [userToWaste] }, { quoted: msg });
    if (jid.endsWith("@g.us")) {
      try { await natsu.groupParticipantsUpdate(jid, [userToWaste], "remove"); } catch {}
    }
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Impossible de créer l'image Wasted." }, { quoted: msg });
  }
}
