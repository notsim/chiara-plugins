# Trigger

Il campo `trigger` decide **quando** il plugin risponde. Ci sono 3 tipi.

## `regex` — espressione regolare

Il più potente e deterministico. Usa i **gruppi di cattura** `()` per estrarre parti del messaggio, accessibili con `{{capture:N}}`.

```json
{
  "trigger": { "type": "regex", "pattern": "^meteo(?: a| per| in)? (.+)$", "flags": "i" },
  "actions": [
    { "type": "tool", "tool": "METEO", "input": "{{capture:1}}", "template": "{{result}}" }
  ]
}
```

- `pattern` è una regex JavaScript (RE2-like, senza lookbehind).
- `flags` opzionale (es. `"i"` per case-insensitive).
- `{{capture:1}}` = primo gruppo, `{{capture:2}}` = secondo, ecc.

## `command` — comando esatto

Per i comandi stile `/comando`. Match **esatto** e case-insensitive.

```json
{ "trigger": { "type": "command", "command": "/conta" } }
```

## `intent` — intenzione (via LLM)

Per ciò che è difficile da esprimere con una regex. Il bot classifica il messaggio con **una sola** chiamata al modello e attiva il plugin se l'intent corrisponde.

```json
{
  "trigger": {
    "type": "intent",
    "intent": "l'utente è demotivato, triste, giù di morale o cerca una spinta positiva"
  }
}
```

⚠️ Gli `intent` consumano token AI. Usali con parsimonia e scrivi una descrizione chiara e specifica: più è precisa, meglio classifica.

## Ordine di valutazione

1. Prima tutti i trigger `regex` e `command` (gratuiti, deterministici).
2. Solo se nessuno ha fatto match, si valuta l'`intent`.

Un messaggio attiva **un solo plugin** (il primo che fa match).
