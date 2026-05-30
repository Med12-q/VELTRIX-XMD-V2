import JavaScriptObfuscator from "javascript-obfuscator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "../src");
const DIST = path.resolve(__dirname, "../dist");

const OBFUSCATOR_OPTIONS = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: "hexadecimal",
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ["base64"],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: "function",
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: false,
  target: "node",
};

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.name.endsWith(".js")) {
      console.log(`  [obfuscate] ${path.relative(SRC, srcPath)}`);
      const code = fs.readFileSync(srcPath, "utf-8");
      try {
        const result = JavaScriptObfuscator.obfuscate(code, OBFUSCATOR_OPTIONS);
        fs.writeFileSync(destPath, result.getObfuscatedCode(), "utf-8");
      } catch (e) {
        console.warn(`  [warn] Obfuscation échouée pour ${entry.name}, copie brute : ${e.message}`);
        fs.copyFileSync(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log("\n🔒 VELTRIX XMD — Build & Obfuscation\n");
if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
fs.mkdirSync(DIST, { recursive: true });

console.log("📦 Obfuscation du code source...");
copyDir(SRC, DIST);

const publicDest = path.resolve(__dirname, "../dist-public");
if (!fs.existsSync(publicDest)) {
  console.log("📁 Copie du dossier public...");
  fs.mkdirSync(publicDest, { recursive: true });
  for (const f of fs.readdirSync(path.resolve(__dirname, "../public"))) {
    fs.copyFileSync(
      path.join(path.resolve(__dirname, "../public"), f),
      path.join(publicDest, f)
    );
  }
}

console.log("\n✅ Build terminé ! Lance avec : node dist/index.js\n");
