export const name = "tagall";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const mentions = meta.participants.map((p) => p.id);
    const extra = args.join(" ");
    const tagList = mentions.map((m) => `@${m.split("@")[0]}`).join(" ");
    await natsu.sendMessage(jid, {
      text: `📢 ${extra ? extra + "\n\n" : ""}${tagList}`,
      mentions,
    }, { quoted: msg });
  } catch {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur tagall." }, { quoted: msg });
  }
}
