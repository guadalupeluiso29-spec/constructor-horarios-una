const dias = ["LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO"];
const inicioDia = 8;
const finDia = 23;

let oferta = [];
let seleccionadas = [];

const calendar = document.getElementById("calendar");
const lista = document.getElementById("listaComisiones");

fetch("oferta2026.json")
  .then(res => res.json())
  .then(data => {
    oferta = data;
    crearGrilla();
    mostrarComisiones(oferta);
  });

function crearGrilla() {
  calendar.innerHTML = "";

  calendar.appendChild(crearDiv("", "header"));
  dias.forEach(d => calendar.appendChild(crearDiv(d, "header")));

  for (let h = inicioDia; h <= finDia; h++) {
    calendar.appendChild(crearDiv(h + ":00", "time"));
    dias.forEach(() => {
      calendar.appendChild(crearDiv("", "cell"));
    });
  }
}

function crearDiv(text, className) {
  const div = document.createElement("div");
  div.className = className;
  div.textContent = text;
  return div;
}

function mostrarComisiones(data) {
  lista.innerHTML = "";

  data.forEach(c => {
    const div = document.createElement("div");
    div.className = "comision";
    div.innerHTML = `
      <strong>${c.MATERIA}</strong><br>
      ${c.CÁTEDRA}<br>
      ${c.DÍA} ${c.INICIO}-${c.FIN}<br>
      ${c.SEDE}
    `;
    div.onclick = () => agregarEvento(c);
    lista.appendChild(div);
  });
}

function agregarEvento(c) {

  if (verificarSuperposicion(c)) {
    alert("⚠️ Se superpone con otra comisión.");
  }

  seleccionadas.push(c);
  renderEventos();
}

function verificarSuperposicion(nuevo) {
  return seleccionadas.some(sel => {
    if (sel.DÍA !== nuevo.DÍA) return false;

    return (
      parseInt(nuevo.INICIO) < parseInt(sel.FIN) &&
      parseInt(nuevo.FIN) > parseInt(sel.INICIO)
    );
  });
}

function renderEventos() {
  document.querySelectorAll(".event").forEach(e => e.remove());

  seleccionadas.forEach(c => {

    const diaIndex = dias.indexOf(c.DÍA.toUpperCase());
    if (diaIndex === -1) return;

    const top = (parseInt(c.INICIO) - inicioDia) * 50;
    const height = (parseInt(c.FIN) - parseInt(c.INICIO)) * 50;
    const left = 80 + diaIndex * (calendar.offsetWidth - 80) / 6;

    const div = document.createElement("div");
    div.className = "event";
    div.style.top = top + "px";
    div.style.height = height + "px";
    div.style.left = left + "px";
    div.innerHTML = `${c.MATERIA}<br>${c.CÁTEDRA}`;

    calendar.appendChild(div);
  });
}

function descargarImagen() {
  html2canvas(calendar).then(canvas => {
    const link = document.createElement("a");
    link.download = "mi-horario.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
  });
}
