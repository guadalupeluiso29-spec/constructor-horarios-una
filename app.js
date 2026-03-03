<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Constructor de Horarios - UNA DAV</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
body { font-family: Arial; margin: 20px; }
h1 { margin-bottom: 10px; }

.controls { margin-bottom: 20px; }

.calendar {
  display: grid;
  grid-template-columns: 80px repeat(6, 1fr);
  grid-auto-rows: 50px;
  border: 1px solid #ccc;
  position: relative;
}

.header, .time {
  background: #f2f2f2;
  border: 1px solid #ddd;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:12px;
}

.cell { border:1px solid #eee; position:relative; }

.event {
  position:absolute;
  background:#111;
  color:white;
  font-size:11px;
  padding:4px;
  border-radius:4px;
  width:90%;
  left:5%;
  cursor:pointer;
}

button {
  padding:8px 12px;
  cursor:pointer;
}
</style>
</head>
<body>

<h1>Constructor de Horarios UNA DAV</h1>

<div class="controls">
  <input type="text" id="search" placeholder="Buscar materia...">
  <button onclick="descargarImagen()">Descargar horario (PNG)</button>
</div>

<div id="calendar" class="calendar"></div>

<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
<script src="app.js"></script>

</body>

</html>
