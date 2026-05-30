export const name = "add";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  if (!args[0]) return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Usage : .add 224xxxxxxxx" }, { quoted: msg });
  const number = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  try {
    const res = await natsu.groupParticipantsUpdate(jid, [number], "add");
    const status = res?.[0]?.status;
    if (status === 200 || status === "200") {
      await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ @${number.split("@")[0]} a été ajouté.`, mentions: [number] }, { quoted: msg });
    } else {
      await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Impossible d'ajouter (code: ${status}). Le numéro doit avoir WhatsApp et autoriser les ajouts.` }, { quoted: msg });
    }
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur lors de l'ajout." }, { quoted: msg });
  }
}
