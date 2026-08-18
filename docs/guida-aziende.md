# 🏢 Guida per le Aziende: Ricevere Ordini e Prenotazioni da WhatsApp (100% Gratis e Senza Sito Web)

Benvenuto! Questa guida spiega come qualsiasi attività commerciale (**pizzeria, ristorante, barbiere, centro estetico, negozio locale o libero professionista**) può creare un plugin per **Chiara** per ricevere ordini e prenotazioni direttamente su WhatsApp dai propri clienti, **senza dover avere un sito web, senza server e a costo zero**.

---

## ⚡ Metodo Consigliato: Notifiche Istantanee su Telegram (Zero Server)

Non hai un gestionale o un server? Nessun problema!  
Puoi far recapitare ogni ordine o prenotazione **istantaneamente sul tuo smartphone via Telegram** (in chat privata o in un gruppo con i tuoi dipendenti/cucina).

### 🛠️ Configurazione in 3 Minuti (Gratis)

1. **Crea il tuo Bot Telegram:**
   * Apri Telegram e cerca **`@BotFather`**.
   * Invia il comando `/newbot`, scegli un nome per il bot (es. *Mario Pizzeria Notifiche*) e uno username (es. *mariopizzeria_bot*).
   * BotFather ti fornirà un **API Token** (es. `7123456789:AAF_xxxxxxxxx`).
2. **Ottieni il tuo Chat ID:**
   * Cerca su Telegram il bot **`@userinfobot`** e premi *Avvia*.
   * Ti restituirà il tuo **Id numerico** (es. `123456789`).
   * *(Opzionale: se crei un gruppo Telegram con i tuoi collaboratori, aggiungi il tuo bot al gruppo e usa l ID del gruppo).*
3. **Copia il Template Plugin:**
   * Inserisci il token e il chat ID nel file `plugin.json` qui sotto!

---

## 🍕 Template 1: Pizzeria / Ristorante (Menu & Ordini a Domicilio)

Salva questo file come `plugin.json`:

```json
{
  "schemaVersion": 1,
  "id": "pizzeria-da-mario",
  "name": "Pizzeria da Mario",
  "description": "Menu interattivo e ordini pizze a domicilio.",
  "category": "Food",
  "icon": "https://heychiara.xyz/assets/pizzeria-icon.png",
  "version": "1.0.0",
  "author": { "name": "Pizzeria da Mario", "email": "info@pizzeriadamario.it" },
  "tier": "free",
  "permissions": ["phone", "name"],
  "trigger": {
    "type": "command",
    "command": "/pizza"
  },
  "data": [
    { "key": "margherita", "nome": "Margherita", "prezzo": "6.00 €", "ingredienti": "Pomodoro, mozzarella fior di latte, basilico" },
    { "key": "diavola", "nome": "Diavola", "prezzo": "7.50 €", "ingredienti": "Pomodoro, mozzarella, salame piccante" },
    { "key": "4 formaggi", "nome": "4 Formaggi", "prezzo": "8.50 €", "ingredienti": "Mozzarella, gorgonzola, fontina, parmigiano" },
    { "key": "capricciosa", "nome": "Capricciosa", "prezzo": "8.50 €", "ingredienti": "Pomodoro, mozzarella, funghi, carciofi, olive" }
  ],
  "actions": [
    {
      "type": "ask",
      "variable": "scelta_pizza",
      "prompt": "🍕 *Pizzeria da Mario* 🍕\nCosa desideri ordinare?\n• *Margherita* (6.00 €)\n• *Diavola* (7.50 €)\n• *4 Formaggi* (8.50 €)\n• *Capricciosa* (8.50 €)"
    },
    {
      "type": "lookup",
      "key": "{{scelta_pizza}}",
      "template": "Hai scelto la pizza *{{nome}}* ({{prezzo}}).\nIngredienti: {{ingredienti}}.\n\nA quale indirizzo desideri la consegna?",
      "fallback": "Hai scelto: *{{scelta_pizza}}*.\n\nA quale indirizzo e civico desideri la consegna a domicilio?"
    },
    {
      "type": "ask",
      "variable": "indirizzo_consegna",
      "prompt": "Inserisci via, civico e citofono:"
    },
    {
      "type": "http",
      "url": "https://api.telegram.org/botTUO_TOKEN_TELEGRAM_QUI/sendMessage",
      "method": "POST",
      "body": {
        "chat_id": "TUO_CHAT_ID_QUI",
        "text": "🍕 NUOVO ORDINE PIZZA!

👤 Cliente: {{user_name}}
📞 Tel: {{phone}}
🍕 Ordine: {{scelta_pizza}}
📍 Indirizzo: {{indirizzo_consegna}}
🕒 Orario: subito",
        "parse_mode": "Markdown"
      },
      "template": "✅ *Ordine inviato alla cucina della Pizzeria da Mario!*\n🍕 Pizza: {{scelta_pizza}}\n📍 Consegna: {{indirizzo_consegna}}\n🕒 Consegna stimata in 25-30 minuti.\n\nGrazie {{user_name}}, ti contatteremo al {{phone}} per qualsiasi aggiornamento!"
    }
  ]
}
```

---

## 💈 Template 2: Barbiere / Salone di Bellezza (Prenotazione Appuntamento)

```json
{
  "schemaVersion": 1,
  "id": "barber-shop-roma",
  "name": "Barber Shop Vintage",
  "description": "Prenotazione appuntamenti per taglio capelli e barba.",
  "category": "Servizi",
  "version": "1.0.0",
  "author": { "name": "Marco Barber", "email": "barber@roma.it" },
  "tier": "free",
  "permissions": ["phone", "name"],
  "trigger": {
    "type": "command",
    "command": "/barbiere"
  },
  "actions": [
    {
      "type": "ask",
      "variable": "servizio",
      "prompt": "💈 *Barber Shop Vintage* 💈\nQuale servizio desideri prenotare?\n1. Taglio Capelli (18 €)\n2. Cura Barba & Panno Caldo (12 €)\n3. Taglio + Barba Completo (25 €)"
    },
    {
      "type": "ask",
      "variable": "data_ora",
      "prompt": "Indica il giorno e l orario preferito (es. *Giovedì alle 16:30*):"
    },
    {
      "type": "http",
      "url": "https://api.telegram.org/botTUO_TOKEN_TELEGRAM_QUI/sendMessage",
      "method": "POST",
      "body": {
        "chat_id": "TUO_CHAT_ID_QUI",
        "text": "💈 NUOVA PRENOTAZIONE BARBIERE!

👤 Cliente: {{user_name}}
📞 Telefono: {{phone}}
✂️ Servizio: {{servizio}}
📅 Quando: {{data_ora}}"
      },
      "template": "✅ *Richiesta di prenotazione inviata!*\n✂️ Servizio: {{servizio}}\n📅 Data/Ora: {{data_ora}}\n\nTi invieremo un messaggio di conferma su WhatsApp al {{phone}} a breve. A presto {{user_name}}!"
    }
  ]
}
```

---

## 📊 Metodo Alternativo: Salvataggio Automatico su Google Sheets

Se preferisci raccogliere gli ordini in una tabella Excel o Google Sheets per contabilità e statistiche:
1. Crea uno scenario gratuito su **[Make.com](https://www.make.com)** o **[Zapier](https://zapier.com)** (gratis).
2. Scegli il trigger **Custom Webhook** e copia l URL generato.
3. Nel campo `url` del tuo `plugin.json`, incolla l URL del webhook di Make.
4. Collega il modulo **Google Sheets: Add a Row** e ogni ordine verrà scritto automaticamente riga per riga su Google Drive!

---

## 🚀 Come Pubblicare il tuo Plugin su Chiara

1. Fai una **Pull Request** sul repository pubblico [github.com/notsim/chiara-plugins](https://github.com/notsim/chiara-plugins) aggiungendo la cartella con il tuo `plugin.json` dentro `plugins/nome-tua-azienda/`.
2. Una volta approvato, il tuo plugin diventa **attivo all istante per tutti i clienti di Chiara** su WhatsApp!
3. I tuoi clienti potranno ordinare scrivendo il tuo comando (es. `/pizza`, `/barbiere`) oppure semplicemente chiedendo a Chiara in linguaggio naturale: *"Chiara, vorrei ordinare una pizza da Mario"*.

---

### 🛡️ Privacy e Conformità GDPR
* Chiara trasmette alla tua attività esclusivamente i dati che hai dichiarato nella voce `permissions` (es. nome e numero WhatsApp per contattare il cliente).
* I dati viaggiano in connessione crittografata HTTPS.
