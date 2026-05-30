export const name = "gclink";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  try {
    const code = await natsu.groupInviteCode(jid);
    await natsu.sendMessage(jid, {
      text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 🔗 Lien d'invitation :\nhttps://chat.whatsapp.com/${code}`,
    }, { quoted: msg });
  } catch {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Impossible de récupérer le lien (vérifiez mes droits admin)." }, { quoted: msg });
  }
}
