/*CONEXIONES*/

const Mailjet = require('node-mailjet');

// Mailjet
const mailjet = new Mailjet({
  apiKey: 'ab2d2cee5a35da44e0d926674bdbd36a',
  apiSecret: 'c634830f2aca5c0ee4ebdfe2ee9eafd8'
});

const session = require('express-session');
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const crypto = require('crypto');

const ServidorWeb = express();
const port = 3000;

ServidorWeb.use(express.static(path.join(__dirname, 'Frontend')));
ServidorWeb.use(express.json());
ServidorWeb.use(express.urlencoded({ extended: false }));

ServidorWeb.use(session({
  secret: 'tu_secreto_aqui',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

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

ServidorWeb.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


/*NUEVO USUARIO*/	

ServidorWeb.post('/nuevousuario', async (req, res) => {
  const { nombre, apellido, email, nombreusuario, contrasena } = req.body;
  const checkUserSql = 'SELECT COUNT(*) AS count FROM usuario WHERE Email = ? OR NombreUsuario = ?';

  try {
    const [results] = await connection.promise().query(checkUserSql, [email, nombreusuario]);

    if (results[0].count > 0) {
      return res.status(400).json({
        result_estado: 'error',
        result_message: 'El email o nombre de usuario ya está registrado.',
        result_rows: 0,
        result_proceso: 'POST CLIENTE',
        result_data: ''
      });
    }

    // Insertar usuario con estado pendiente
    const insertSql = 'INSERT INTO usuario (Nombre, Apellido, Email, Contrasena, NombreUsuario, Estado) VALUES (?, ?, ?, ?, ?, "pendiente")';
    const [insertResult] = await connection.promise().query(insertSql, [nombre, apellido, email, contrasena, nombreusuario]);

    // Enviar correo de confirmación
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
                "Name": `${nombre} ${apellido}`
              }
            ],
            "Subject": "Confirma tu cuenta",
            "HTMLPart": `
              <h1>Confirma tu cuenta en Tienda Razer</h1>
              <p>Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
              <a href="http://localhost:3000/confirmar-cuenta?userId=${insertResult.insertId}">Confirmar cuenta</a>
              <p>Este enlace expirará en 24 horas.</p>
            `
          }
        ]
      });

    await request;

    res.json({
      result_estado: 'ok',
      result_message: 'Usuario registrado. Por favor, confirma tu cuenta a través del correo electrónico enviado.',
      result_rows: insertResult.affectedRows,
      result_proceso: 'POST USUARIO',
      result_data: insertResult.insertId
    });

  } catch (error) {
    console.error('Error en el proceso de registro:', error);
    res.status(500).json({
      result_estado: 'error',
      result_message: 'Error al procesar el registro.',
      result_rows: 0,
      result_proceso: 'POST USUARIO',
      result_data: ''
    });
  }
});

ServidorWeb.get('/confirmar-cuenta', async (req, res) => {
  const { userId } = req.query;

  console.log('Query params recibidos:', req.query); // Log para depuración

  if (!userId) {
    return res.status(400).send('Falta el ID de usuario en la URL.');
  }

  try {
    // Verificar que el usuario exista, independientemente de su estado
    const [userResults] = await connection.promise().query(
      'SELECT * FROM usuario WHERE ID = ?',
      [userId]
    );

    if (userResults.length === 0) {
      return res.status(404).send('Usuario no encontrado.');
    }

    const user = userResults[0];

    if (user.Estado === 'activo') {
      return res.status(400).send('La cuenta ya ha sido confirmada previamente.');
    }

    // Actualizar el estado del usuario a 'activo'
    await connection.promise().query(
      'UPDATE usuario SET Estado = "activo" WHERE ID = ?',
      [userId]
    );

    res.redirect('/cuentaconfirmada.html');
  } catch (error) {
    console.error('Error al confirmar la cuenta:', error);
    res.status(500).send(`Error al confirmar la cuenta: ${error.message}`);
  }
});


/*MOSTRAR USUARIOS*/
ServidorWeb.get('/mostrarusuarios', (req, res) => {
  const sql = 'SELECT ID, Nombre, Apellido, NombreUsuario, Email, Estado FROM usuario';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error al mostrar los usuarios:', err);
      res.status(500).json({
        result_estado: 'error', 
        result_message: 'Error al mostrar los usuarios.',
        result_data: []
      });
      return;
    }

    res.json(results); // Enviamos directamente el array de resultados
  });
});


/*LOGIN*/
ServidorWeb.post('/login', (req, res) => {
  const { nombreusuario, contrasena } = req.body;

  const sql = 'SELECT * FROM usuario WHERE NombreUsuario = ? AND Contrasena = ?';

  connection.query(sql, [nombreusuario, contrasena], (err, results) => {
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
      // Guardar el ID del usuario en la sesion
      req.session.userId = results[0].ID;
      res.json({
        result_estado: 'ok',
        result_message: 'Login exitoso.',
        result_data: results[0] 
      });
    } else {
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
      // Generar token unico
      const token = crypto.randomBytes(20).toString('hex');
      const expirationTime = new Date(Date.now() + 3600000); // Token valido por 1 hora

      // Guardar el token en la base de datos
      await connection.promise().query('UPDATE usuario SET reset_token = ?, reset_token_expires = ? WHERE Email = ?', [token, expirationTime, email]);

      // Enviar correo electronico usando Mailjet
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

    // Verificar que el token sea valido y no haya expirado
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
    // Actualizar la contraseña y limpiar el token de recuperacion
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


  
  ServidorWeb.put('/actualizarusuario', async (req, res) => {
    // Verificar si el usuario está autenticado
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            result_estado: 'error',
            result_message: 'Usuario no autenticado'
        });
    }

    const { nombre, apellido, email, nombreusuario } = req.body;
    const userId = req.session.userId;

    const query = 'UPDATE usuario SET Nombre = ?, Apellido = ?, Email = ?, NombreUsuario = ? WHERE ID = ?';

    try {
        const [result] = await connection.promise().query(query, [nombre, apellido, email, nombreusuario, userId]);

        if (result.affectedRows > 0) {
            res.json({
                result_estado: 'ok',
                result_message: 'Datos actualizados correctamente'
            });
        } else {
            res.status(404).json({
                result_estado: 'error',
                result_message: 'No se encontró el usuario para actualizar'
            });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            result_estado: 'error',
            result_message: 'Error al actualizar los datos del usuario'
        });
    }
});


});


// Iniciar el servidor
ServidorWeb.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
