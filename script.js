const api = '/orak';

async function betolt() {
  const res = await fetch(api);
  const orak = await res.json();
  const tbody = document.querySelector("#orarend tbody");
  tbody.innerHTML = ""; // Töröljük a táblázat tartalmát

  // Adatok napokra szűrve és az időpontokhoz rendelve
  const napok = {
    hetfo: [],
    kedd: [],
    szerda: [],
    csut: [],
    pent: []
  };

  // Napokhoz való rendelések - gondoskodunk a megfelelő névkezelésről
  orak.forEach(ora => {
    const nap = ora.nap.toLowerCase(); // biztosítjuk, hogy kisbetűs legyen
    if (napok[nap]) {
      napok[nap].push(ora);
    }
  });

  // Az időpontok: 1-től 7-ig
  const idopontok = ["1", "2", "3", "4", "5", "6", "7"];

  idopontok.forEach(idopont => {
    const sor = document.createElement("tr");
    const cellaIdopont = document.createElement("td");
    cellaIdopont.textContent = `Óra ${idopont}`;
    sor.appendChild(cellaIdopont);

    // Napok feltöltése a megfelelő órákkal
    ["hetfo", "kedd", "szerda", "csut", "pent"].forEach(nap => {
      const cella = document.createElement("td");
      const ora = napok[nap].find(o => o.idopont === idopont);
      if (ora) {
        cella.innerHTML = `${ora.tantargy} <button onclick="szerkesztes(${ora.id})">Szerkesztés</button> <button onclick="torol(${ora.id})">Törlés</button>`;
      }
      sor.appendChild(cella);
    });

    tbody.appendChild(sor);
  });
}

async function hozzaad() {
  const nap = document.getElementById("nap").value;
  const tantargy = document.getElementById("tantargy").value;
  const idopont = document.getElementById("idopont").value;

  if (!nap || !tantargy || !idopont) {
    alert("Kérlek, töltsd ki az összes mezőt!");
    return;
  }

  await fetch(api, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nap, tantargy, idopont })
  });
  betolt();
}

async function szerkesztes(id) {
  const nap = prompt("Adja meg az új napot (Hétfő, Kedd, stb.):");
  const tantargy = prompt("Adja meg az új tantárgyat:");
  const idopont = prompt("Adja meg az új időpontot:");

  if (nap && tantargy && idopont) {
    await fetch(`${api}/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nap, tantargy, idopont })
    });
    betolt();
  }
}

async function torol(id) {
  const confirmDelete = confirm("Biztos, hogy törölni szeretnéd?");
  if (confirmDelete) {
    await fetch(`${api}/${id}`, { method: "DELETE" });
    betolt();
  }
}

betolt();
