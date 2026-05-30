import { CHANNELS, NEWSLETTER_IDS } from "../config.js";

export const name = "autojoin";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off", "status"].includes(args[0])) {
    return natsu.sendMessage(jid, {
      text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 📡 Auto-join Newsletter\n\nUsage :\n.autojoin on — Rejoindre les canaux officiels\n.autojoin off — Se désabonner\n.autojoin status — Voir les canaux\n\n🌐 Canaux :\n${CHANNELS.whatsapp1}\n${CHANNELS.whatsapp2}`,
    }, { quoted: msg });
  }
  if (args[0] === "status") {
    return natsu.sendMessage(jid, {
      text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 📡 *Canaux Officiels*\n\n🌐 WhatsApp 1 : ${CHANNELS.whatsapp1}\n🌐 WhatsApp 2 : ${CHANNELS.whatsapp2}\n📱 Telegram : ${CHANNELS.telegram1}`,
    }, { quoted: msg });
  }
  const results = [];
  for (const id of NEWSLETTER_IDS) {
    try {
      if (args[0] === "on" && typeof natsu.newsletterFollow === "function") {
        await natsu.newsletterFollow(id);
        results.push(`✅ Rejoint`);
      } else if (args[0] === "off" && typeof natsu.newsletterUnfollow === "function") {
        await natsu.newsletterUnfollow(id);
        results.push(`✅ Quitté`);
      } else {
        results.push(`⚠️ Action non supportée`);
      }
    } catch (e) {
      results.push(`❌ Erreur : ${e.message}`);
    }
  }
  await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: 📡 Résultat auto-join :\n${results.join("\n")}` }, { quoted: msg });
}
