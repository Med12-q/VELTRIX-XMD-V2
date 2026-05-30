export const name = "purge";

const recentMessages = new Map();

export function trackMessage(jid, msgKey) {
  if (!recentMessages.has(jid)) recentMessages.set(jid, []);
  const list = recentMessages.get(jid);
  list.push(msgKey);
  if (list.length > 100) list.shift();
}

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const count = Math.min(parseInt(args[0]) || 10, 50);
  try {
    const list = recentMessages.get(jid) || [];
    const toDelete = list.slice(-count);
    if (!toDelete.length) {
      return natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Aucun message en cache à supprimer. (Max ${count})` }, { quoted: msg });
    }
    await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚜️ Purge de ${toDelete.length} messages en cours...` }, { quoted: msg });
    for (const key of toDelete) {
      await natsu.sendMessage(jid, { delete: key }).catch(() => {});
    }
    recentMessages.set(jid, list.slice(0, list.length - toDelete.length));
    await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ ${toDelete.length} messages supprimés.` });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Erreur purge : " + e.message }, { quoted: msg });
  }
}
