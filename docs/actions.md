# Azioni

`actions` è una lista ordinata di azioni eseguite in sequenza. L'ultima azione che produce output è la risposta inviata all'utente.

## `reply` — risposta con template

```json
{ "type": "reply", "template": "Ciao {{user_name||amico}}! 👋" }
```

## `random` — una risposta a caso

```json
{ "type": "random", "options": ["💪 Opzione 1", "✨ Opzione 2", "🌱 Opzione 3"] }
```

## `tool` — chiama un tool whitelistato

```json
{ "type": "tool", "tool": "CALC", "input": "{{capture:1}}", "template": "🧮 Risultato: *{{result}}*" }
```

- `tool`: nome del tool (vedi lista sotto).
- `input`: testo passato al tool (può contenere placeholder).
- `template` (opzionale): come mostrare il risultato. Se assente, viene restituito il risultato grezzo.
- Il risultato del tool è disponibile come `{{result}}`.

### Tool disponibili

`CALC`, `TIME`, `METEO`, `REMIND`, `UNITA`, `VALUTA`, `HASH`, `PASSWORD`, `UUID`, `BASE64`, `JSON`, `DIFF`, `REGEX`, `TS`, `CRON`, `DNS`, `IVA`, `RATA`, `SPLIT`, `MEDIA`, `DELTA`, `PERCENTUALE`, `SCONTO`, `FATTORIALE`, `PRIMI`, `MCD`, `MCM`, `BIN`, `HEX`, `ROMANO`, `BASE`, `TEMP`, `IMC`, `ETA`, `GIORNO`, `COUNTDOWN`, `DADI`, `MONETA`, `CASUALE`, `SCEGLI`, `PALINDROMO`, `ANAGRAMMA`, `CONTA`, `INVERTI`, `SLUG`, `ROT13`, `MORSE`

## `store` / `read` — stato per-utente

Salva e rilegge un valore associato all'utente (utile per contatori, quiz, preferenze). Lo stato è **per utente + per plugin**.

```json
[
  { "type": "read",  "key": "count" },
  { "type": "tool",  "tool": "CALC", "input": "{{value||0}} + 1" },
  { "type": "store", "key": "count", "value": "{{result}}" },
  { "type": "reply", "template": "🔢 Hai usato il comando *{{result}}* volte!" }
]
```

- `store` è **silenzioso** (non produce output).
- `read` espone il valore come `{{value}}` e, se ha un `template`, produce output.

## Placeholder

| Placeholder | Valore |
|---|---|
| `{{user_name}}` | nome dell'utente (da dashboard) |
| `{{phone}}` | numero di telefono |
| `{{text}}` | messaggio completo |
| `{{capture:N}}` | gruppo N della regex |
| `{{result}}` | risultato dell'ultimo `tool` |
| `{{value}}` | valore letto con `read` |
| `{{nome||fallback}}` | sintassi con valore di default |

## Regola d'oro

Un'azione di tipo `reply`, `random`, `tool` (con template) o `read` (con template) **sovrascrive** l'output precedente. Metti la risposta finale per ultima.
