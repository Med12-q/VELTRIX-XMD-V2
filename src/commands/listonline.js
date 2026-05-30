export const name = "listonline";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const presences = natsu.presences || {};
    const onlineMembers = meta.participants.filter((p) => {
      const presence = presences[p.id];
      return presence?.lastKnownPresence === "available";
    });
    const list = onlineMembers.length
      ? onlineMembers.map((p, i) => `*${i + 1}.* @${p.id.split("@")[0]}`).join("\n")
      : "Aucun membre en ligne détecté.";
    await natsu.sendMessage(jid, {
      text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 🟢 *Membres en ligne (${onlineMembers.length}/${meta.participants.length}) :*\n\n${list}`,
      mentions: onlineMembers.map((p) => p.id),
    }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Impossible de récupérer la liste. Raison: ${e.message}` }, { quoted: msg });
  }
}
