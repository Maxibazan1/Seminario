/*CONEXIONES*/

const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const ServidorWeb = express();
const port = 3000;

ServidorWeb.use(express.static(path.join(__dirname, 'Frontend')));
ServidorWeb.use(express.json());
ServidorWeb.use(express.urlencoded({ extended: false }));

// Conexión a la base de datos
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

// Ruta principal
ServidorWeb.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

ServidorWeb.post('/nuevousuario', (req, res) => {
  const { nombre, apellido, email, nombreusuario, contraseña } = req.body;

  // Consulta para verificar si el email o nombreusuario ya existen
  const checkUserSql = 'SELECT COUNT(*) AS count FROM usuario WHERE Email = ? OR NombreUsuario = ?';

  connection.query(checkUserSql, [email, nombreusuario], (err, results) => {
    if (err) {
      console.error('Error al verificar el email o nombre de usuario:', err);
      res.status(500).json({
        result_estado: 'error',
        result_message: 'Error al verificar el email o nombre de usuario.',
        result_rows: 0,
        result_proceso: 'POST CLIENTE',
        result_data: ''
      });
      return;
    }

    if (results[0].count > 0) {
      res.status(400).json({
        result_estado: 'error',
        result_message: 'El email o nombre de usuario ya está registrado.',
        result_rows: 0,
        result_proceso: 'POST CLIENTE',
        result_data: ''
      });
      return;
    }

    /*INSERCION USUARIO*/
    const sql = 'INSERT INTO usuario (Nombre, Apellido, Email, Contrasena, NombreUsuario) VALUES (?, ?, ?, ?, ?)';

    connection.query(sql, [nombre, apellido, email, contraseña, nombreusuario], (err, results) => {
      if (err) {
        console.error('Error al insertar en la base de datos:', err);
        res.status(500).json({
          result_estado: 'error',
          result_message: err.message,
          result_rows: 0,
          result_proceso: 'POST USUARIO',
          result_data: ''
        });
        return;
      }

      res.json({
        result_estado: 'ok',
        result_message: 'USUARIO Insertado',
        result_rows: results.affectedRows,
        result_proceso: 'POST USUARIO',
        result_data: results.insertId
      });
    });
  });
});


/*LOGIN*/

ServidorWeb.post('/login', (req, res) => {
  const { nombreusuario, contraseña } = req.body;

  // Consulta para verificar el usuario y contraseña
  const sql = 'SELECT * FROM usuario WHERE NombreUsuario = ? AND Contrasena = ?';

  connection.query(sql, [nombreusuario, contraseña], (err, results) => {
    if (err) {
      console.error('Error al verificar el login:', err);
      res.status(500).json({
        result_estado: 'error',
        result_message: 'Error en el servidor al verificar las credenciales.',
        result_data: ''
      });
      return;
    }

    if (results.length > 0) {
      // Si el usuario existe y la contraseña coincide
      res.json({
        result_estado: 'ok',
        result_message: 'Login exitoso.',
        result_data: results[0] // Puedes enviar información del usuario aquí
      });
    } else {
      // Si no existe el usuario o la contraseña es incorrecta
      res.status(401).json({
        result_estado: 'error',
        result_message: 'Nombre de usuario o contraseña incorrectos.',
        result_data: ''
      });
    }
  });
});









// Iniciar el servidor
ServidorWeb.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});