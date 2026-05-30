export const name = "mute-time";
const scheduled = {};

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ❌ Commande de groupe uniquement." }, { quoted: msg });
  }
  if (!args[0]) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⏰ Usage : .mute-time HH:MM\nExemple : .mute-time 00:10 (dans 10 minutes)" }, { quoted: msg });
  }
  const match = args[0].match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Format invalide. Exemple : .mute-time 00:10" }, { quoted: msg });
  const delayMs = (parseInt(match[1]) * 60 + parseInt(match[2])) * 60 * 1000;
  if (delayMs <= 0) return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⚠️ Durée invalide." }, { quoted: msg });
  await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ⏰ Le groupe sera muté dans ${args[0]}.` }, { quoted: msg });
  if (scheduled[jid]) clearTimeout(scheduled[jid]);
  scheduled[jid] = setTimeout(async () => {
    try {
      await natsu.groupSettingUpdate(jid, "announcement");
      await natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 🔴 Le groupe est maintenant *fermé* !" });
    } catch (e) { console.error("Erreur mute-time:", e); }
  }, delayMs);
}
