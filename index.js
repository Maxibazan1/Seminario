const express = require('express');
const path = require('path');

const app = express();
const port = 3000; // O cualquier otro puerto que prefieras

// Configura el directorio 'Frontend' para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'Frontend')));

// Ruta principal (puede ser la ruta de tu index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '12345678',
  database: 'tienda_online'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL.');
});

module.exports = connection;































connection.end();
