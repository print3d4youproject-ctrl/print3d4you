# Revisione Print3D4You

Modifiche locali dal repository print3d4youproject-ctrl/print3d4you, base 107da2e. Nessun push o pubblicazione.

## Implementato

- Home con immagine, FAQ e messaggi sintetici.
- Menu mobile accessibile, collegamento al contenuto e indicatori di focus.
- Descrizioni e testi alternativi corretti per 22 espositori; filtro per piattaforma.
- Link specifici di richiesta per 22 espositori e 4 quadri.
- Prodotto selezionato nella richiesta con copia esplicita nella descrizione.
- Tally con sfondo chiaro, altezza dinamica e collegamento alternativo.
- Pagina console trasformata in presentazione del servizio su misura.
- Chiarimenti sui prezzi di partenza e dettagli da definire nel preventivo.

- Venditore indicato dal proprietario: DAMA_Lab. Email pubblica: print3d4you.project@gmail.com, con collegamenti mailto nei footer e nella pagina richiesta. Il proprietario dichiara di non avere partita IVA; non sono stati aggiunti dati fiscali inventati.

## Da completare

- Laboratorio, foto reali e materiali disponibili.
- Inserito su indicazione del proprietario: produzione e spedizione indicative entro 5 giorni dalla conferma dell’ordine, con consegna del corriere aggiuntiva. Da chiarire se si intendono giorni lavorativi.
- Spedizioni, privacy, condizioni e resi con i dati reali del proprietario.
- Account Tally: correggere “Name e Cognome”, campi obbligatori (anche Note e caricamento), etichetta senza titolo e limite upload.
- Per il trasferimento automatico del prodotto: configurare in Tally un campo nascosto `prodotto`, usarlo come risposta predefinita nella descrizione, poi passare il parametro all'embed e verificare la risposta. Al momento la pagina usa una copia manuale esplicita.
- Verificare le impostazioni GitHub Pages prima di aggiornare il ramo pubblicato; CNAME indica www.print3d4you.it.

## Verifiche

- Sintassi JavaScript con Node.
- Browser desktop e mobile a 390 px: home, menu, filtro Nintendo (7 risultati), selezione prodotto e pulsante copia.
- Caricamento Tally e altezza dinamica verificati. Nessun invio o pagamento.

## Anteprima

Servire la cartella con un server statico, ad esempio Python `-m http.server 4174 --bind 127.0.0.1`, poi aprire http://127.0.0.1:4174/.

## Catalogo stand console

- Aggiunte 11 schede: PlayStation 1, PS one, PSP, PS2 Slim, Game Boy, Pocket, Color, Advance, Advance SP, Micro e Switch/OLED.
- Importate tutte le 17 foto fornite, senza modificare gli originali. Anteprime PSP e PS2 Slim estratte dai 3MF; i file di progetto non sono pubblicati.
- Il proprietario conferma PlayStation 1 e compatibilità dello stand Switch con Switch e OLED.
- Nessun prezzo inventato: prezzo su richiesta. Foto alternative apribili, filtro PlayStation/Nintendo e richieste specifiche.
