let comisiones = []
let seleccionadas = []

fetch("comisiones.json")
  .then(res => res.json())
  .then(data => {
    comisiones = data
    cargarMaterias()
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
  if (haySuperposicion(comision)) {
    alert("Se superpone con otra materia")
    return
  }

  seleccionadas.push(comision)
  renderizarHorario()
}

function haySuperposicion(nueva) {
  for (let existente of seleccionadas) {
    for (let b1 of existente.bloques) {
      for (let b2 of nueva.bloques) {
        if (b1.dia === b2.dia) {
          if (!(b2.fin <= b1.inicio || b2.inicio >= b1.fin)) {
            return true
          }
        }
      }
    }
  }
  return false
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
