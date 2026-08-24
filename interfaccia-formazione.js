ì// ==========================================
// INTERFACCIA FORMAZIONE (PANCHINA E FILTRI COMPLETI)
// ==========================================

function disegnaPanchinaUtente() {
    const container = document.getElementById("container-selettori-panchina");
    const sezione = document.getElementById("sezione-panchina");
    
    if (!container) return;
    container.innerHTML = "";
    sezione.style.display = "block";

    for (let i = 1; i <= 12; i++) {
        const divSlot = document.createElement("div");
        divSlot.style.display = "flex";
        divSlot.style.alignItems = "center";
        divSlot.style.gap = "10px";

        const label = document.createElement("span");
        label.style.fontSize = "0.9rem";
        label.style.color = "#94a3b8";
        label.style.width = "40px";
        label.innerText = `${i}° P.`;

        const select = document.createElement("select");
        select.id = `panchina-slot-${i}`;
        select.className = "select-panchina-globale";
        select.style.flex = "1";
        select.style.padding = "8px";
        select.style.borderRadius = "4px";
        select.style.backgroundColor = "#0f172a";
        select.style.color = "white";
        select.style.border = "1px solid #334155";
        
        select.addEventListener('change', aggiornaGiocatoriDisponibiliFormazione);

        divSlot.appendChild(label);
        divSlot.appendChild(select);
        container.appendChild(divSlot);
    }

    aggiornaGiocatoriDisponibiliFormazione();
}

// Esclude dinamicamente i giocatori occupati sia tra i titolari che in panchina
function aggiornaGiocatoriDisponibiliFormazione() {
    const fantaScelta = document.getElementById("user-select-fantasquadra").value;
    const rosaUtente = fantaDatabase.giocatori.filter(g => g.fantasquadra === fantaScelta);

    const selectTitolari = document.querySelectorAll(".select-titolare-globale");
    const selectPanchine = document.querySelectorAll(".select-panchina-globale");

    // 1. RACCOLTA SELEZIONI CORRENTI
    const titolariSelezionati = [];
    selectTitolari.forEach(s => { if (s.value) titolariSelezionati.push(s.value); });

    const panchinariSelezionati = [];
    selectPanchine.forEach(s => { if (s.value) panchinariSelezionati.push(s.value); });

    const tuttiGliOccupati = [...titolariSelezionati, ...panchinariSelezionati];

    // 2. AGGIORNAMENTO DINAMICO DEI MENU DEL CAMPO DA GIOCO (TITOLARI)
    selectTitolari.forEach(currentSelect => {
        const valorePrecedente = currentSelect.value;
        const ruoliAmmessiSlot = currentSelect.getAttribute("data-ruoli").split(",");

        currentSelect.innerHTML = '<option value="">- Scegli -</option>';

        // Escludiamo gli occupati tranne chi è già impostato in QUESTA specifica select
        const disponibiliCampo = rosaUtente.filter(g => {
            const ruoliGiocatore = g.ruoli.split(';').map(r => r.trim());
            const haRuoloCompatibile = ruoliGiocatore.some(r => ruoliAmmessiSlot.includes(r));
            const eLibero = !tuttiGliOccupati.includes(g.nome) || g.nome === valorePrecedente;
            return haRuoloCompatibile && eLibero;
        }).sort((a, b) => a.nome.localeCompare(b.nome));

        disponibiliCampo.forEach(g => {
            currentSelect.innerHTML += `<option value="${g.nome}">${g.nome}</option>`;
        });

        currentSelect.value = valorePrecedente;
    });

    // 3. AGGIORNAMENTO DINAMICO DEI MENU DELLA PANCHINA
    selectPanchine.forEach(currentSelect => {
        const valorePrecedente = currentSelect.value;

        currentSelect.innerHTML = '<option value="">- Lascia vuoto -</option>';

        const altriPanchinari = [];
        selectPanchine.forEach(s => { if (s !== currentSelect && s.value) altriPanchinari.push(s.value); });

        const esclusiPerPanchina = [...titolariSelezionati, ...altriPanchinari];

        const disponibiliPanchina = rosaUtente.filter(g => {
            return !esclusiPerPanchina.includes(g.nome) || g.nome === valorePrecedente;
        }).sort((a, b) => a.nome.localeCompare(b.nome));

        disponibiliPanchina.forEach(g => {
            currentSelect.innerHTML += `<option value="${g.nome}">${g.nome} (${g.ruoli})</option>`;
        });

        currentSelect.value = valorePrecedente;
    });
}

