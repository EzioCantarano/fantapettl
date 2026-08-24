// ==========================================
// INTERFACCIA CAMPO - PARTE 1 DI 2
// ==========================================

// Riempie il selettore iniziale dei partecipanti nella Home
function popolaMenuUtente() {
    const selectUtente = document.getElementById("user-select-fantasquadra");
    if(!selectUtente) return;
    selectUtente.innerHTML = '<option value="">📋 Seleziona la tua Fanta-Squadra...</option>';
    Array.from(fantaDatabase.fantaSquadre).sort().forEach(f => {
        selectUtente.innerHTML += `<option value="${f}">${f}</option>`;
    });

    const selectTattica = document.getElementById("select-tattica-utente");
    if(selectTattica) {
        selectTattica.innerHTML = '<option value="">Seleziona Modulo...</option>';
        fantaDatabase.tattiche.forEach((t, indice) => {
            selectTattica.innerHTML += `<option value="${indice}">${formattaModulo(t)}</option>`;
        });
    }
}

// Disegna la tabella dei giocatori acquistati dall'utente selezionato
function mostraRosaUtente() {
    const fantaScelta = document.getElementById("user-select-fantasquadra").value;
    const container = document.getElementById("container-rosa-utente");
    const tbody = document.querySelector("#tabella-rosa-utente tbody");
    
    tbody.innerHTML = "";
    if(typeof nascondiFormAcquisto === "function") nascondiFormAcquisto();
    document.getElementById("campo-gioco").style.display = "none";
    document.getElementById("sezione-panchina").style.display = "none";
    document.getElementById("select-tattica-utente").value = "";
    
    if (!fantaScelta) return container.style.display = "none";
    container.style.display = "block";
    document.getElementById("titolo-fantasquadra").innerText = `Rosa di: ${fantaScelta}`;

    fantaDatabase.giocatori.filter(g => g.fantasquadra === fantaScelta).forEach(g => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span class="badge-ruolo">${g.ruoli}</span></td>
            <td class="player-name">${g.nome}</td>
            <td class="player-team">${g.squadra}</td>
            <td style="text-align: center;">
                <button onclick="rimuoviGiocatore('${g.nome.replace(/'/g, "\\'")}')" style="background-color: var(--danger); padding: 4px 10px; font-size: 0.8rem;">🗑️ Rimuovi</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    popolaSvincolati();
}

function rimuoviGiocatore(nomeGiocatore) {
    const fantaScelta = document.getElementById("user-select-fantasquadra").value;
    if (!confirm(`Vuoi rimuovere ${nomeGiocatore}?`)) return;

    const giocatore = fantaDatabase.giocatori.find(g => g.nome === nomeGiocatore);
    if (giocatore) {
        giocatore.fantasquadra = "";
        salvaInLocalStorage();
        aggiornaIndiciEInterfacce();
        mostraRosaUtente();
    }
}

function popolaSvincolati() {
    const select = document.getElementById("select-svincolati");
    if (!select) return;
    select.innerHTML = "";
    const svincolati = fantaDatabase.giocatori.filter(g => !g.fantasquadra).sort((a, b) => a.nome.localeCompare(b.nome));
    if (svincolati.length === 0) {
        select.innerHTML = '<option value="">Nessun svincolato</option>';
        return;
    }
    svincolati.forEach(g => select.innerHTML += `<option value="${g.nome}">${g.nome} (${g.ruoli})</option>`);
}

function mostraFormAcquisto() { document.getElementById("form-acquisto-calciatore").style.display = "block"; }
function nascondiFormAcquisto() { document.getElementById("form-acquisto-calciatore").style.display = "none"; }

function confermaAcquisto() {
    const fantaScelta = document.getElementById("user-select-fantasquadra").value;
    const nomeGiocatoreScelto = document.getElementById("select-svincolati").value;
    if (!nomeGiocatoreScelto) return;

    const giocatore = fantaDatabase.giocatori.find(g => g.nome === nomeGiocatoreScelto);
    if (giocatore) {
        giocatore.fantasquadra = fantaScelta;
        salvaInLocalStorage();
        aggiornaIndiciEInterfacce();
        mostraRosaUtente();
        alert("Acquistato!");
    }
}
// ==========================================
// INTERFACCIA CAMPO - PARTE 2 DI 2
// ==========================================

// Genera i menu a tendina posizionandoli graficamente sul campo verde
function disegnaCampoGioco() {
    const campo = document.getElementById("campo-gioco");
    const indiceTattica = document.getElementById("select-tattica-utente").value;

    if (indiceTattica === "") {
        campo.style.display = "none";
        document.getElementById("sezione-panchina").style.display = "none";
        return;
    }
    campo.style.display = "flex";
    campo.innerHTML = ""; 

    const tattica = fantaDatabase.tattiche[indiceTattica];

    const righeConfig = [
        { tipo: 'A', quantita: tattica.a },
        { tipo: 'T', quantita: tattica.t },
        { tipo: 'C', quantita: tattica.c },
        { tipo: 'D', quantita: tattica.d },
        { tipo: 'P', quantita: 1 }
    ];

    righeConfig.forEach(riga => {
        if (riga.quantita === 0) return;

        const divRiga = document.createElement("div");
        divRiga.style.display = "flex";
        divRiga.style.justifyContent = "space-around";
        divRiga.style.gap = "10px";
        divRiga.style.width = "100%";

        for (let i = 0; i < riga.quantita; i++) {
            let ruoliAmmessiSlot = [];
            let etichettaPosizione = riga.tipo;

            if (riga.tipo === 'P') {
                ruoliAmmessiSlot = ['Por'];
                etichettaPosizione = 'Por';
            } 
            else if (riga.tipo === 'D') {
                if (riga.quantita === 5) {
                    if (i === 0) { ruoliAmmessiSlot = ['Ds']; etichettaPosizione = 'DS'; }
                    else if (i === 1 || i === 2) { ruoliAmmessiSlot = ['Dc']; etichettaPosizione = 'DC'; }
                    else if (i === 3) { ruoliAmmessiSlot = ['B', 'Dc']; etichettaPosizione = 'B/DC'; }
                    else if (i === 4) { ruoliAmmessiSlot = ['Dd']; etichettaPosizione = 'DD'; }
                } else if (riga.quantita === 4) {
                    if (i === 0) { ruoliAmmessiSlot = ['Ds']; etichettaPosizione = 'DS'; }
                    else if (i === 1 || i === 2) { ruoliAmmessiSlot = ['Dc']; etichettaPosizione = 'DC'; }
                    else if (i === 3) { ruoliAmmessiSlot = ['Dd']; etichettaPosizione = 'DD'; }
                } else if (riga.quantita === 3) {
                    if (i === 0 || i === 1) { ruoliAmmessiSlot = ['Dc']; etichettaPosizione = 'DC'; }
                    else if (i === 2) { ruoliAmmessiSlot = ['B', 'Dc']; etichettaPosizione = 'B/DC'; }
                }
            } 
            else if (riga.tipo === 'C') {
                if (riga.quantita === 3) {
                    if (i === 0) { ruoliAmmessiSlot = ['M', 'C']; etichettaPosizione = 'M/C'; }
                    else if (i === 1) { ruoliAmmessiSlot = ['M']; etichettaPosizione = 'M'; }
                    else if (i === 2) { ruoliAmmessiSlot = ['M', 'C', 'T']; etichettaPosizione = 'M/C/T'; }
                } else if (riga.quantita === 4) {
                    if (i === 0 || i === 3) { ruoliAmmessiSlot = ['E', 'W']; etichettaPosizione = 'E/W'; }
                    else if (i === 1) { ruoliAmmessiSlot = ['M', 'C']; etichettaPosizione = 'M/C'; }
                    else if (i === 2) { ruoliAmmessiSlot = ['M', 'C', 'T']; etichettaPosizione = 'M/C/T'; }
                } else if (riga.quantita === 5) {
                    if (i === 0 || i === 4) { ruoliAmmessiSlot = ['E', 'W']; etichettaPosizione = 'E/W'; }
                    else if (i === 1) { ruoliAmmessiSlot = ['M', 'C']; etichettaPosizione = 'M/C'; }
                    else if (i === 2) { ruoliAmmessiSlot = ['M']; etichettaPosizione = 'M'; }
                    else if (i === 3) { ruoliAmmessiSlot = ['M', 'C', 'T']; etichettaPosizione = 'M/C/T'; }
                }
            } 
            else if (riga.tipo === 'T') {
                ruoliAmmessiSlot = ['T'];
                etichettaPosizione = 'T';
            } 
            else if (riga.tipo === 'A') {
                if (riga.quantita === 1 || riga.quantita === 2) {
                    ruoliAmmessiSlot = ['A', 'Pc'];
                    etichettaPosizione = 'A/PC';
                } else if (riga.quantita === 3) {
                    if (i === 0 || i === 2) { ruoliAmmessiSlot = ['A']; etichettaPosizione = 'A'; }
                    else if (i === 1) { ruoliAmmessiSlot = ['Pc']; etichettaPosizione = 'PC'; }
                }
            }

            const containerSlot = document.createElement("div");
            containerSlot.style.flex = "1";

            const label = document.createElement("div");
            label.style.fontSize = "0.75rem";
            label.style.color = "#a7f3d0";
            label.style.fontWeight = "bold";
            label.style.marginBottom = "3px";
            label.innerText = etichettaPosizione;

            const selectCalciatore = document.createElement("select");
            selectCalciatore.style.width = "100%";
            selectCalciatore.style.padding = "6px";
            selectCalciatore.style.borderRadius = "4px";
            selectCalciatore.style.backgroundColor = "#1e293b";
            selectCalciatore.style.color = "white";
            selectCalciatore.style.border = "1px solid #334155";
            selectCalciatore.style.fontSize = "0.85rem";
            
            // AGGIUNTA METADATI PER FILTRO INCROCIATO
            selectCalciatore.className = "select-titolare-globale";
            selectCalciatore.setAttribute("data-ruoli", ruoliAmmessiSlot.join(","));

            // Quando un titolare cambia, ricalcoliamo le liste ovunque (sia in campo che in panchina)
            selectCalciatore.addEventListener('change', () => {
                if (typeof aggiornaGiocatoriDisponibiliFormazione === "function") {
                    aggiornaGiocatoriDisponibiliFormazione();
                }
            });

            containerSlot.appendChild(label);
            containerSlot.appendChild(selectCalciatore);
            divRiga.appendChild(containerSlot);
        }
        campo.appendChild(divRiga);
    });

    if (typeof disegnaPanchinaUtente === "function") {
        disegnaPanchinaUtente();
    }
}
