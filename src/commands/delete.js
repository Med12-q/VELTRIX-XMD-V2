export const name = "delete";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const quoted = msg.message?.extendedTextMessage?.contextInfo;
  if (!quoted?.stanzaId) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Réponds au message à supprimer." }, { quoted: msg });
  }
  try {
    await natsu.sendMessage(jid, {
      delete: {
        remoteJid: jid,
        fromMe: false,
        id: quoted.stanzaId,
        participant: quoted.participant,
      },
    });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Impossible de supprimer ce message (vérifiez mes droits admin)." }, { quoted: msg });
  }
}
