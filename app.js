var datos = [];
var horarioOcupado = {};

document.addEventListener("DOMContentLoaded", function () {
    generarGrilla();
    cargarDatos();
    document.getElementById("buscador").addEventListener("input", filtrarMaterias);
});

function generarGrilla() {
    var dias = ["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"];
    var inicio = 8;
    var fin = 23;

    var tabla = document.createElement("table");
    var thead = document.createElement("thead");
    var filaHead = document.createElement("tr");

    var thHora = document.createElement("th");
    thHora.textContent = "Hora";
    filaHead.appendChild(thHora);

    for (var i = 0; i < dias.length; i++) {
        var th = document.createElement("th");
        th.textContent = dias[i];
        filaHead.appendChild(th);
    }

    thead.appendChild(filaHead);
    tabla.appendChild(thead);

    var tbody = document.createElement("tbody");

    for (var h = inicio; h < fin; h++) {
        var fila = document.createElement("tr");

        var celdaHora = document.createElement("td");
        celdaHora.textContent = h + ":00";
        fila.appendChild(celdaHora);

        for (var d = 0; d < dias.length; d++) {
            var celda = document.createElement("td");
            celda.setAttribute("data-dia", dias[d]);
            celda.setAttribute("data-hora", h);
            fila.appendChild(celda);
        }

        tbody.appendChild(fila);
    }

    tabla.appendChild(tbody);
    document.getElementById("grilla").appendChild(tabla);
}

function cargarDatos() {
    fetch("comisiones2026.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Error HTTP: " + response.status);
            }
            return response.json();
        })
        .then(function (json) {
            datos = json;
            mostrarMaterias();
        })
        .catch(function (error) {
            document.getElementById("error").textContent =
                "Error cargando comisiones.json: " + error.message;
        });
}

function mostrarMaterias() {
    var contenedor = document.getElementById("materias");
    contenedor.innerHTML = "";

    var materiasUnicas = [];

    for (var i = 0; i < datos.length; i++) {
        if (materiasUnicas.indexOf(datos[i].materia) === -1) {
            materiasUnicas.push(datos[i].materia);
        }
    }

    for (var j = 0; j < materiasUnicas.length; j++) {
        var div = document.createElement("div");
        div.className = "materia";
        div.textContent = materiasUnicas[j];
        div.onclick = (function (materia) {
            return function () {
                mostrarComisiones(materia, this);
            };
        })(materiasUnicas[j]);

        contenedor.appendChild(div);
    }
}

function mostrarComisiones(materia, elemento) {
    var existente = elemento.nextSibling;
    if (existente && existente.className === "lista-comisiones") {
        existente.remove();
        return;
    }

    var lista = document.createElement("div");
    lista.className = "lista-comisiones";

    for (var i = 0; i < datos.length; i++) {
        if (datos[i].materia === materia) {
            var div = document.createElement("div");
            div.className = "comision";
            div.textContent = datos[i].comision + " | " + datos[i].catedra + " | " + datos[i].sede;
            div.onclick = (function (comision) {
                return function () {
                    agregarAlHorario(comision);
                };
            })(datos[i]);

            lista.appendChild(div);
        }
    }

    elemento.parentNode.insertBefore(lista, elemento.nextSibling);
}

function agregarAlHorario(comision) {
    var color = generarColor();

    for (var i = 0; i < comision.bloques.length; i++) {
        var bloque = comision.bloques[i];

        for (var h = bloque.inicio; h < bloque.fin; h++) {
            var clave = bloque.dia + "-" + h;

            if (horarioOcupado[clave]) {
                alert("Superposición horaria detectada. No se puede agregar.");
                return;
            }
        }
    }

    for (var j = 0; j < comision.bloques.length; j++) {
        var bloque2 = comision.bloques[j];

        for (var hora = bloque2.inicio; hora < bloque2.fin; hora++) {
            var celda = document.querySelector(
                'td[data-dia="' + bloque2.dia + '"][data-hora="' + hora + '"]'
            );

            celda.style.backgroundColor = color;
            celda.className = "bloque";
            celda.textContent = comision.materia;

            horarioOcupado[bloque2.dia + "-" + hora] = true;
        }
    }
}

function generarColor() {
    return "hsl(" + Math.floor(Math.random() * 360) + ",70%,50%)";
}

function filtrarMaterias() {
    var texto = document.getElementById("buscador").value.toLowerCase();
    var materias = document.getElementsByClassName("materia");

    for (var i = 0; i < materias.length; i++) {
        if (materias[i].textContent.toLowerCase().indexOf(texto) > -1) {
            materias[i].style.display = "block";
        } else {
            materias[i].style.display = "none";
        }
    }
}
