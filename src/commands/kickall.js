export const name = "kickall";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const botId = natsu.user?.id?.split(":")[0];
    const participants = meta.participants.filter((p) => !p.admin && !p.id.startsWith(botId));
    if (!participants.length) {
      return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Aucun membre à expulser." }, { quoted: msg });
    }
    await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 😼 Expulsion de ${participants.length} membres en cours...` }, { quoted: msg });
    for (const p of participants) {
      await natsu.groupParticipantsUpdate(jid, [p.id], "remove").catch(() => {});
    }
    await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ ${participants.length} membres expulsés !` });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur lors de l'expulsion : " + e.message }, { quoted: msg });
  }
}
