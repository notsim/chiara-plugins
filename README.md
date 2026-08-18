# Chiara Plugins

Plugin **dichiarativi (no-code)** per [Chiara](https://heychiara.xyz), l'assistente personale su WhatsApp.

Un plugin è un semplice file `plugin.json`: descrivi *quando* attivarlo e *cosa rispondere*. **Nessun codice viene eseguito sul server** — solo azioni whitelistate. Zero rischio, zero costi, 100% in locale.

## Cosa puoi costruire

- **Dataset → bot**: incapsula una tabella (`data` + `lookup`) e rispondi alle domande. Es. calorie alimenti, dizionario dialetto, FAQ di un negozio, orari, prezzi.
- **Quiz e giochi**: flussi multi-turno con punteggio (`ask`, `if`, `set`, `goto`). Es. quiz di storia, indovinelli con contatore.
- **Wizard e questionari**: percorsi guidati che fanno domande e reagiscono alle risposte.
- **Calcolatori specializzati**: combinando `tool` whitelistati (matematica, valute, IVA, mutui, hash…).
- **Contenuti interattivi**: frasi, ricette, checklist, consigli, oroscopi.

Tutto dichiarativo: chi possiede un contenuto lo trasforma in una feature del bot **senza saper programmare**.

## Perché dichiarativo?

Il bot processa messaggi da utenti sconosciuti: eseguire codice arbitrario dei plugin sarebbe una vulnerabilità (RCE). Il formato dichiarativo elimina del tutto questo rischio: il manifest viene **validato** e le azioni sono un insieme chiuso e sicuro.

## Anatomia di un plugin

```json
{
  "schemaVersion": 1,
  "id": "hello",
  "name": "Saluto",
  "description": "Risponde ai saluti",
  "version": "1.0.0",
  "author": { "name": "Chiara Team", "email": "contattaci@chiara-agente.it" },
  "tier": "free",
  "trigger": { "type": "regex", "pattern": "^(ciao|salve|hey)$", "flags": "i" },
  "actions": [
    { "type": "reply", "template": "Ciao {{user_name||amico}}! 👋" }
  ]
}
```

- **`trigger`** — quando scatta il plugin (vedi [docs/triggers.md](docs/triggers.md))
- **`data`** — dataset opzionale per risposte basate su tabella
- **`actions`** — cosa fa, in ordine: risposte, lookup, tool, e flussi multi-turno (vedi [docs/actions.md](docs/actions.md))
- **`tier`** — `free` (tutti) o `ultra` (solo piano ULTRA)

## Avvio rapido

1. Copia `examples/hello/` e modifica `plugin.json`.
2. Valida:
   ```bash
   npm run validate examples
   ```
3. Invia una **Pull Request**: i plugin in `plugins/` sono **curati** (ogni contributo passa una review manuale prima di finire in produzione).

## Struttura del repo

```
├── schema/plugin.schema.json   # JSON Schema del manifest (draft-07)
├── src/validate.js             # validatore standalone (CLI, zero dipendenze)
├── examples/                   # plugin d'esempio (hello, calcola, motivation, conta)
├── plugins/                    # plugin curati che girano in produzione
└── docs/                       # triggers.md, actions.md, getting-started.md
```

## Documentazione

- [Guida introduttiva](docs/getting-started.md)
- [Trigger](docs/triggers.md)
- [Azioni](docs/actions.md)

## Sicurezza

- Solo azioni whitelistate (nessun `eval`, nessun comando shell, nessuna rete).
- Un manifest non valido viene **saltato** (mai blocca il bot).
- I plugin entrano in produzione solo dopo **review manuale**.
