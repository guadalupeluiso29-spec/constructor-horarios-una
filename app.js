let comisiones = []
let seleccionadas = []

fetch("comisiones.json")
  .then(res => {
    if (!res.ok) {
      throw new Error("No se pudo cargar comisiones.json")
    }
    return res.json()
  })
  .then(data => {
    console.log("JSON cargado correctamente")
    comisiones = data
    cargarMaterias()
  })
  .catch(error => {
    console.error("Error cargando JSON:", error)
    document.getElementById("listaMaterias").innerHTML =
      "<p style='color:red'>Error cargando comisiones.json</p>"
  })

function cargarMaterias() {
  const contenedor = document.getElementById("listaMaterias")
  contenedor.innerHTML = ""

  const materiasUnicas = [...new Set(comisiones.map(c => c.materia))]

  materiasUnicas.forEach(materia => {
    const btn = document.createElement("button")
    btn.textContent = materia
    btn.onclick = () => mostrarComisiones(materia)
    contenedor.appendChild(btn)
  })
}

function mostrarComisiones(materia) {
  const contenedor = document.getElementById("listaComisiones")
  contenedor.innerHTML = ""

  const filtradas = comisiones.filter(c => c.materia === materia)

  filtradas.forEach(com => {
    const btn = document.createElement("button")
    btn.textContent = `${com.catedra} - ${com.sede}`
    btn.onclick = () => agregarAlHorario(com)
    contenedor.appendChild(btn)
  })
}

function agregarAlHorario(comision) {
  seleccionadas.push(comision)
  renderizarHorario()
}

function renderizarHorario() {
  document.querySelectorAll(".bloque").forEach(b => b.remove())

  seleccionadas.forEach(com => {
    com.bloques.forEach(bloque => {
      const celda = document.querySelector(
        `[data-dia="${bloque.dia}"][data-hora="${bloque.inicio}"]`
      )

      if (celda) {
        const div = document.createElement("div")
        div.className = "bloque"
        div.textContent = com.materia
        celda.appendChild(div)
      }
    })
  })
}
