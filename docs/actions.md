# Azioni

`actions` è una lista ordinata di azioni. Con `if`/`goto`/`label`/`ask`/`end` puoi costruire veri **flussi** (quiz, wizard, percorsi guidati).

## Risposta

### `reply` — template
```json
{ "type": "reply", "template": "Ciao {{user_name||amico}}! 👋" }
```

### `random` — una a caso
```json
{ "type": "random", "options": ["💪 Opzione 1", "✨ Opzione 2"] }
```

## Dati

### `data` (campo del manifest) + `lookup`
Il plugin può incapsulare un **dataset** e cercare per chiave:
```json
{
  "data": [
    { "key": "mela", "calorie": "52 kcal / 100 g" },
    { "key": "pizza", "calorie": "~266 kcal / 100 g" }
  ],
  "actions": [
    { "type": "lookup", "key": "{{capture:1}}", "template": "🍎 *{{key}}*: {{calorie}}", "fallback": "Non trovato" }
  ]
}
```
`lookup` cerca la riga con `key` uguale (case-insensitive); se la trova, i campi della riga diventano placeholder (`{{key}}`, `{{calorie}}`, …). Se non la trova, usa `fallback`.

## Tool

### `tool` — tool whitelistato
```json
{ "type": "tool", "tool": "CALC", "input": "{{capture:1}}", "template": "🧮 *{{result}}*" }
```
Tool disponibili: `CALC`, `TIME`, `METEO`, `REMIND`, `UNITA`, `VALUTA`, `HASH`, `PASSWORD`, `UUID`, `BASE64`, `JSON`, `DIFF`, `REGEX`, `TS`, `CRON`, `DNS`, `IVA`, `RATA`, `SPLIT`, `MEDIA`, `DELTA`, `PERCENTUALE`, `SCONTO`, `FATTORIALE`, `PRIMI`, `MCD`, `MCM`, `BIN`, `HEX`, `ROMANO`, `BASE`, `TEMP`, `IMC`, `ETA`, `GIORNO`, `COUNTDOWN`, `DADI`, `MONETA`, `CASUALE`, `SCEGLI`, `PALINDROMO`, `ANAGRAMMA`, `CONTA`, `INVERTI`, `SLUG`, `ROT13`, `MORSE`.

## Stato

### `store` / `read` — persistente per utente
```json
[
  { "type": "read", "key": "count" },
  { "type": "tool", "tool": "CALC", "input": "{{value||0}} + 1" },
  { "type": "store", "key": "count", "value": "{{result}}" },
  { "type": "reply", "template": "Hai usato il comando *{{result}}* volte!" }
]
```

### `set` — variabile di flusso
```json
{ "type": "set", "variable": "punteggio", "value": "{{result}}" }
```

## Flusso multi-turno

### `ask` — fa una domanda e sospende
```json
{ "type": "ask", "variable": "risposta", "prompt": "❓ Qual è la capitale dell'Australia?" }
```
Il plugin si mette in pausa: il prossimo messaggio dell'utente viene messo in `{{risposta}}` e l'esecuzione riprende dall'azione successiva.

### `if` — ramo condizionale
```json
{
  "type": "if", "variable": "risposta", "contains": "canberra",
  "then": [ { "type": "reply", "template": "✅ Esatto!" } ],
  "else": [ { "type": "reply", "template": "❌ No!" } ]
}
```
Condizioni: `equals` (uguaglianza) o `contains` (sottostringa), entrambe case-insensitive.

### `goto` / `label` — salti e loop
```json
[
  { "type": "label", "id": "domanda" },
  { "type": "ask", "variable": "r", "prompt": "Dimmi un numero" },
  { "type": "goto", "id": "domanda" }
]
```

### `end` — termina il flusso
```json
{ "type": "end" }
```

## Uscire da un flusso
L'utente può interrompere qualsiasi flusso scrivendo `/annulla`.

## Placeholder

| Placeholder | Valore |
|---|---|
| `{{user_name}}` | nome utente |
| `{{phone}}` | numero di telefono |
| `{{text}}` | messaggio completo |
| `{{capture:N}}` | gruppo N della regex |
| `{{result}}` | risultato ultimo `tool` |
| `{{value}}` | valore letto con `read` |
| `{{nome||fallback}}` | valore con default |

## Esempio completo

Vedi `examples/quiz/` per un quiz multi-turno con punteggio, e `examples/calorie/` per un dataset→bot.
