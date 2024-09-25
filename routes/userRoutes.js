const express = require('express');
const ServidorWeb = express.Router();
const userController = require('../controllers/userController.js');

// Rutas de usuario
ServidorWeb.get('/', userController.getHome);
ServidorWeb.post('/nuevousuario', userController.NuevoUsuario);
ServidorWeb.get('/confirmar-cuenta', userController.ConfirmarCuenta);
ServidorWeb.get('/mostrarusuarios', userController.MostrarUsuarios);
ServidorWeb.get('/obtenerusuario', userController.ObtenerUsuario);
ServidorWeb.post('/login', userController.Login);
ServidorWeb.post('/recuperar-contrasena', userController.RecuperarContrasena);
ServidorWeb.post('/cambiar-contrasena', userController.CambiarContrasena);
ServidorWeb.put('/actualizarusuario', userController.ActualizarUsuario);

module.exports = ServidorWeb;