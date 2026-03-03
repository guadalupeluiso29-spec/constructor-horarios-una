const dias = ["LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO"];
const inicioDia = 8;
const finDia = 23;

let oferta = [];
let seleccionadas = [];

const calendar = document.getElementById("calendar");
const searchInput = document.getElementById("search");

// Agregar filtro por sede dinámicamente
const sedeSelect = document.createElement("select");
document.querySelector(".controls").appendChild(sedeSelect);

fetch("oferta2026.json")
  .then(res => res.json())
  .then(data => {
    oferta = data;
    crearFiltroSede();
    crearGrilla();
    renderEventos(oferta);
  });

function crearFiltroSede() {
  const sedes = [...new Set(oferta.map(o => o.SEDE))];

  sedeSelect.innerHTML = `<option value="all">Todas las sedes</option>`;
  sedes.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    sedeSelect.appendChild(opt);
  });

  sedeSelect.addEventListener("change", aplicarFiltros);
}

function aplicarFiltros() {
  const texto = searchInput.value.toLowerCase();
  const sede = sedeSelect.value;

  let filtradas = oferta.filter(o =>
    o.MATERIA.toLowerCase().includes(texto)
  );

  if (sede !== "all") {
    filtradas = filtradas.filter(o => o.SEDE === sede);
  }

  renderEventos(filtradas);
}

searchInput.addEventListener("input", aplicarFiltros);

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

function renderEventos(data) {
  document.querySelectorAll(".event").forEach(e => e.remove());

  data.forEach((evento, index) => {
    if (!evento.DÍA) return;

    const diaIndex = dias.indexOf(evento.DÍA.toUpperCase());
    if (diaIndex === -1) return;

    const horaInicio = parseInt(evento.INICIO.split(":")[0]);
    const horaFin = parseInt(evento.FIN.split(":")[0]);

    const top = (horaInicio - inicioDia) * 50;
    const height = (horaFin - horaInicio) * 50;
    const left = 80 + diaIndex * (calendar.offsetWidth - 80) / 6;

    const div = document.createElement("div");
    div.className = "event";
    div.style.top = top + "px";
    div.style.height = height + "px";
    div.style.left = left + "px";
    div.innerHTML = `
      <strong>${evento.MATERIA}</strong><br>
      ${evento.CÁTEDRA}<br>
      ${evento.SEDE}
    `;

    div.onclick = () => toggleSeleccion(evento);

    calendar.appendChild(div);
  });
}

function toggleSeleccion(evento) {

  if (verificarSuperposicion(evento)) {
    alert("⚠️ Atención: esta comisión se superpone con otra que ya elegiste.");
  }

  const existe = seleccionadas.find(e =>
    e.MATERIA === evento.MATERIA &&
    e.DÍA === evento.DÍA &&
    e.INICIO === evento.INICIO
  );

  if (existe) {
    seleccionadas = seleccionadas.filter(e => e !== existe);
  } else {
    seleccionadas.push(evento);
  }

  resaltarSeleccion();
}

function verificarSuperposicion(nuevo) {

  return seleccionadas.some(sel => {

    if (sel.DÍA !== nuevo.DÍA) return false;

    const inicioA = parseInt(sel.INICIO);
    const finA = parseInt(sel.FIN);
    const inicioB = parseInt(nuevo.INICIO);
    const finB = parseInt(nuevo.FIN);

    return inicioB < finA && finB > inicioA;
  });
}

function resaltarSeleccion() {
  document.querySelectorAll(".event").forEach(el => {
    el.style.background = "#111";
  });

  seleccionadas.forEach(sel => {
    document.querySelectorAll(".event").forEach(el => {
      if (el.innerHTML.includes(sel.MATERIA) &&
          el.innerHTML.includes(sel.CÁTEDRA)) {
        el.style.background = "#e63946";
      }
    });
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
