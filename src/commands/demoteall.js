export const name = "demoteall";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const botId = natsu.user?.id?.split(":")[0];
    const admins = meta.participants.filter((p) => p.admin && !p.id.startsWith(botId));
    if (!admins.length) return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Aucun admin à rétrograder." }, { quoted: msg });
    for (const a of admins) {
      await natsu.groupParticipantsUpdate(jid, [a.id], "demote").catch(() => {});
    }
    await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ ${admins.length} admin(s) rétrogradé(s).` }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur demoteall." }, { quoted: msg });
  }
}
