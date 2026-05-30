export const name = "infosgroups";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const admins = meta.participants.filter((p) => p.admin);
    const desc = meta.desc ? Buffer.isBuffer(meta.desc) ? meta.desc.toString() : meta.desc : "Pas de description";
    const text = `
╭━━━━ ⌜INFOS GROUP⌟
┃✪│📛 *Nom:* ${meta.subject}
┃✪│👥 *Membres:* ${meta.participants.length}
┃✪│👑 *Admins:* ${admins.length}
┃✪│📝 *Description:* ${desc}
┃✪│🔒 *Restriction:* ${meta.announce ? "Admins seulement" : "Tous"}
┃✪│🆔 *ID:* ${meta.id}
╰━━━━━━━━━━━━━━━━━≽

> ©2026 𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣`;
    await natsu.sendMessage(jid, { text }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Impossible de récupérer les infos du groupe." }, { quoted: msg });
  }
}
