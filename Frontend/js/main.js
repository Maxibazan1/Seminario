document.addEventListener("DOMContentLoaded", () => {

    /* CREAR CUENTA */
    const formCrearCuenta = document.getElementById('crearcuenta');
    if (formCrearCuenta) {
        formCrearCuenta.addEventListener('submit', crearCuenta);
    }

    /* MOSTRAR USUARIOS */
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    if (tablaUsuarios) {
        cargarUsuarios();
    }

    /* ACTUALIZAR DATOS */
    const formActualizarDatos = document.getElementById('actualizardatos');
    if (formActualizarDatos) {
        formActualizarDatos.addEventListener('submit', actualizarDatos);
    }

    /* LOGIN */
    const formLogin = document.getElementById('login');
    if (formLogin) {
        formLogin.addEventListener('submit', iniciarSesion);
    }

    /* RECUPERAR CONTRASEÑA */
    const formRecuperarContrasena = document.getElementById('recuperarContrasena');
    if (formRecuperarContrasena) {
        formRecuperarContrasena.addEventListener('submit', recuperarContrasena);
    }

    /* CAMBIAR CONTRASEÑA */
    const formCambiarContrasena = document.getElementById('cambiarContrasena');
    if (formCambiarContrasena) {
        formCambiarContrasena.addEventListener('submit', cambiarContrasena);
    }

    /* OBTENER INFORMACIÓN PERSONAL */
    const informacionPersonal = document.getElementById('informacion-personal');
    if (informacionPersonal) {
        obtenerUsuario();
    }

    /* INSERTAR PRODUCTO */
    const formInsertarProducto = document.getElementById('formInsertarProducto');
    if (formInsertarProducto) {
        formInsertarProducto.addEventListener('submit', insertarProducto);
    }

    /* CARGAR PRODUCTOS */
    const contenedorProductos = document.getElementById('contenedorproductos');
    if (contenedorProductos) {
        cargarProductos();
    }
});

async function crearCuenta(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const apellido = document.getElementById('apellido')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const contrasena = document.getElementById('contrasena')?.value.trim() || '';
    const confirmarcontrasena = document.getElementById('confirmarcontrasena')?.value.trim() || '';
    const aliasusuario = document.getElementById('aliasusuario')?.value.trim() || '';

    if (!nombre || !apellido || !email || !aliasusuario || !contrasena || !confirmarcontrasena) {
        alert('Por favor, complete todos los campos');
        return;
    }

    if (contrasena !== confirmarcontrasena) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const direccionCompleta = {
        direccion: document.getElementById('direccion')?.value.trim() || '',
        ciudad: document.getElementById('ciudad')?.value.trim() || '',
        provincia: document.getElementById('provincia')?.value.trim() || '',
        codigoPostal: document.getElementById('codigoPostal')?.value.trim() || ''
    };

    if (!direccionCompleta.direccion || !direccionCompleta.ciudad || !direccionCompleta.provincia || !direccionCompleta.codigoPostal) {
        alert('Por favor, complete todos los campos de la dirección');
        return;
    }

    const ClienteParaActualizar = {
        nombre,
        apellido,
        email,
        nombreusuario: aliasusuario,
        contrasena,
        direccionCompleta
    };

    try {
        const response = await fetch('/nuevousuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ClienteParaActualizar)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.result_message || 'Error en la petición');
        }

        if (data.result_estado === 'ok') {
            alert('Cliente insertado');
        } else {
            alert(`Error del servidor: ${data.result_message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Se produjo un error: ${error.message}`);
    }
}

function cargarUsuarios() {
    console.log('Intentando cargar usuarios...');
    fetch('/mostrarusuarios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(usuarios => {
            console.log('Usuarios recibidos de la BD:', usuarios);
            const tablaUsuarios = document.getElementById('tablaUsuarios');
            if (Array.isArray(usuarios) && usuarios.length > 0) {
                const contenidoTabla = usuarios.map(usuario => `
                    <tr>
                        <td>${usuario.ID}</td>
                        <td>${usuario.Nombre}</td>
                        <td>${usuario.Apellido}</td>
                        <td>${usuario.NombreUsuario}</td>
                        <td>${usuario.Email}</td>
                        <td>${usuario.Estado}</td>
                        <td>
                            <button class="btn btn-sm btn-primary">Editar</button>
                            <button class="btn btn-sm btn-danger">Eliminar</button>
                        </td>
                    </tr>
                `).join('');
                tablaUsuarios.innerHTML = contenidoTabla;
            } else {
                tablaUsuarios.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron usuarios</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al cargar usuarios:', error);
            const tablaUsuarios = document.getElementById('tablaUsuarios');
            tablaUsuarios.innerHTML = `<tr><td colspan="6" class="text-center">Error al cargar usuarios: ${error.message}</td></tr>`;
        });
}

async function obtenerUsuario() {
    try {
        const response = await fetch('/obtenerusuario');
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        const data = await response.json();

        if (data.result_estado === 'ok') {
            document.getElementById('nombreInput').value = data.usuario.Nombre || '';
            document.getElementById('apellidoInput').value = data.usuario.Apellido || '';
            document.getElementById('emailInput').value = data.usuario.Email || '';
            document.getElementById('usuarioInput').value = data.usuario.NombreUsuario || '';
            document.getElementById('direccionInput').value = data.usuario.Direccion.Direccion || '';
            document.getElementById('ciudadInput').value = data.usuario.Direccion.Ciudad || '';
            document.getElementById('provinciaInput').value = data.usuario.Direccion.Provincia || '';
            document.getElementById('codigoPostalInput').value = data.usuario.Direccion.CodigoPostal || '';
        } else {
            console.error(data.result_message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

async function iniciarSesion(event) {
    event.preventDefault();
    const nombreusuario = document.getElementById('UsuarioLogin')?.value.trim() || '';
    const contrasena = document.getElementById('ContrasenaLogin')?.value || '';

    if (!nombreusuario || !contrasena) {
        alert('Por favor, ingrese nombre de usuario y contraseña');
        return;
    }

    const datosLogin = {
        nombreusuario,
        contrasena: contrasena
    };

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosLogin)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.result_message || 'Error en la autenticación');
        }

        if (data.result_estado === 'ok') {
            alert(`Bienvenido ${nombreusuario}`);
            window.location.href = 'index.html';
        } else {
            alert(`Error: ${data.result_message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

async function actualizarDatos(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const aliasusuario = document.getElementById('aliasusuario').value.trim();

    if (!nombre || !apellido || !email || !aliasusuario) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const datosActualizar = {
        nombre,
        apellido,
        email,
        nombreusuario: aliasusuario
    };

    try {
        const response = await fetch('/actualizardatos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizar)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.result_message || 'Error en la actualización');
        }

        if (data.result_estado === 'ok') {
            alert('Datos actualizados correctamente');
        } else {
            alert(`Error: ${data.result_message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Se produjo un error: ${error.message}`);
    }
}

async function recuperarContrasena(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();

    if (!email) {
        alert('Por favor, ingrese su correo electrónico');
        return;
    }

    const datosRecuperar = {
        email
    };

    try {
        const response = await fetch('/recuperarcontrasena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosRecuperar)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.result_message || 'Error en la recuperación');
        }

        if (data.result_estado === 'ok') {
            alert('Se ha enviado un correo para restablecer su contraseña');
        } else {
            alert(`Error: ${data.result_message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

async function cambiarContrasena(event) {
    event.preventDefault();

    const nuevaContrasena = document.getElementById('nuevaContrasena').value.trim();
    const confirmarContrasena = document.getElementById('confirmarContrasena').value.trim();

    if (nuevaContrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden. Por favor, intentalo de nuevo');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        alert('Token no valido. Por favor, solicita un nuevo enlace de recuperacion');
        return;
    }

    try {
        const response = await fetch('/cambiarcontrasena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, nuevaContrasena })
        });

        const data = await response.json();

        if (data.result_estado === 'ok') {
            alert('Tu contraseña ha sido cambiada exitosamente');
            window.location.href = 'login.html';
        } else {
            alert(`Error: ${data.result_message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

async function insertarProducto(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const descripcion = document.getElementById('descripcion')?.value.trim() || '';
    const precio = document.getElementById('precio')?.value.trim() || '';
    const stock = document.getElementById('stock')?.value.trim() || '';
    const talle = document.getElementById('talle')?.value.trim() || '';
    const genero = document.getElementById('genero')?.value.trim() || '';
    const imagen = document.getElementById('imagen')?.files[0];

    // Validación de campos
    if (!nombre || !descripcion || !precio || !stock || !talle || !genero || !imagen) {
        alert('Por favor, complete todos los campos del producto.');
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('stock', stock);
    formData.append('talle', talle);
    formData.append('genero', genero);
    formData.append('imagen', imagen);

    try {
        const response = await fetch('/insertarproductos', { 
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.result_message || 'Error al insertar el producto');
        }

        if (data.result_estado === 'ok') {
            alert('Producto insertado correctamente');
        } else {
            alert(`Error: ${data.result_message}`); 
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Se produjo un error: ${error.message}`); 
    }
}


let cantidadActual = 6; // Cantidad de productos mostrados inicialmente
const incremento = 6; // Cantidad de productos a cargar al hacer click en "Mostrar mas"

function cargarProductos() {
    console.log('Cargando productos...');
    fetch('/obtenerproductos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const productos = data.result_data;
            console.log('Productos recibidos de la BD:', productos);
            const contenedorProductos = document.getElementById('contenedorproductos');
            contenedorProductos.innerHTML = ''; // Limpiar el contenedor antes de agregar productos

            // Mostrar solo los productos hasta la cantidad actual
            const productosParaMostrar = productos.slice(0, cantidadActual);
            if (Array.isArray(productosParaMostrar) && productosParaMostrar.length > 0) {
                const contenidoProductos = productosParaMostrar.map(producto => `
                    <div class="col-md-4 mb-4 d-flex justify-content-center">
                        <div class="card border-2 border-dark hover-shadow" style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); width: 18rem;">
                            <img src="${producto.ImagenUrl}" class="card-img-top" alt="${producto.Nombre}" style="filter: brightness(90%);">
                            <div class="card-body">
                                <p class="card-title text-dark text-center">${producto.Nombre}</p>
                                <p class="card-text text-dark text-center" style="font-size: 1.7em; font-weight: bold;">$${producto.Precio}</p>
                                <button class="btn btn-sm btn-primary d-block mx-auto rounded-5" style="background-color: #0D0638; border: none; padding: 10px 20px;">Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                `).join('');
                contenedorProductos.innerHTML = contenidoProductos;

                // Si hay más productos que mostrar, agregar el botón "Mostrar más"
                if (productos.length > cantidadActual) {
                    const botonMostrarMas = document.createElement('button');
                    botonMostrarMas.textContent = 'Mostrar más';
                    botonMostrarMas.style = 'margin: 20px auto; border-radius: 20px; padding: 10px 20px;';
                    botonMostrarMas.className = 'btn btn-primary text-center rounded-5';
                    botonMostrarMas.onclick = () => {
                        cantidadActual += incremento; // Aumentar la cantidad mostrada
                        cargarProductos(); // Volver a cargar los productos con la nueva cantidad
                    };
                    contenedorProductos.appendChild(botonMostrarMas);
                }
            } else {
                contenedorProductos.innerHTML = '<div class="col-12 text-center">No se encontraron productos</div>';
            }
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            const contenedorProductos = document.getElementById('contenedorproductos');
            contenedorProductos.innerHTML = `<div class="col-12 text-center">Error al cargar productos: ${error.message}</div>`;
        });
}





