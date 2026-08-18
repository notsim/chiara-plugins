<div align="center">

<img src="assets/banner.png" alt="Chiara Plugins" width="100%" />

# 🧩 Chiara Plugins

**Plugin dichiarativi, no-code e sicuri per [Chiara](https://heychiara.xyz)** — l'assistente personale su WhatsApp.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![No-code](https://img.shields.io/badge/No--code-100%25-7c3aed?style=flat-square)]()
[![Dichiarativo](https://img.shields.io/badge/Dichiarativo-JSON-6366f1?style=flat-square)]()
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-22c55e?style=flat-square)]()
[![Schema](https://img.shields.io/badge/Schema-v1-0ea5e9?style=flat-square)]()

*Scrivi un `plugin.json`, il bot fa il resto. Nessun codice sul server, zero rischi.*

</div>

---

## ✨ Cosa puoi costruire

| 🧩 Idea | 💡 Esempio | 🛠️ Come |
|---|---|---|
| 🍕 **Aziende & Ordini** | Pizzerie, barbieri, negozi, prenotazioni | `ask` + `http` webhook (es. Telegram/Make) · [👉 Guida Aziende](docs/guida-aziende.md) |
| 📊 **Dataset → bot** | "quante calorie ha una mela?" | `data` + `lookup` |
| 🎯 **Quiz e giochi** | quiz con punteggio | `ask` + `if` + `set` + `goto` |
| 🧭 **Wizard e questionari** | percorsi guidati | flusso multi-turno |
| 🧮 **Calcolatori specializzati** | IVA, mutui, conversioni | `tool` whitelistati |
| 📚 **Contenuti interattivi** | ricette, dizionari, oroscopi | `reply` + `random` |

> 💬 **Il valore per aziende & community**: chiunque possiede un'attività, un contenuto o un servizio
> lo integra nel bot **a costo zero e senza bisogno di un sito web o server**. Leggi la [🏢 Guida Completa per Aziende](docs/guida-aziende.md).

---

## 🔄 Come funziona

```
Messaggio utente
      │
      ▼
┌─────────────────────┐     match?      ┌──────────────────────┐
│  TRIGGER             │ ──────────────▶ │  AZIONI (in ordine)  │
│  regex / command /   │                │  reply · lookup ·    │
│  intent (AI)         │                │  tool · ask · if …   │
└─────────────────────┘                └──────────┬───────────┘
                                                  ▼
                                        📤 Risposta su WhatsApp
```

- **Trigger** = quando scatta
- **Azioni** = cosa fa
- **Stato** = cosa ricorda per utente (flussi multi-turno)

---

## 🧬 Anatomia di un plugin

```json
{
  "schemaVersion": 1,
  "id": "hello",
  "name": "Saluto",
  "description": "Risponde ai saluti",
  "version": "1.0.0",
  "author": { "name": "Chiara Team", "email": "contattaci@heychiara.xyz" },
  "tier": "free",
  "trigger": { "type": "regex", "pattern": "^(ciao|salve|hey)$", "flags": "i" },
  "actions": [
    { "type": "reply", "template": "Ciao {{user_name||amico}}! 👋" }
  ]
}
```

---

## 🎯 Trigger

| Tipo | Quando scatta | Esempio |
|---|---|---|
| 🔤 `regex` | match su espressione regolare | `"^(ciao|salve)$"` |
| ⌨️ `command` | comando esatto | `"/quiz"` |
| 🧠 `intent` | l'AI riconosce l'intenzione | `"l'utente è giù di morale"` |

---

## ⚙️ Azioni

| Azione | Cosa fa |
|---|---|
| 💬 `reply` | risponde con un template |
| 🎲 `random` | sceglie una tra più risposte |
| 🛠️ `tool` | chiama un tool whitelistato (calcoli, meteo, valute…) |
| 🔍 `lookup` | cerca una voce nel **dataset** |
| 💾 `store` / `read` | stato persistente per utente |
| ✏️ `set` | assegna una variabile |
| ❓ `ask` | fa una domanda e aspetta la risposta |
| 🔀 `if` | ramo condizionale (`then` / `else`) |
| 🔁 `goto` / `label` | salti e loop |
| 🏁 `end` | termina il flusso |

---

## 🎬 Demo dal vivo

**Quiz multi-turno con punteggio** (`examples/quiz`):

```
👤 /quiz
🤖 ❓ Domanda 1/3: Qual è la capitale dell'Australia?
👤 canberra
🤖 ✅ Esatto! 👍  ❓ Domanda 2/3: Quanti lati ha un esagono?
👤 6
🤖 ✅ Esatto! 👍  ❓ Domanda 3/3: Chi ha dipinto la Gioconda?
👤 leonardo
🤖 ✅ Esatto! 👍  🏁 Quiz finito! Punteggio: 3/3
```

**Dataset → bot** (`examples/calorie`):

```
👤 quante calorie ha una mela?
🤖 🍎 mela: 52 kcal / 100 g
```

---

## 🚀 Avvio rapido

```bash
# 1. Copia un esempio
cp -r examples/hello mio-plugin

# 2. Modifica plugin.json

# 3. Valida
npm run validate mio-plugin

# 4. Apri una Pull Request ✨
```

---

## 📁 Struttura del repo

```
chiara-plugins/
├── assets/banner.png          # banner
├── schema/plugin.schema.json  # JSON Schema (draft-07)
├── src/validate.js            # validatore CLI (zero dipendenze)
├── examples/                  # hello, calcola, calorie, quiz, conta, motivation
├── plugins/                   # plugin curati (in produzione)
└── docs/                      # triggers.md · actions.md · getting-started.md
```

---

## 🔐 Sicurezza

- 🚫 **Nessun codice utente**: solo azioni whitelistate (niente `eval`, shell o rete).
- 🛡️ **Fail-safe**: un manifest non valido viene ignorato, mai blocca il bot.
- 👀 **Curato**: ogni plugin entra in produzione solo dopo **review manuale**.

---

## 📖 Documentazione

- [Guida introduttiva](docs/getting-started.md)
- [Trigger](docs/triggers.md)
- [Azioni](docs/actions.md)

---

<div align="center">

**Fatto con 💙 per la community di Chiara**

[🌐 heychiara.xyz](https://heychiara.xyz) · [💬 WhatsApp](https://wa.me/393892334300) · [📧 contattaci@heychiara.xyz](mailto:contattaci@heychiara.xyz)

</div>
