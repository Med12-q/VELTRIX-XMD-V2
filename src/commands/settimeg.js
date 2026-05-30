export const name = "settimeg";
const groupSchedules = {};

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Commande de groupe uniquement." }, { quoted: msg });
  }
  if (args.length < 2) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Usage : .settimeg HH:MM <open/close>\nExemple : .settimeg 08:00 open" }, { quoted: msg });
  }
  const [time, action] = args;
  if (!["open", "close"].includes(action)) {
    return natsu.sendMessage(jid, { text: "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: Action doit être 'open' ou 'close'." }, { quoted: msg });
  }
  if (!groupSchedules[jid]) groupSchedules[jid] = [];
  groupSchedules[jid].push({ time, action });
  if (!groupSchedules._interval) {
    groupSchedules._interval = setInterval(async () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      for (const [gid, tasks] of Object.entries(groupSchedules)) {
        if (gid === "_interval") continue;
        for (const task of tasks) {
          if (task.time === currentTime) {
            try {
              const setting = task.action === "open" ? "not_announcement" : "announcement";
              await natsu.groupSettingUpdate(gid, setting);
              const txt = task.action === "open" ? "🟢 Le groupe est maintenant *ouvert* !" : "🔴 Le groupe est maintenant *fermé* !";
              await natsu.sendMessage(gid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ${txt}` });
            } catch (e) { console.error("Erreur settimeg:", e); }
          }
        }
      }
    }, 60 * 1000);
  }
  await natsu.sendMessage(jid, { text: `𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣: ✅ Planifié : *${action}* à *${time}* !` }, { quoted: msg });
}
