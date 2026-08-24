// Memoria globale dell'applicazione con Tattiche di Sistema statiche
let fantaDatabase = {
    giocatori: [], // Oggetti { nome, ruoli, squadra, fantasquadra }
    squadreSA: new Set(),
    ruoli: new Set(),
    fantaSquadre: new Set(),
    tattiche: [
        { d: 3, c: 4, t: 0, a: 3 },
        { d: 3, c: 5, t: 0, a: 2 },
        { d: 3, c: 4, t: 1, a: 2 },
        { d: 3, c: 5, t: 1, a: 1 },
        { d: 3, c: 4, t: 2, a: 1 },
        { d: 4, c: 3, t: 0, a: 3 },
        { d: 4, c: 4, t: 0, a: 2 },
        { d: 4, c: 3, t: 1, a: 2 },
        { d: 4, c: 5, t: 0, a: 1 },
        { d: 4, c: 4, t: 1, a: 1 },
        { d: 4, c: 3, t: 2, a: 1 },
        { d: 5, c: 3, t: 0, a: 2 },
        { d: 5, c: 4, t: 0, a: 1 },
        { d: 5, c: 3, t: 1, a: 1 }
    ]
};

let giocatoriFiltrati = [];
let paginaCorrente = 1;
const totalePerPagina = 50;
const ADMIN_PASSWORD = "fantapettl";

// Ripristina i dati dal browser all'avvio
window.addEventListener('DOMContentLoaded', () => {
    const backup = localStorage.getItem('fantaManagerDB');
    if (backup) {
        const parsed = JSON.parse(backup);
        fantaDatabase.giocatori = parsed.giocatori || [];
        aggiornaIndiciEInterfacce();
    }
    controlloStatoInizialeBottoni();
});

function salvaInLocalStorage() {
    localStorage.setItem('fantaManagerDB', JSON.stringify({ giocatori: fantaDatabase.giocatori }));
}

// Rigenera elenchi unici (Squadre, Ruoli, FantaSquadre)
function aggiornaIndiciEInterfacce() {
    fantaDatabase.squadreSA.clear();
    fantaDatabase.ruoli.clear();
    fantaDatabase.fantaSquadre.clear();

    fantaDatabase.giocatori.forEach(g => {
        if(g.squadra) fantaDatabase.squadreSA.add(g.squadra);
        if(g.fantasquadra) fantaDatabase.fantaSquadre.add(g.fantasquadra);
        if(g.ruoli) {
            g.ruoli.split(';').forEach(r => {
                if(r.trim() !== "") fantaDatabase.ruoli.add(r.trim());
            });
        }
    });

    giocatoriFiltrati = [...fantaDatabase.giocatori];
    
    if (typeof popolaFiltriSelect === "function") popolaFiltriSelect();
    if (typeof popolaMenuUtente === "function") popolaMenuUtente();
    if (typeof applicaFiltri === "function") applicaFiltri();
    controlloStatoInizialeBottoni();
}

function controlloStatoInizialeBottoni() {
    const btnInizio = document.getElementById("btn-carica-inizio");
    if (btnInizio) {
        if (fantaDatabase.giocatori.length > 0) {
            btnInizio.disabled = true;
            btnInizio.style.opacity = "0.4";
            btnInizio.style.cursor = "not-allowed";
            btnInizio.innerText = "🚀 Dati inizio stagione caricati (Disattivato)";
        } else {
            btnInizio.disabled = false;
            btnInizio.style.opacity = "1";
            btnInizio.style.cursor = "pointer";
            btnInizio.innerText = "🚀 Carica dati inizio stagione (database.txt + rose.txt)";
        }
    }
}

function formattaModulo(t) {
    if (t.t === 0) {
        return `${t.d}-${t.c}-${t.a}`;
    } else {
        return `${t.d}-${t.c}-${t.t}-${t.a}`;
    }
}
