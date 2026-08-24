function popolaFiltriSelect() {
    const sRuolo = document.getElementById("filter-ruolo");
    const sSquadra = document.getElementById("filter-squadra");
    const sFanta = document.getElementById("filter-fantasquadra");
    if(!sRuolo) return;

    sRuolo.innerHTML = '<option value="">🏃‍♂️ Tutti i Ruoli</option>';
    sSquadra.innerHTML = '<option value="">🛡️ Tutte le Squadre SA</option>';
    sFanta.innerHTML = '<option value="">🏆 Tutte le Fanta-Squadre</option>';

    Array.from(fantaDatabase.ruoli).sort().forEach(r => sRuolo.innerHTML += `<option value="${r}">${r}</option>`);
    Array.from(fantaDatabase.squadreSA).sort().forEach(s => sSquadra.innerHTML += `<option value="${s}">${s}</option>`);
    Array.from(fantaDatabase.fantaSquadre).sort().forEach(f => sFanta.innerHTML += `<option value="${f}">${f}</option>`);
}

function applicaFiltri() {
    const rNome = document.getElementById("filter-nome")?.value.toLowerCase().trim() || "";
    const fRuolo = document.getElementById("filter-ruolo")?.value || "";
    const fSquadra = document.getElementById("filter-squadra")?.value || "";
    const fFanta = document.getElementById("filter-fantasquadra")?.value || "";

    giocatoriFiltrati = fantaDatabase.giocatori.filter(g => {
        return g.nome.toLowerCase().includes(rNome) &&
               (fRuolo === "" || g.ruoli.split(';').includes(fRuolo)) &&
               (fSquadra === "" || g.squadra === fSquadra) &&
               (fFanta === "" || g.fantasquadra === fFanta);
    });

    paginaCorrente = 1;
    renderingTabellaPaginata();
}

function cambiaPagina(direzione) {
    paginaCorrente += direzione;
    renderingTabellaPaginata();
}

function renderingTabellaPaginata() {
    const tbody = document.querySelector("#tabella-giocatori tbody");
    if(!tbody) return;
    tbody.innerHTML = "";

    document.getElementById("cnt-filtrati").innerText = giocatoriFiltrati.length;
    const totPagine = Math.ceil(giocatoriFiltrati.length / totalePerPagina) || 1;
    document.getElementById("info-pagina").innerText = `Pagina ${paginaCorrente} di ${totPagine}`;

    document.getElementById("btn-page-prev").disabled = (paginaCorrente === 1);
    document.getElementById("btn-page-next").disabled = (paginaCorrente === totPagine);

    const inizio = (paginaCorrente - 1) * totalePerPagina;
    giocatoriFiltrati.slice(inizio, inizio + totalePerPagina).forEach(g => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span class="badge-ruolo">${g.ruoli}</span></td>
            <td class="player-name">${g.nome}</td>
            <td class="player-team">${g.squadra}</td>
            <td style="color: #ec4899; font-weight: bold;">${g.fantasquadra || '- Libero -'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function aggiornaContatoriAdmin() {
    document.getElementById("cnt-giocatori").innerText = fantaDatabase.giocatori.length;
    document.getElementById("cnt-fantasquadre-admin").innerText = fantaDatabase.fantaSquadre.size;
    document.getElementById("cnt-assegnati").innerText = fantaDatabase.giocatori.filter(g => g.fantasquadra !== "").length;
    document.getElementById("cnt-tattiche-admin").innerText = fantaDatabase.tattiche.length;
}

async function caricaDatiInizioStagione() {
    if (fantaDatabase.giocatori.length > 0) return;
    try {
        const resDb = await fetch('./database.txt');
        if (!resDb.ok) throw new Error("File database.txt non trovato!");
        const testoDb = await resDb.text();
        parsingDatabaseCalciatori(testoDb);

        const resRose = await fetch('./rose.txt');
        if (!resRose.ok) throw new Error("File rose.txt non trovato!");
        const testoRose = await resRose.text();
        parsingRosePartecipanti(testoRose);

        aggiornaContatoriAdmin();
        alert("Caricamento iniziale completato correttamente!");
    } catch(err) {
        alert("Errore nel caricamento dei file remoti: " + err.message);
    }
}

async function aggiornaSoloDatabase() {
    try {
        const resDb = await fetch('./database.txt');
        if (!resDb.ok) throw new Error("File database.txt non trovato!");
        const testoDb = await resDb.text();
        parsingDatabaseCalciatori(testoDb);
        aggiornaContatoriAdmin();
        alert("Database dei calciatori aggiornato con successo!");
    } catch(err) {
        alert("Errore nell'aggiornamento del database: " + err.message);
    }
}

function apriAdmin() {
    if (prompt("Password Amministrazione:") === ADMIN_PASSWORD) {
        document.getElementById("vista-utente").style.display = "none";
        document.getElementById("vista-admin").style.display = "block";
        aggiornaContatoriAdmin();
        renderingTabellaPaginata();
    } else { alert("Password errata!"); }
}

function chiudiAdmin() {
    document.getElementById("vista-admin").style.display = "none";
    document.getElementById("vista-utente").style.display = "block";
}
