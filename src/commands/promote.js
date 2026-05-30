export const name = "promote";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const participant = msg.message?.extendedTextMessage?.contextInfo?.participant;
  const targets = mentioned.length ? mentioned : participant ? [participant] : [];
  if (!targets.length) return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Usage : .promote @membre" }, { quoted: msg });
  try {
    await natsu.groupParticipantsUpdate(jid, targets, "promote");
    await natsu.sendMessage(jid, {
      text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ ${targets.map((t) => "@" + t.split("@")[0]).join(", ")} est/sont maintenant admin(s) !`,
      mentions: targets,
    }, { quoted: msg });
  } catch {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Impossible de promouvoir (vérifiez mes droits admin)." }, { quoted: msg });
  }
}
