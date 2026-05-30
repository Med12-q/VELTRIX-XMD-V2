export const name = "tagadmin";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const admins = meta.participants.filter((p) => p.admin);
    if (!admins.length) return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Aucun admin trouvé." }, { quoted: msg });
    const mentions = admins.map((p) => p.id);
    const extra = args.join(" ");
    const text = `👑 *Admins du groupe :*\n${mentions.map((m) => `@${m.split("@")[0]}`).join("\n")}${extra ? "\n\n" + extra : ""}`;
    await natsu.sendMessage(jid, { text, mentions }, { quoted: msg });
  } catch {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur tagadmin." }, { quoted: msg });
  }
}
