import { BOT_NAME, BOT_VERSION, BOT_DEV, CHANNELS, BOT_IMAGE, MENU_AUDIO, PREFIX } from "../config.js";

export const name = "menu";

export async function execute(natsu, msg, args, from) {
  try {
    const jid = from || msg.key.remoteJid;
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const uptimeStr = `${h}h ${m}m ${s}s`;
    const p = PREFIX;

    const caption = `
╭━━━ 〔 ${BOT_NAME} 〕
┃✪╭━━━━━━━━━━━━━━━━≽
┃✪│🥷🏾 *USER* : ${msg.pushName || "Invité"}
┃✪│⚙️ *MODE*     : 🔒 Privé
┃✪│⏱️ *UPTIME*   : ${uptimeStr}
┃✪│📱 *VERSION*   : ${BOT_VERSION}
┃✪│🧎🏾 *DEV* : _${BOT_DEV}_
╰━━━━━━━━━━━━━━━━≽
➥ ❐  ⌜♻️UTILITY⌟ 
┃✪│❍${p}delete
┃✪│❍${p}vv
┃✪│❍${p}device
┃✪│❍${p}infos
┃✪│❍${p}ping
┃✪│❍${p}whois
┃✪│❍${p}autorecording on/off
┃✪│❍${p}setpp
╰━━━━━━━━━━━━━━━━≽
➥❐    ⌜🔷️SUDO⌟
┃✪│❍${p}delsudo
┃✪│❍${p}listsudo
┃✪│❍${p}setsudo
╰━━━━━━━━━━━━━━━━≽
➥❐    ⌜👤GROUPS⌟
┃✪│❍${p}add
┃✪│❍${p}demote @
┃✪│❍${p}demoteall
┃✪│❍${p}gclink
┃✪│❍${p}infosgroups
┃✪│❍${p}kick @
┃✪│❍${p}kickall
┃✪│❍${p}left
┃✪│❍${p}listonline
┃✪│❍${p}mute
┃✪│❍${p}unmute
┃✪│❍${p}mute-time HH:MM
┃✪│❍${p}promote @
┃✪│❍${p}promoteall
┃✪│❍${p}principal
┃✪│❍${p}tag <msg>
┃✪│❍${p}tagadmin
┃✪│❍${p}tagall
┃✪│❍${p}writetoall <msg>
┃✪│❍${p}settimeg HH:MM open/close
╰━━━━━━━━━━━━━━━━≽
➥❐    ⌜🛡SECURITY⌟
┃✪│❍${p}antibot on/off
┃✪│❍${p}antidemote on/off
┃✪│❍${p}antilink on/off
┃✪│❍${p}antipromote on/off
┃✪│❍${p}antispam on/off
┃✪│❍${p}warnadmin on/off
╰━━━━━━━━━━━━━━━━≽
➥❐    ⌜🎬MEDIAS⌟
┃✪│❍${p}photo
┃✪│❍${p}save
┃✪│❍${p}sticker
┃✪│❍${p}url
╰━━━━━━━━━━━━━━━━≽
➥❐     ⌜💎FUN⌟
┃✪│❍${p}wasted @
╰━━━━━━━━━━━━━━━━≽
➥❐     ⌜📡CANAUX⌟
┃✪│❍${p}autojoin on/off/status
┃✪│❍${p}owner
╰━━━━━━━━━━━━━━━━≽

> ©2026 ${BOT_NAME} powered by ${BOT_DEV}`;

    await natsu.sendMessage(jid, { image: { url: BOT_IMAGE }, caption, gifPlayback: true }, { quoted: msg });
    await natsu.sendMessage(jid, { audio: { url: MENU_AUDIO }, mimetype: "audio/mpeg" }, { quoted: msg });
  } catch (e) {
    console.error("Erreur commande menu:", e);
    await natsu.sendMessage(from || msg.key.remoteJid, { text: "> ⚠️ Impossible d'afficher le menu." });
  }
}
