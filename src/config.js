import dotenv from "dotenv";
dotenv.config();

export const BOT_NAME = "𝖵𝖤𝖫𝖳𝖱𝖨𝖷 𝖷𝖬𝖣";
export const BOT_VERSION = "2.0";
export const BOT_DEV = "NATSUorDENTSU";

export const OWNER_NUMBERS = (process.env.OWNER_NUMBERS || "224610835573,224669288332")
  .split(",")
  .map((n) => n.trim().replace(/[^0-9]/g, ""))
  .filter(Boolean);

export const CHANNELS = {
  whatsapp1: "https://whatsapp.com/channel/0029VbD1VM09Bb5zhsXYeI2n",
  whatsapp2: "https://whatsapp.com/channel/0029Vb7q4urGehEDh39zll3H",
  telegram1: "t.me/Varnox_Or_novark",
  telegram2: "t.me/varnox_official",
};

export const NEWSLETTER_IDS = [
  "120363373387302754@newsletter",
  "120363408953987969@newsletter",
  "120363425458450099@newsletter",
  "120363423640959729@newsletter",
];

export const BOT_IMAGE = process.env.BOT_IMAGE || "https://files.catbox.moe/cceb4k.jpg";
export const MENU_AUDIO = process.env.MENU_AUDIO || "https://gangalink.vercel.app/i/x9l8efb8.mp4";

export const PREFIX = process.env.PREFIX || ".";
export const AUTH_DIR = process.env.AUTH_DIR || "./auth_info_baileys";
export const RECONNECT_DELAY = parseInt(process.env.RECONNECT_DELAY) || 5000;
export const PORT = parseInt(process.env.PORT) || 3000;
export const SESSION_SECRET = process.env.SESSION_SECRET || "veltrix-xmd-secret-2026";
