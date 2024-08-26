window.addEventListener("load", () => {


    /*CREAR CUENTA*/

    const form = document.getElementById('crearcuenta');

    // Validar existencia del formulario
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault(); // Evita que se envíe el formulario automáticamente

            // Capturar los valores ingresados
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('email').value;
            const aliasusuario = document.getElementById('aliasusuario').value;
            const contrasena = document.getElementById('contrasena').value;
            const confirmarcontraseña = document.getElementById('confirmarcontraseña').value;

            // Validar que las contraseñas coincidan
            if (contrasena !== confirmarcontraseña) {
                alert('Las contraseñas no coinciden');
                return;
            }

            // Crear objeto para enviar al servidor
            const ClienteParaActualizar = {
                nombre: nombre,
                apellido: apellido,
                email: email,
                nombreusuario: aliasusuario,
                contraseña: contrasena
            };

            // Enviar los datos al servidor
            try {
                const response = await fetch('/nuevousuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ClienteParaActualizar)
                });

                if (!response.ok) {
                    // Si la respuesta no es OK, lanzar un error
                    const errorData = await response.json();
                    throw new Error(errorData.result_message || 'Error en la petición');
                }

                const data = await response.json();
                console.log('Respuesta del servidor:', data);

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

    document.getElementById('login').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const nombreusuario = document.getElementById('UsuarioLogin').value;
        const contrasena = document.getElementById('ContrasenaLogin').value;
    
        const datosLogin = {
            nombreusuario: nombreusuario,
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
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.result_message || 'Error en la autenticación');
            }
    
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
    
            if (data.result_estado === 'ok') {
                alert('Bienvenido ' + nombreusuario);
                window.location.href = 'index.html';
                // Redireccionar o realizar otra acción tras el login
            } else {
                alert(`Error: ${data.result_message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    });
    




});

