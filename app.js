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


const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // carpeta temporal para subir imAgenes
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dzxxndbzu',
  api_key: '271516758949379',
  api_secret: 'qsjuIzTP-MrDzqNX0JakC6u-ss0'
});


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
  password: '12345678',  //{{admin en notebook}}
  database: 'tienda_online'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL.');
});


//////////////////////////////////////////////////////////////////////////////////
////////////////////////////// /*ENDPOINT*/ //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


/*NUEVO USUARIO*/	
ServidorWeb.post('/nuevousuario', async (req, res) => {
  const { nombre, apellido, email, nombreusuario, contrasena, direccionCompleta } = req.body; // Extraer direccionCompleta
  
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
    // Verificar si direccionCompleta tiene valores validos 
    if (direccionCompleta && direccionCompleta.direccion && direccionCompleta.ciudad && direccionCompleta.provincia && direccionCompleta.codigoPostal) {
      const insertDireccionSql = 'INSERT INTO direccion (UsuarioID, Direccion, Ciudad, Provincia, CodigoPostal) VALUES (?, ?, ?, ?, ?)';
      await connection.promise().query(insertDireccionSql, [
        insertResult.insertId,
        direccionCompleta.direccion, 
        direccionCompleta.ciudad, 
        direccionCompleta.provincia, 
        direccionCompleta.codigoPostal
      ]);
    } else {
      return res.status(400).json({
        result_estado: 'error',
        result_message: 'Error: Datos de la dirección incompletos.',
        result_rows: 0,
        result_proceso: 'POST DIRECCION',
        result_data: ''
      });
    }
    // Enviar correo de confirmacion
    const request = mailjet
      .post("send", {'version': 'v3.1'})
      .request({
        "Messages": [
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


/*MOSTRAR LOS USUARIOS*/
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
    res.json(results);
  });
});


/*OBTENER USUARIO*/
ServidorWeb.get('/obtenerusuario', async (req, res) => {
  // Verificar si el usuario está autenticado
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      result_estado: 'error',
      result_message: 'Usuario no autenticado'
    });
  }

  try {
    // Realizamos un JOIN para obtener tanto los datos del usuario como los de la tabla direccion
    const [userResults] = await connection.promise().query(
      `SELECT u.Nombre, u.Apellido, u.Email, u.NombreUsuario, 
              d.ID as DireccionID, d.Direccion, d.Ciudad, d.Provincia, d.CodigoPostal
       FROM usuario u
       LEFT JOIN direccion d ON u.ID = d.UsuarioID
       WHERE u.ID = ?`,
      [req.session.userId]
    );

    if (userResults.length === 0) {
      return res.status(404).json({
        result_estado: 'error',
        result_message: 'Usuario no encontrado'
      });
    }

    res.json({
      result_estado: 'ok',
      usuario: {
        Nombre: userResults[0].Nombre,
        Apellido: userResults[0].Apellido,
        Email: userResults[0].Email,
        NombreUsuario: userResults[0].NombreUsuario,
        Direccion: {
          ID: userResults[0].DireccionID,
          Direccion: userResults[0].Direccion,
          Ciudad: userResults[0].Ciudad,
          Provincia: userResults[0].Provincia,
          CodigoPostal: userResults[0].CodigoPostal
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({
      result_estado: 'error',
      result_message: 'Error al obtener los datos del usuario'
    });
  }
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
      console.log('ID del usuario que inició sesión:', req.session.userId);
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


/*RECUPERAR CONTRASEÑA*/
ServidorWeb.post('/recuperarcontrasena', async (req, res) => {
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


/*CAMBIAR CONTRASEÑA*/
ServidorWeb.post('/cambiarcontrasena', async (req, res) => {
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

});

/*INSERTAR PRODUCTO*/
ServidorWeb.post('/insertarproducto', upload.single('imagen'), async (req, res) => {
  const { nombre, marca, descripcion, precio, genero, tipo } = req.body;
  const imagen = req.file;

  // Validación de campos
  if (!nombre || !marca|| !descripcion || !precio || !genero || !tipo|| !imagen) {
      return res.status(400).json({
          result_estado: 'error',
          result_message: 'Por favor, complete todos los campos del producto y cargue una imagen.',
          result_data: ''
      });
  }

  try {
      // Subir imagen a Cloudinary
      const result = await cloudinary.uploader.upload(imagen.path);

      const insertSql = `
          INSERT INTO producto (Nombre, Marca, Descripcion, Precio, Genero, Tipo, ImagenUrl) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [insertResult] = await connection.promise().query(insertSql, [
          nombre,
          marca,
          descripcion,
          precio,
          genero,
          tipo,
          result.secure_url // URL de la imagen subida a Cloudinary
      ]);

      res.json({
          result_estado: 'ok',
          result_message: 'Producto insertado correctamente.',
          result_data: insertResult.insertId
      });
  } catch (error) {
      console.error('Error al insertar el producto:', error);
      res.status(500).json({
          result_estado: 'error',
          result_message: 'Error al insertar el producto.',
          result_data: ''
      });
  }
});


ServidorWeb.get('/obtenerproductos', async (req, res) => {
  try {
      const sql = 'SELECT * FROM producto';
      const [productos] = await connection.promise().query(sql);
      
      res.json({
          result_estado: 'ok',
          result_message: 'Productos obtenidos correctamente.',
          result_data: productos
      });
  } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({
          result_estado: 'error',
          result_message: 'Error al obtener productos.',
          result_data: ''
      });
  }
});

/*MOSTRAR PRODUCTO POR ID*/
ServidorWeb.get('/producto/:id', async (req, res) => {
  const productoId = req.params.id;

  try {
      const sql = 'SELECT * FROM producto WHERE id = ?';
      const [producto] = await connection.promise().query(sql, [productoId]);

      if (producto.length > 0) {
          res.json({
              result_estado: 'ok',
              result_message: 'Producto obtenido correctamente.',
              result_data: producto[0] // Enviar solo el primer producto
          });
      } else {
          res.status(404).json({
              result_estado: 'error',
              message: 'Producto no encontrado'
          });
      }
  } catch (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).json({
          result_estado: 'error',
          message: 'Error al obtener el producto'
      });
  }
});

/*AGREGAR TALLES Y STOCK*/
ServidorWeb.post('/agregarTalleyStock', async (req, res) => {
  const { ProductoID, Talle, Stock } = req.body;

  if (!ProductoID || !Talle || !Stock) {
      return res.status(400).json({
          result_estado: 'error',
          result_message: 'Por favor, complete todos los campos (ProductoID, Talle y Stock).',
          result_data: ''
      });
  }

  try {
      // Verificar si ya existe un registro con ese ProductoID y Talle
      const selectSql = `
          SELECT * FROM Stock WHERE ProductoID = ? AND Talle = ?
      `;
      const [resultado] = await connection.promise().query(selectSql, [ProductoID, Talle]);

      if (resultado.length > 0) {
          // Si existe, actualizar el stock
          const updateSql = `
              UPDATE Stock SET Stock = ? WHERE ProductoID = ? AND Talle = ?
          `;
          await connection.promise().query(updateSql, [Stock, ProductoID, Talle]);

          res.json({
              result_estado: 'ok',
              result_message: 'Stock actualizado correctamente.',
              result_data: resultado[0].ID
          });
      } else {
          // Si no existe, insertar un nuevo registro
          const insertSql = `
              INSERT INTO Stock (ProductoID, Talle, Stock) VALUES (?, ?, ?)
          `;
          const [insertResult] = await connection.promise().query(insertSql, [ProductoID, Talle, Stock]);

          res.json({
              result_estado: 'ok',
              result_message: 'Talle y stock insertados correctamente.',
              result_data: insertResult.insertId // ID del nuevo registro insertado
          });
      }

  } catch (error) {
      console.error('Error al agregar/editar talle y stock:', error);
      res.status(500).json({
          result_estado: 'error',
          result_message: 'Error al procesar la solicitud.',
          result_data: ''
      });
  }
});


/*MOSTRAR TALLES Y STOCK*/ 
ServidorWeb.get('/obtenerTallesYStock/:productoID', async (req, res) => {
  const { productoID } = req.params;

  if (!productoID) {
      return res.status(400).json({
          result_estado: 'error',
          result_message: 'ID de producto no proporcionado.',
          result_data: ''
      });
  }

  try {
      const selectSql = `
          SELECT * FROM Stock WHERE ProductoID = ?
      `;
      const [resultado] = await connection.promise().query(selectSql, [productoID]);

      if (resultado.length > 0) {
          res.json({
              result_estado: 'ok',
              result_message: 'Talles y stock obtenidos correctamente.',
              result_data: resultado
          });
      } else {
          res.json({
              result_estado: 'ok',
              result_message: 'No se encontraron talles y stock para este producto.',
              result_data: []
          });
      }

  } catch (error) {
      console.error('Error al obtener talles y stock:', error);
      res.status(500).json({
          result_estado: 'error',
          result_message: 'Error al procesar la solicitud.',
          result_data: ''
      });
  }
});




// Iniciar el servidor
ServidorWeb.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
