# Guida introduttiva

Un plugin Chiara è una cartella contenente un file `plugin.json`. Questa guida ti porta da zero a un plugin funzionante.

## 1. Struttura minima

```
mio-plugin/
└── plugin.json
```

## 2. I campi obbligatori

| Campo | Descrizione |
|---|---|
| `schemaVersion` | sempre `1` |
| `id` | identificatore univoco: solo minuscole, numeri, `.` `_` `-` (es. `mio-oroscopo`) |
| `name` | nome leggibile |
| `version` | versione semantica, es. `1.0.0` |
| `trigger` | quando si attiva |
| `actions` | cosa fa (lista ordinata) |

Campi opzionali: `description`, `author`, `tier` (`free` o `ultra`, default `free`).

## 3. Primo plugin: un saluto

```json
{
  "schemaVersion": 1,
  "id": "hello",
  "name": "Saluto",
  "version": "1.0.0",
  "author": { "name": "Tu" },
  "trigger": { "type": "regex", "pattern": "^(ciao|salve|hey)$", "flags": "i" },
  "actions": [
    { "type": "reply", "template": "Ciao {{user_name||amico}}! 👋" }
  ]
}
```

## 4. Valida

```bash
node src/validate.js mio-plugin
# oppure su tutta la cartella degli esempi
npm run validate examples
```

Se è tutto verde, sei pronto.

## 5. Invia una Pull Request

I plugin che girano in produzione stanno in `plugins/` e sono **curati**: ogni PR passa una review manuale. Criteri di review:

- `id` univoco e non in conflitto con i plugin esistenti.
- trigger specifico (niente pattern troppo larghi che catturano tutto).
- risposte in italiano, tono coerente con Chiara.
- nessuna azione `tool` fuori dalla whitelist.

## 6. Iterazione locale

Per provare un plugin serve un'istanza di Chiara (il motore `src/plugins/`). Nel repo pubblico puoi solo validare il formato; l'esecuzione avviene sul bot.
