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

const ACTION_TYPES = new Set(["reply", "random", "tool", "lookup", "store", "read", "set", "ask", "if", "goto", "label", "end", "http"]);
const TRIGGER_TYPES = new Set(["regex", "command", "intent"]);

function validatePlugin(p, file) {
  const err = (m) => new Error(`${file}: ${m}`);
  if (!p || typeof p !== "object") throw err("manifest non valido (atteso oggetto JSON)");
  if (p.schemaVersion !== 1) throw err("schemaVersion deve essere 1");
  if (typeof p.id !== "string" || !/^[a-z0-9][a-z0-9._-]{0,63}$/i.test(p.id)) throw err("id non valido (solo lettere, numeri, . _ -)");
  if (typeof p.name !== "string" || !p.name.trim()) throw err("name obbligatorio");
  if (typeof p.version !== "string" || !p.version.trim()) throw err("version obbligatoria");
  if (!p.trigger || typeof p.trigger !== "object") throw err("trigger obbligatorio");
  if (!TRIGGER_TYPES.has(p.trigger.type)) throw err("trigger.type non valido (regex|command|intent)");
  if (p.trigger.type === "regex" && typeof p.trigger.pattern !== "string") throw err("trigger.pattern obbligatorio per type=regex");
  if (p.trigger.type === "command" && typeof p.trigger.command !== "string") throw err("trigger.command obbligatorio per type=command");
  if (p.trigger.type === "intent" && typeof p.trigger.intent !== "string") throw err("trigger.intent obbligatorio per type=intent");
  if (p.data !== undefined && (!Array.isArray(p.data) || p.data.some((d) => !d || typeof d !== "object" || typeof d.key !== "string"))) {
    throw err('data deve essere un array di oggetti con campo "key" stringa');
  }
  if (p.permissions !== undefined && (!Array.isArray(p.permissions) || p.permissions.some((perm) => typeof perm !== "string"))) {
    throw err('permissions deve essere un array di stringhe (es. ["phone", "name", "address"])');
  }
  if (p.endpoint !== undefined) {
    if (typeof p.endpoint !== "object" || typeof p.endpoint.url !== "string") {
      throw err("endpoint deve essere un oggetto con campo url stringa");
    }
  }
  if (!Array.isArray(p.actions) || p.actions.length === 0) throw err("actions deve essere un array non vuoto");
  const checkActions = (list) => {
    for (const a of list) {
      if (!a || typeof a !== "object" || !ACTION_TYPES.has(a.type)) {
        throw err(`azione non valida (tipi ammessi: ${[...ACTION_TYPES].join(", ")})`);
      }
      if (a.type === "tool" && !SAFE_TOOLS.has(a.tool)) throw err(`tool non whitelistato: ${a.tool}`);
      if (a.type === "lookup" && typeof a.key !== "string") throw err("lookup richiede key");
      if (a.type === "store" || a.type === "read") { if (typeof a.key !== "string") throw err(`${a.type} richiede key`); }
      if (a.type === "set") { if (typeof a.variable !== "string") throw err("set richiede variable"); }
      if (a.type === "ask") { if (typeof a.variable !== "string" || typeof a.prompt !== "string") throw err("ask richiede variable e prompt"); }
      if (a.type === "http") {
        if (!a.url && !p.endpoint?.url) throw err("http richiede url o endpoint.url nel manifest");
      }
      if (a.type === "if") {
        if (typeof a.variable !== "string") throw err("if richiede variable");
        if (a.equals === undefined && a.contains === undefined) throw err("if richiede equals o contains");
        if (!Array.isArray(a.then)) throw err("if richiede then (array)");
        checkActions(a.then);
        if (a.else !== undefined) { if (!Array.isArray(a.else)) throw err("if.else deve essere un array"); checkActions(a.else); }
      }
      if (a.type === "goto" || a.type === "label") { if (typeof a.id !== "string") throw err(`${a.type} richiede id`); }
    }
  };
  checkActions(p.actions);
  if (p.tier !== undefined && p.tier !== "free" && p.tier !== "ultra") throw err('tier deve essere "free" o "ultra"');
  return true;
}

function collectManifests(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  const direct = path.join(target, "plugin.json");
  if (fs.existsSync(direct)) return [direct];
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
