document.addEventListener("DOMContentLoaded", () => {

    /*CREAR CUENTA*/
    const formCrearCuenta = document.getElementById('crearcuenta');
    if (formCrearCuenta) {
        formCrearCuenta.addEventListener('submit', crearCuenta);
    }

    /*MOSTRAR USUARIOS*/
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    if (tablaUsuarios) {
        cargarUsuarios();
    }

    /*ACTUALIZAR DATOS*/
    const formActualizarDatos = document.getElementById('actualizardatos');
    if (formActualizarDatos) {
        formActualizarDatos.addEventListener('submit', actualizarDatos);
    }

    /*LOGIN*/
    const formLogin = document.getElementById('login');
    if (formLogin) {
        formLogin.addEventListener('submit', iniciarSesion);
    }

    /*RECUPERAR CONTRASEÑA*/
    const formRecuperarContrasena = document.getElementById('recuperarContrasena');
    if (formRecuperarContrasena) {
        formRecuperarContrasena.addEventListener('submit', recuperarContrasena);
    }

    /*CAMBIAR CONTRASEÑA*/
    const formCambiarContrasena = document.getElementById('cambiarContrasena');
    if (formCambiarContrasena) {
        formCambiarContrasena.addEventListener('submit', cambiarContrasena);
    }

    const informacionPersonal = document.getElementById('informacion-personal'); // Verificar la existencia del div
        if (informacionPersonal) {
            obtenerUsuario(); // Invocar la función si el div existe
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

    // Asegúrate de que los campos de la dirección también estén completos
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
        direccionCompleta // Envía el objeto direccionCompleta correctamente
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
            throw new Error(data.result_message || 'Error en la peticion');
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
            throw new Error(data.result_message || 'Error en la autenticacion');
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

async function cargarDatosUsuario() {
    try {
        const response = await fetch('/obtenerusuario', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }

        const data = await response.json();

        if (data.result_estado === 'ok') {
            document.getElementById('nombre').value = data.usuario.Nombre;
            document.getElementById('apellido').value = data.usuario.Apellido;
            document.getElementById('email').value = data.usuario.Email;
            document.getElementById('aliasusuario').value = data.usuario.NombreUsuario;
        } else {
            alert(`Error: ${data.result_message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error al cargar los datos del usuario: ${error.message}`);
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

    const datosActualizados = {
        nombre,
        apellido,
        email,
        nombreusuario: aliasusuario
    };

    try {
        const response = await fetch('/actualizarusuario', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.result_message || 'Error en la actualización');
        }

        if (data.result_estado === 'ok') {
            alert('Datos actualizados');
        } else {
            alert(`Error del servidor: ${data.result_message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Se produjo un error: ${error.message}`);
    }
}



async function recuperarContrasena(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();

    alert(email);
    try {
        const response = await fetch('/recuperar-contrasena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.result_message || 'Error en la solicitud de recuperacion');
        }

        if (data.result_estado === 'ok') {
            alert('Se ha enviado un correo con instrucciones para recuperar tu contraseña');
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
        const response = await fetch('/cambiar-contrasena', {
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