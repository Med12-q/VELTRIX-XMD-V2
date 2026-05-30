export const name = "writetoall";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Cette commande doit être utilisée dans un groupe !" }, { quoted: msg });
  }
  if (!args?.length) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Usage : .writetoall <message>" }, { quoted: msg });
  }
  const textToSend = args.join(" ");
  try {
    const meta = await natsu.groupMetadata(jid);
    const botNum = natsu.user?.id?.split(":")[0];
    const participants = meta.participants.filter((p) => !p.id.startsWith(botNum));
    let sent = 0;
    for (const p of participants) {
      const success = await natsu.sendMessage(p.id, { text: textToSend }).catch(() => null);
      if (success) sent++;
    }
    await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ Message envoyé à ${sent}/${participants.length} membres.` }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur writetoall : " + e.message }, { quoted: msg });
  }
}
