document.addEventListener("DOMContentLoaded", () => {

    /*CREAR CUENTA*/
    const formCrearCuenta = document.getElementById('crearcuenta');

    if (formCrearCuenta) {
        formCrearCuenta.addEventListener('submit', async function(event) {
            event.preventDefault();

            const nombre = document.getElementById('nombre')?.value.trim() || '';
            const apellido = document.getElementById('apellido')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const aliasusuario = document.getElementById('aliasusuario')?.value.trim() || '';
            const contrasena = document.getElementById('contrasena')?.value || '';
            const confirmarcontrasena = document.getElementById('confirmarcontrasena')?.value || '';

            if (!nombre || !apellido || !email || !aliasusuario || !contrasena || !confirmarcontrasena) {
                alert('Por favor, complete todos los campos');
                return;
            }

            if (contrasena !== confirmarcontrasena) {
                alert('Las contraseñas no coinciden');
                return;
            }

            const ClienteParaActualizar = {
                nombre,
                apellido,
                email,
                nombreusuario: aliasusuario,
                contraseña: contrasena
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
                    alert('Cliente insertado con éxito.');
                } else {
                    alert(`Error del servidor: ${data.result_message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Se produjo un error: ${error.message}`);
            }
        });
    }

    /*LOGIN*/
    const formLogin = document.getElementById('login');
    if (formLogin) {
        formLogin.addEventListener('submit', async function(event) {
            event.preventDefault();
        
            const nombreusuario = document.getElementById('UsuarioLogin')?.value.trim() || '';
            const contrasena = document.getElementById('ContrasenaLogin')?.value || '';
        
            if (!nombreusuario || !contrasena) {
                alert('Por favor, ingrese nombre de usuario y contraseña');
                return;
            }
        
            const datosLogin = {
                nombreusuario,
                contraseña: contrasena
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
        });
    }

    /*RECUPERAR CONTRASEÑA*/
    const formRecuperarContrasena = document.getElementById('recuperarContrasena');
    if (formRecuperarContrasena) {
        formRecuperarContrasena.addEventListener('submit', async function(event) {
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
                    throw new Error(data.result_message || 'Error en la solicitud de recuperación');
                }

                if (data.result_estado === 'ok') {
                    alert('Se ha enviado un correo con instrucciones para recuperar tu contraseña.');
                } else {
                    alert(`Error: ${data.result_message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}`);
            }
        });
    }

/*CAMBIAR CONTRASEÑA*/
const formCambiarContrasena = document.getElementById('cambiarContrasena');
if (formCambiarContrasena) {
    formCambiarContrasena.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nuevaContrasena = document.getElementById('nuevaContrasena').value.trim();
        const confirmarContrasena = document.getElementById('confirmarContrasena').value.trim();

        if (nuevaContrasena !== confirmarContrasena) {
            alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            alert('Token no válido. Por favor, solicita un nuevo enlace de recuperación.');
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
                alert('Tu contraseña ha sido cambiada exitosamente.');
                window.location.href = 'login.html';
            } else {
                alert(`Error: ${data.result_message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    });
}

});
