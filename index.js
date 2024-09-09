/*CONEXIONES*/

const Mailjet = require('node-mailjet');

// Configura Mailjet con tus credenciales
const mailjet = new Mailjet({
  apiKey: 'ab2d2cee5a35da44e0d926674bdbd36a',
  apiSecret: 'c634830f2aca5c0ee4ebdfe2ee9eafd8'
});

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const crypto = require('crypto');

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

///RECUPERAR CONTRASEÑA///
ServidorWeb.post('/recuperar-contrasena', async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({
          result_estado: 'error',
          result_message: 'El correo electrónico es requerido.',
          result_data: ''
      });
  }

  try {
      // Verificar si el email existe en la base de datos
      const [results] = await connection.promise().query('SELECT * FROM usuario WHERE Email = ?', [email]);

      if (results.length === 0) {
          return res.status(404).json({
              result_estado: 'error',
              result_message: 'No se encontró un usuario con ese correo electrónico.',
              result_data: ''
          });
      }

      // Generar token único
      const token = crypto.randomBytes(20).toString('hex');
      const expirationTime = new Date(Date.now() + 3600000); // Token válido por 1 hora

      // Guardar el token en la base de datos
      await connection.promise().query('UPDATE usuario SET reset_token = ?, reset_token_expires = ? WHERE Email = ?', [token, expirationTime, email]);

      // Enviar correo electrónico usando Mailjet
      const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
          "Messages":[
            {
              "From": {
                "Email": "tiendarazer2024@gmail.com",
                "Name": "Tienda Razer"
              },
              "To": [
                {
                  "Email": email,
                  "Name": "Usuario"
                }
              ],
              "Subject": "Recuperación de contraseña",
              "HTMLPart": `
                <h1>Recuperación de contraseña</h1>
                <p>Has solicitado recuperar tu contraseña. Por favor, haz clic en el siguiente enlace para restablecerla:</p>
                <a href="http://localhost:3000/cambiarcontraseña.html?token=${token}">Restablecer contraseña</a>
                <p>Si no has solicitado este cambio, puedes ignorar este correo.</p>
              `
            }
          ]
        });

      await request;

      res.json({
          result_estado: 'ok',
          result_message: 'Se ha enviado un correo de recuperación.',
          result_data: ''
      });
  } catch (error) {
      console.error('Error en el proceso de recuperación:', error);
      res.status(500).json({
          result_estado: 'error',
          result_message: 'Error al procesar la solicitud de recuperación.',
          result_data: ''
      });
  }
});


///CAMBIAR CONTRASEÑA///
ServidorWeb.post('/cambiar-contrasena', async (req, res) => {
  try {
    const { token, nuevaContrasena } = req.body;

    // Verificar que el token sea válido y no haya expirado
    const [rows] = await connection.promise().query(
      'SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        result_estado: 'error',
        result_message: 'Token inválido o expirado.',
        result_data: ''
      });
    }

    const usuario = rows[0];

    // Actualizar la contraseña y limpiar el token de recuperación
    await connection.promise().query(
      'UPDATE usuario SET Contrasena = ?, reset_token = NULL, reset_token_expires = NULL WHERE ID = ?',
      [nuevaContrasena, usuario.ID]
    );

    res.json({
      result_estado: 'ok',
      result_message: 'Contraseña cambiada exitosamente.',
      result_data: ''
    });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({
      result_estado: 'error',
      result_message: 'Error al procesar el cambio de contraseña.',
      result_data: ''
    });
  }
});


// Iniciar el servidor
ServidorWeb.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
