import { startBot } from "./bot.js";
import { startWeb } from "./web.js";
import { BOT_NAME, BOT_VERSION, BOT_DEV } from "./config.js";
import { log } from "./utils.js";

console.log("\n╔══════════════════════════════════════════════╗");
console.log(`║   ${BOT_NAME}   v${BOT_VERSION}   ║`);
console.log(`║   Dev by ${BOT_DEV.padEnd(34)}║`);
console.log("║   Dashboard web pour connecter ta session    ║");
console.log("╚══════════════════════════════════════════════╝\n");

(async () => {
  await startWeb();
  log.info("Démarrage du bot WhatsApp...");
  await startBot();
})();
