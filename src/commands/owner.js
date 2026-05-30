import { BOT_NAME, OWNER_NUMBERS, CHANNELS } from "../config.js";

export const name = "owner";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const text = `╔═══•❥🌑•══════╗
        🏅 ${BOT_NAME} 🏅
╚═══•❥🌑•══════╝

╔═══•⊰👁️‍🗨️⊱•══════╗
     🕷️ DEV BY NATSU 🕷️
╚═══•⊰👁️‍🗨️⊱•══════╝

│ 🖤 natsu : +${OWNER_NUMBERS[0] || "N/A"}
│ 🖤 contact : +${OWNER_NUMBERS[1] || "N/A"}
│ 🖤 Telegram : ${CHANNELS.telegram1}

╭── 🔮 Canaux Officiels 🔮 ──╮
│ 🕯️ WhatsApp :  
│ ${CHANNELS.whatsapp1}  
│
│ 🕯️ WhatsApp 2 :
│ ${CHANNELS.whatsapp2}
│
│ 🕯️ Telegram :  
│ ${CHANNELS.telegram2}  
╰━━━━━━━━━━━━━━━━╯`;
  await natsu.sendMessage(jid, { text }, { quoted: msg });
}
