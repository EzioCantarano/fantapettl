// Legge il file database.txt (Elenco generale calciatori)
function parsingDatabaseCalciatori(testo) {
    const righe = testo.split(/\r?\n/);
    const mappaAssegnazioniPrecedenti = {};
    
    fantaDatabase.giocatori.forEach(g => {
        if(g.fantasquadra) mappaAssegnazioniPrecedenti[g.nome.toUpperCase()] = g.fantasquadra;
    });

    fantaDatabase.giocatori = [];

    righe.forEach(riga => {
        const rigaPulita = riga.trim();
        if (rigaPulita === "" || rigaPulita.startsWith("(File Sent)")) return;

        const elementi = rigaPulita.split(/\s+/);
        if (elementi.length >= 3) {
            const ruoli = elementi[0];
            const squadra = elementi[elementi.length - 1];
            const nome = elementi.slice(1, elementi.length - 1).join(" ");

            fantaDatabase.giocatori.push({
                ruoli: ruoli,
                nome: nome,
                squadra: squadra,
                fantasquadra: mappaAssegnazioniPrecedenti[nome.toUpperCase()] || ""
            });
        }
    });

    salvaInLocalStorage();
    aggiornaIndiciEInterfacce();
}

// Legge il file rose.txt (I blocchi delle fanta-squadre dei tuoi amici)
function parsingRosePartecipanti(testo) {
    const righe = testo.split(/\r?\n/);
    let fantaSquadraCorrente = "";

    fantaDatabase.giocatori.forEach(g => g.fantasquadra = "");

    righe.forEach(riga => {
        const rigaPulita = riga.trim();
        if (rigaPulita === "" || rigaPulita.startsWith("___") || rigaPulita.startsWith("(File Sent)")) return;

        if (!rigaPulita.includes("(") && !rigaPulita.includes("[")) {
            fantaSquadraCorrente = rigaPulita;
            return;
        }

        if (fantaSquadraCorrente !== "") {
            const parti = rigaPulita.split("(");
            if (parti.length > 0) {
                const nomeCalciatoreRosa = parti[0].trim().toUpperCase();
                const giocatoreTrovato = fantaDatabase.giocatori.find(g => g.nome.toUpperCase() === nomeCalciatoreRosa);
                
                if (giocatoreTrovato) {
                    giocatoreTrovato.fantasquadra = fantaSquadraCorrente;
                } else {
                    fantaDatabase.giocatori.push({
                        ruoli: "N.D.", nome: parti[0].trim(), squadra: "N.D.", fantasquadra: fantaSquadraCorrente
                    });
                }
            }
        }
    });

    salvaInLocalStorage();
    aggiornaIndiciEInterfacce();
}

// Tenta l'accesso futuro automatico su GitHub Pages
async function caricaFileInizialiGitHub() {
    try {
        const r1 = await fetch('./database.txt');
        if (r1.ok) parsingDatabaseCalciatori(await r1.text());
        const r2 = await fetch('./rose.txt');
        if (r2.ok) parsingRosePartecipanti(await r2.text());
    } catch(e) { console.log("Sviluppo locale attivo."); }
}
