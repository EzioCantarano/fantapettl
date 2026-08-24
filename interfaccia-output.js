// ==========================================
// INTERFACCIA OUTPUT - FILE DI TESTO GREZZO
// ==========================================

function generaEInviaFormazioneGrezza() {
    const fantaSquadra = document.getElementById("user-select-fantasquadra").value;
    const indiceTattica = document.getElementById("select-tattica-utente").value;

    if (!fantaSquadra || indiceTattica === "") {
        alert("Seleziona la squadra e il modulo prima di generare!");
        return;
    }

    const tatticaStringa = formattaModulo(fantaDatabase.tattiche[indiceTattica]);
    
    let testoGrezzo = `${fantaSquadra}\n`;
    testoGrezzo += `${tatticaStringa}\n`;

    const selectTitolari = document.querySelectorAll(".select-titolare-globale");
    const blocchiOrdinati = { P: [], D: [], C: [], T: [], A: [] };
    let titolariContati = 0;

    selectTitolari.forEach(sel => {
        if (sel.value) {
            titolariContati++;
            const dataRuoli = sel.getAttribute("data-ruoli") || "";
            let tipoBlocco = 'P';

            if (dataRuoli.includes("Por")) tipoBlocco = 'P';
            else if (dataRuoli.includes("Dc") || dataRuoli.includes("Dd") || dataRuoli.includes("Ds") || dataRuoli.includes("B")) tipoBlocco = 'D';
            else if (dataRuoli.includes("Cc") || dataRuoli.includes("M") || dataRuoli.includes("E")) tipoBlocco = 'C';
            else if (dataRuoli.includes("T")) tipoBlocco = 'T';
            else if (dataRuoli.includes("A") || dataRuoli.includes("Pc")) tipoBlocco = 'A';

            blocchiOrdinati[tipoBlocco].push(sel.value);
        }
    });

    if (titolariContati < 11) {
        if (!confirm("Attenzione: Non hai schierato tutti gli 11 titolari! Generare comunque?")) {
            return;
        }
    }

    const ordineStampa = ['P', 'D', 'C', 'T', 'A'];
    ordineStampa.forEach(chiave => {
        blocchiOrdinati[chiave].forEach(nomeGiocatore => {
            testoGrezzo += `${nomeGiocatore}\n`;
        });
    });

    const selectPanchine = document.querySelectorAll(".select-panchina-globale");
    selectPanchine.forEach(sel => {
        if (sel.value) {
            testoGrezzo += `${sel.value}\n`;
        }
    });

    testoGrezzo = testoGrezzo.trim();

    const areaTesto = document.getElementById("txt-formazione-output");
    areaTesto.value = testoGrezzo;
    document.getElementById("box-anteprima-invio").style.display = "block";

    areaTesto.select();
    areaTesto.setSelectionRange(0, 99999);
    try {
        navigator.clipboard.writeText(testoGrezzo);
    } catch (err) {
        document.execCommand("copy");
    }

    const blobFile = new Blob([testoGrezzo], { type: 'text/plain;charset=utf-8' });
    const linkDownload = document.createElement('a');
    const nomeFilePulito = fantaSquadra.replace(/[^a-zA-Z0-9]/g, "_") + ".txt";
    
    linkDownload.href = URL.createObjectURL(blobFile);
    linkDownload.download = nomeFilePulito;
    
    document.body.appendChild(linkDownload);
    linkDownload.click();
    document.body.removeChild(linkDownload);

    alert(`File "${nomeFilePulito}" scaricato correttamente sul tuo dispositivo e testo copiato negli appunti!`);
}
