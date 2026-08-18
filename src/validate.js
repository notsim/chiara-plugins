#!/usr/bin/env node
/**
 * Validatore dei plugin Chiara (nessuna dipendenza).
 *
 * Uso:
 *   node src/validate.js <file-plugin.json | directory>
 *
 * Esce con codice 0 se tutti i manifest sono validi, 1 altrimenti.
 */
const fs = require("fs");
const path = require("path");

// Whitelist dei tool richiamabili (deve restare allineata al motore in chiara-alpha).
const SAFE_TOOLS = new Set([
  "CALC", "CALCOLO", "TIME", "ORA", "DATA", "METEO", "REMIND",
  "UNITA", "VALUTA", "HASH", "PASSWORD", "UUID", "BASE64", "JSON", "DIFF",
  "REGEX", "TS", "CRON", "DNS", "IVA", "RATA", "SPLIT", "MEDIA", "DELTA",
  "PERCENTUALE", "SCONTO", "FATTORIALE", "PRIMI", "MCD", "MCM", "BIN", "HEX",
  "ROMANO", "BASE", "TEMP", "IMC", "ETA", "GIORNO", "COUNTDOWN", "DADI",
  "MONETA", "CASUALE", "SCEGLI", "PALINDROMO", "ANAGRAMMA", "CONTA",
  "INVERTI", "SLUG", "ROT13", "MORSE"
]);

const ACTION_TYPES = new Set(["reply", "random", "tool", "store", "read"]);
const TRIGGER_TYPES = new Set(["regex", "command", "intent"]);

function validatePlugin(p, file) {
  const err = (m) => new Error(`${file}: ${m}`);
  if (!p || typeof p !== "object") throw err("manifest non valido (atteso oggetto JSON)");
  if (p.schemaVersion !== 1) throw err("schemaVersion deve essere 1");
  if (typeof p.id !== "string" || !/^[a-z0-9][a-z0-9._-]{0,63}$/i.test(p.id)) throw err("id non valido (solo lettere, numeri, . _ -)");
  if (typeof p.name !== "string" || !p.name.trim()) throw err("name obbligatorio");
  if (typeof p.version !== "string" || !p.version.trim()) throw err("version obbligatoria");
  if (!p.trigger || typeof p.trigger !== "object") throw err("trigger obbligatorio");
  if (!TRIGGER_TYPES.has(p.trigger.type)) throw err(`trigger.type non valido (regex|command|intent)`);
  if (p.trigger.type === "regex" && typeof p.trigger.pattern !== "string") throw err("trigger.pattern obbligatorio per type=regex");
  if (p.trigger.type === "command" && typeof p.trigger.command !== "string") throw err("trigger.command obbligatorio per type=command");
  if (p.trigger.type === "intent" && typeof p.trigger.intent !== "string") throw err("trigger.intent obbligatorio per type=intent");
  if (!Array.isArray(p.actions) || p.actions.length === 0) throw err("actions deve essere un array non vuoto");
  for (const a of p.actions) {
    if (!a || typeof a !== "object" || !ACTION_TYPES.has(a.type)) {
      throw err(`azione non valida (tipi ammessi: ${[...ACTION_TYPES].join(", ")})`);
    }
    if (a.type === "tool" && !SAFE_TOOLS.has(a.tool)) throw err(`tool non whitelistato: ${a.tool}`);
  }
  if (p.tier !== undefined && p.tier !== "free" && p.tier !== "ultra") throw err('tier deve essere "free" o "ultra"');
  return true;
}

function collectManifests(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  // Singola cartella plugin (contiene direttamente plugin.json)
  const direct = path.join(target, "plugin.json");
  if (fs.existsSync(direct)) return [direct];
  // Cartella di plugin (sottocartelle con plugin.json)
  const out = [];
  for (const entry of fs.readdirSync(target)) {
    const dir = path.join(target, entry);
    const manifest = path.join(dir, "plugin.json");
    if (fs.existsSync(manifest) && fs.statSync(dir).isDirectory()) out.push(manifest);
  }
  return out;
}

function main() {
  const target = process.argv[2];
  if (!target) {
    console.error("Uso: node src/validate.js <file-plugin.json | directory>");
    process.exit(2);
  }
  const manifests = collectManifests(target);
  if (!manifests.length) {
    console.error("Nessun plugin.json trovato in:", target);
    process.exit(1);
  }
  let ok = 0;
  let fail = 0;
  for (const m of manifests) {
    try {
      const p = JSON.parse(fs.readFileSync(m, "utf8"));
      validatePlugin(p, m);
      console.log(`✅ ${m}`);
      ok++;
    } catch (e) {
      console.error(`❌ ${e.message}`);
      fail++;
    }
  }
  console.log(`\n${ok} validi, ${fail} non validi.`);
  process.exit(fail ? 1 : 0);
}

if (require.main === module) main();

module.exports = { validatePlugin, SAFE_TOOLS, collectManifests };
