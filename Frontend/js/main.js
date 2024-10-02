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

    cargarProducto();

    const tablaProductos = document.getElementById('tablaProductos');
    if (tablaProductos) {
        cargarTablaProductos();
    }


    /* MOSTRAR TALLES Y STOCK */
    const btnVerTallesStock = document.getElementById('btnVerTallesStock');
    if (btnVerTallesStock) {
        btnVerTallesStock.addEventListener('click', mostrarTallesYStock);
    }

    const btnAgregarCarrito = document.getElementById('BtnAgregarCarrito');
    if (btnAgregarCarrito) {
        btnAgregarCarrito.addEventListener('click', agregarAlCarrito);
    }

    const contenedorProductosCarrito = document.getElementById('contenedorcarrito');
    if (contenedorProductosCarrito) {
        cargarProductosCarrito();
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
            window.location.href = 'indexSesionIniciada.html';
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
    const marca = document.getElementById('marca')?.value.trim() || '';
    const descripcion = document.getElementById('descripcion')?.value.trim() || '';
    const precio = document.getElementById('precio')?.value.trim() || '';
    const genero = document.getElementById('genero')?.value.trim() || '';
    const tipo = document.getElementById('tipo')?.value.trim() || '';
    const imagen = document.getElementById('imagen')?.files[0];

    if (!nombre || !marca || !descripcion || !precio || !genero || !tipo || !imagen) {
        alert('Por favor, complete todos los campos del producto.');
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('marca', marca);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('genero', genero);
    formData.append('tipo', tipo);
    formData.append('imagen', imagen);

    try {
        const response = await fetch('/insertarproducto', { 
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
const incremento = 6; // Cantidad de productos a cargar al hacer click en "Mostrar más"

function cargarProductos(data) {
    // Si no se pasan datos, se deben obtener todos los productos
    if (!data) {
        fetch('/obtenerproductos') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                const productos = data.result_data;
                mostrarProductos(productos);
            })
            .catch(error => {
                console.error('Error al cargar productos:', error);
                const contenedorProductos = document.getElementById('contenedorproductos');
                contenedorProductos.innerHTML = `<div class="col-12 text-center">Error al cargar productos: ${error.message}</div>`;
            });
    } else {
        // Si hay datos filtrados, mostrar esos productos
        mostrarProductos(data);
    }
}



function mostrarProductos(productos) {
    const contenedorProductos = document.getElementById('contenedorproductos');
    contenedorProductos.innerHTML = ''; // Limpiar el contenedor antes de agregar productos

    // Mostrar solo los productos hasta la cantidad actual
    const productosParaMostrar = productos.slice(0, cantidadActual);
    if (Array.isArray(productosParaMostrar) && productosParaMostrar.length > 0) {
        const contenidoProductos = productosParaMostrar.map(producto => `
            <div class="col-md-4 mb-4 d-flex justify-content-center">
                <div class="card border-2 border-dark hover-shadow" style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); width: 18rem; height: 100%; border-radius: 20px;">
                    <a href="producto.html?id=${producto.ID}">
                        <img src="${producto.ImagenUrl}" class="card-img-top" alt="${producto.Nombre}" style="filter: brightness(90%); width: 100%; height: auto; object-fit: cover; border-radius: 20px 20px 0 0;">
                    </a>
                    <div class="card-body">
                        <p class="card-title text-dark text-center">${producto.Nombre}</p>
                        <p class="card-text text-dark text-center" style="font-size: 1.7em; font-weight: bold;">$${producto.Precio}</p>
                    </div>
                    <div class="text-center mb-3">  <!-- Contenedor para centrar el botón -->
                        <a href="producto.html?id=${producto.ID}" class="btn btn-primary w-50" style="background-color: #0D0638; border: none;">
                            Ver
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        contenedorProductos.innerHTML = contenidoProductos;

        // Si hay más productos que mostrar, agregar el botón "Mostrar más"
        if (productos.length > cantidadActual) {
            const botonMostrarMas = document.createElement('button');
            botonMostrarMas.textContent = 'Mostrar más';
            botonMostrarMas.style = 'margin: 20px auto; border-radius: 20px; padding: 10px 20px; display: block; width: auto;';
            botonMostrarMas.className = 'btn btn-primary text-center rounded-5';
            botonMostrarMas.onclick = () => {
                cantidadActual += incremento; // Aumentar la cantidad mostrada
                cargarProductos(productos); // Volver a cargar los productos con la nueva cantidad
            };
            contenedorProductos.appendChild(botonMostrarMas);
        }
    } else {
        contenedorProductos.innerHTML = '<div class="col-12 text-center">No se encontraron productos</div>';
    }
}



let cantidad = 1; // Inicializar la cantidad a 1
const maxCantidad = 10; // Definir el límite máximo de cantidad

// Función para aumentar la cantidad
function aumentarCantidad() {
    if (cantidad < maxCantidad) { 
        cantidad++;
        document.getElementById('var-value').innerText = cantidad; // Actualizar el valor en el HTML
    } else {
        alert(`La cantidad máxima es ${maxCantidad}`); // Mostrar un mensaje si se alcanza el máximo
    }
}

// Función para disminuir la cantidad
function disminuirCantidad() {
    if (cantidad > 1) {
        cantidad--;
        document.getElementById('var-value').innerText = cantidad; // Actualizar el valor en el HTML
    }
}

// Función para obtener la cantidad actual
function obtenerCantidad() {
    return cantidad; // Devuelve la cantidad actual
}

let tallaSeleccionada;



async function cargarProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productoID = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:3000/producto/${productoID}`);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        const data = await response.json();

        if (data.result_estado === "ok") {
            const producto = data.result_data;
            
            document.querySelector('#imagenProducto').src = producto.ImagenUrl;
            document.querySelector('#nombreProducto').innerText = producto.Nombre;
            document.querySelector('#precioProducto').innerText = `$${producto.Precio}`;
            document.querySelector('#descripcionProducto').innerText = producto.Descripcion;

            // Mostrar talles y stock
            const tallesYStockContainer = document.getElementById('talle');
            if (tallesYStockContainer) {
                const responseTallesYStock = await fetch(`/obtenerTallesYStock/${productoID}`);
                const resultTallesYStock = await responseTallesYStock.json();

                if (resultTallesYStock.result_estado === 'ok') {
                    const tallesYStock = resultTallesYStock.result_data;

                    tallesYStockContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los datos

                    if (tallesYStock.length > 0) {
                        // Agregar botones de tallas
                        tallesYStock.forEach(talleYStock => {
                            const button = document.createElement('button');
                            button.type = 'button';
                            button.className = 'btn btn-outline-dark';
                            button.innerText = `${talleYStock.Talle} - Stock: ${talleYStock.Stock}`;

                            // Evento para seleccionar la talla
                            button.addEventListener('click', () => {
                                // Desmarcar todos los botones
                                document.querySelectorAll('#talle .btn').forEach(btn => {
                                    btn.classList.remove('active'); // Quitar clase activa de todos
                                });
                                // Marcar este botón como activo
                                button.classList.add('active'); // Añadir clase activa al botón seleccionado
                                tallaSeleccionada = talleYStock.Talle; // Guardar la talla seleccionada
                            });

                            tallesYStockContainer.appendChild(button);
                        });
                    } else {
                        tallesYStockContainer.innerHTML = '<p style="color: black;">No hay talles disponibles para este producto.</p>';
                    }
                } else {
                    tallesYStockContainer.innerHTML = `<p>Error: ${resultTallesYStock.result_message}</p>`;
                }
            }
        } else {
            console.error('Error al obtener el producto:', data.result_message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



const productosPorPagina = 5;
let productos = [];
let paginaActual = 1;

async function cargarTablaProductos() {
    try {
        const response = await fetch('/obtenerproductos'); 
        const data = await response.json(); 

        if (data.result_estado !== 'ok') {
            console.error('Error al cargar los productos:', data.result_message);
            return;
        }

        productos = data.result_data; 
        mostrarTablaProductos();

    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}



function mostrarTablaProductos() {
    const tbody = document.getElementById('productos-tbody');
    tbody.innerHTML = ''; // Limpiar contenido anterior

    // Calcular el índice de inicio y fin de los productos para la página actual
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productos.slice(inicio, fin);

    if (Array.isArray(productosPagina)) {
        productosPagina.forEach(producto => {
            const fila = document.createElement('tr');

            // Columna Imagen
            const imagenCol = document.createElement('td');
            const imagen = document.createElement('img');
            imagen.src = producto.ImagenUrl;
            imagen.alt = producto.Nombre;
            imagen.style.width = '100px';
            imagenCol.appendChild(imagen);
            fila.appendChild(imagenCol);

            // Columna Nombre
            const nombreCol = document.createElement('td');
            nombreCol.textContent = producto.Nombre;
            fila.appendChild(nombreCol);

            // Columna Marca
            const marcaCol = document.createElement('td');
            marcaCol.textContent = producto.Marca;
            fila.appendChild(marcaCol);

            // Columna Precio
            const precioCol = document.createElement('td');
            precioCol.textContent = `$${producto.Precio}`;
            fila.appendChild(precioCol);

            // Columna Género
            const generoCol = document.createElement('td');
            generoCol.textContent = producto.Genero;
            fila.appendChild(generoCol);

            // Columna Tipo
            const tipoCol = document.createElement('td');
            tipoCol.textContent = producto.Tipo;
            fila.appendChild(tipoCol);

            // Columna Agregar/Modificar Talle
            const agregarTalleCol = document.createElement('td');
            const btnAgregarTalle = document.createElement('button');
            btnAgregarTalle.textContent = 'Agregar/Editar';
            btnAgregarTalle.classList.add('btn', 'btn-primary', 'd-block', 'd-md-inline-block');
            btnAgregarTalle.onclick = () => {

                document.getElementById('modalAgregarTalle').setAttribute('data-producto-id', producto.ID);
                $('#modalAgregarTalle').modal('show');
            };
            agregarTalleCol.appendChild(btnAgregarTalle);
            fila.appendChild(agregarTalleCol);

            const verTallesStockCol = document.createElement('td');
            const btnVerTallesStock = document.createElement('button');

            btnVerTallesStock.textContent = 'Ver Talles y Stock';
            btnVerTallesStock.classList.add('btn', 'btn-primary', 'd-block', 'd-md-inline-block');

            btnVerTallesStock.onclick = () => {
                document.getElementById('modalVerTalles').setAttribute('data-producto-id', producto.ID);
                mostrarTallesYStock(); // Llamar a la función para mostrar los datos
                $('#modalVerTalles').modal('show');
            };

            verTallesStockCol.appendChild(btnVerTallesStock);
            fila.appendChild(verTallesStockCol);

            tbody.appendChild(fila);
        });
    }
    configurarPaginado(); // Actualiza la paginación
}



function configurarPaginado() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; 
    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {

        const li = document.createElement('li');
        li.className = 'page-item' + (i === paginaActual ? ' active' : '');
        const a = document.createElement('a');

        a.className = 'page-link';
        a.textContent = i;
        a.href = '#';

        a.onclick = (event) => {
            event.preventDefault();
            paginaActual = i; // Actualiza la página actual
            mostrarTablaProductos(); // Muestra los productos de la nueva página
        };

        li.appendChild(a);
        paginationContainer.appendChild(li);
    }
}



async function agregarTalleyStock() {
    const productoID = document.getElementById('modalAgregarTalle').getAttribute('data-producto-id');
    const talle = document.getElementById('talle').value;
    const stock = document.getElementById('stock').value;

    if (!talle || !stock || !productoID) {
        alert('Todos los campos son obligatorios');
        return;
    }

    try {
        const response = await fetch('/agregarTalleyStock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ProductoID: productoID,
                Talle: talle,
                Stock: stock,
            }),
        });

        const result = await response.json();

        if (result.result_estado === 'ok') {
            alert('Talle y stock actualizados correctamente');
            $('#modalAgregarTalle').modal('hide');
            cargarTablaProductos(); // Recargar la tabla de productos para reflejar los cambios
        } else {
            alert('Error al actualizar el talle y stock: ' + result.result_message);
        }
    } catch (error) {
        console.error('Error al agregar talle y stock:', error);
    }
}



async function mostrarTallesYStock() {
    const productoID = document.getElementById('modalVerTalles').getAttribute('data-producto-id');
    const tallesYStockContainer = document.getElementById('talles-y-stock');

    if (!productoID) {
        alert('Error al obtener el ID del producto');
        return;
    }

    try {
        const response = await fetch(`/obtenerTallesYStock/${productoID}`, {
            method: 'GET',
        });

        const result = await response.json();

        if (result.result_estado === 'ok') {
            const tallesYStock = result.result_data;

            tallesYStockContainer.innerHTML = '';

            // Mostrar los talles y stock
            if (tallesYStock.length > 0) {
                tallesYStock.forEach((talleYStock) => {
                    const talleYStockHTML = `
                        <div class="mb-2 text-center">
                            <strong>Talle:</strong> ${talleYStock.Talle} - <strong>Stock:</strong> ${talleYStock.Stock}
                        </div>
                    `;
                    tallesYStockContainer.innerHTML += talleYStockHTML;
                });
            } else {
                tallesYStockContainer.innerHTML = '<p style="color: black;">No hay talles disponibles para este producto.</p>';
            }
        } else {
            tallesYStockContainer.innerHTML = `<p>Error: ${result.result_message}</p>`;
        }
    } catch (error) {
        console.error('Error al obtener los talles y stock:', error);
        tallesYStockContainer.innerHTML = '<p>Error al obtener los talles y stock.</p>';
    }
}



function obtenerProductoID() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Devuelve el ID del producto de la URL
}

async function agregarAlCarrito(event) {
    event.preventDefault();

    const productoID = obtenerProductoID(); // Obtiene el ID del producto
    const cantidad = obtenerCantidad(); // Obtiene la cantidad

    // Verificar que se haya seleccionado una talla
    if (!tallaSeleccionada) {
        alert('Por favor, selecciona una talla antes de agregar al carrito.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/agregarCarrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productoID: productoID, 
                cantidad: cantidad, 
                talla: tallaSeleccionada 
            })
        });

        const data = await response.json();
        if (data.result_estado === 'ok') {
            alert('Producto agregado al carrito.');
        } else {
            alert('Error: ' + data.result_message);
        }
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        alert('Error al agregar el producto al carrito. Por favor, inténtalo de nuevo.');
    }
}



async function cargarProductosCarrito() {
    const contenedorCarrito = document.getElementById('contenedorcarrito');
    contenedorCarrito.innerHTML = '';

    try {
        const response = await fetch('/obtenerCarrito'); // Llama a la ruta del carrito

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(producto => {
                const productoHTML = `
                    <div class="card border-0 shadow-lg mb-3 position-relative" style="border-radius: 10px;">
                        <button class="btn-close position-absolute end-0 top-0 m-4" onclick="eliminarProducto(${producto.ID})"></button>
                        <div class="card-body">
                            <div class="d-flex align-items-start border-bottom pb-3">
                                <div class="me-4">
                                    <img src="${producto.ImagenUrl}" class="avatar-lg rounded">
                                </div>
                                <div class="flex-grow-1 align-self-center overflow-hidden">
                                    <div>
                                        <h5 class="text-truncate font-size-18">
                                            <a href="producto.html?id=${producto.ID}" class="text-dark">${producto.Nombre}</a>
                                        </h5>
                                        <p class="mb-0 mt-1" style="color: black;">
                                            Talle: <span class="fw-medium">${producto.Talle}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-4">
                                    <p class="text-muted mb-2">Precio</p>
                                    <h5>
                                        <span class="text-muted me-2">$${producto.Precio}</span>
                                    </h5>
                                </div>
                                <div class="col-md-5">
                                    <p class="text-muted mb-2">Cantidad</p>
                                    <select class="form-select form-select-sm" onchange="actualizarCantidad(${producto.ID}, this.value)">
                                        ${[...Array(8).keys()].map(i => `
                                            <option value="${i + 1}" ${i + 1 === producto.Cantidad ? 'selected' : ''}>${i + 1}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <p class="text-muted mb-2">Total</p>
                                    <h5>$${(producto.Precio * producto.Cantidad).toFixed(2)}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                contenedorCarrito.innerHTML += productoHTML; // Agregar el HTML del producto al contenedor
            });

            // Agregar botones de acción
            contenedorCarrito.innerHTML += `
                <div class="row my-4">
                    <div class="col-sm-6">
                        <a href="index.html" class="btn btn-primary">
                            <i class="bi bi-arrow-left"></i> Seguir Comprando
                        </a>
                    </div>
                    <div class="col-sm-6 text-end">
                        <a href="#" class="btn btn-success">
                            <i class="bi bi-cart"></i> Pagar
                        </a>
                    </div>
                </div>
            `;
        } else {
            contenedorCarrito.innerHTML = '<div class="col-12 text-center">No se encontraron productos en el carrito</div>';
        }
    } catch (error) {
        console.error('Error al cargar productos del carrito:', error);
        contenedorCarrito.innerHTML = `<div class="col-12 text-center">Error al cargar productos del carrito</div>`;
    }
}



async function eliminarProducto(id) {
    try {
        const response = await fetch('/eliminarProducto', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.result_message || 'Error al eliminar el producto');
        }

        if (data.result_estado === 'ok') {
            alert('Producto eliminado correctamente');
            // Recargar la página para reflejar los cambios
            location.reload();
        } else {
            alert(`Error: ${data.result_message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}



document.getElementById('btnAplicarFiltros').addEventListener('click', () => {
    const tipoProducto = document.getElementById('filtroTipoProducto').value;
    const genero = document.querySelector('input[name="filtroGenero"]:checked')?.value || '';
    const marca = document.getElementById('filtroMarca').value;
    const talle = document.getElementById('filtroTalle').value;
    const precioMax = document.getElementById('filtroPrecio').value || 999999;

    const filtros = {
        tipoProducto,
        genero,
        marca,
        talle,
        precioMax
    };

    // Enviar filtros al servidor
    fetch('/filtrarProductos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filtros)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        cargarProductos(data.result_data);  // Mostrar productos filtrados
    })
    .catch(error => {
        console.error('Error al filtrar productos:', error);
    });
});