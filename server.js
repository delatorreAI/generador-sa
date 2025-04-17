// Importar la librería Express
const express = require('express');
// Importar el módulo 'path' de Node.js para manejar rutas de archivos
const path = require('path');

// Crear una instancia de la aplicación Express
const app = express();

// Definir el puerto
const PORT = process.env.PORT || 3000;

// --- Middleware para servir archivos estáticos ---

// Servir específicamente el contenido de la carpeta 'public/js' cuando se pida algo bajo '/js'
// Esto hace más explícito el mapeo para los scripts.
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// Servir archivos generales desde la carpeta 'public'
// express.static buscará index.html por defecto para '/'
app.use(express.static(path.join(__dirname, 'public')));

// --- Definición de Rutas Específicas (para servir los HTML directamente) ---
// Estas rutas siguen siendo necesarias si queremos acceder a ellas directamente
// por su nombre (ej: /datos-iniciales) en lugar de depender solo de la navegación JS

// Ruta para Datos Iniciales
app.get('/datos-iniciales', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'datos-iniciales.html'));
});

// Ruta para Objetivos y Saberes
app.get('/objetivos-saberes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'objetivos-saberes.html'));
});

// Ruta para Competencias
app.get('/competencias', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'competencias.html'));
});

// Ruta para Actividades y Metodología
app.get('/actividades', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'actividades.html'));
});

// Ruta para Evaluación
app.get('/evaluacion', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'evaluacion.html'));
});

// Ruta para Revisión Final y Exportación
app.get('/revision-final', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'revision-final.html'));
});

// --- Fin Definición de Rutas ---

// Poner en marcha el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
