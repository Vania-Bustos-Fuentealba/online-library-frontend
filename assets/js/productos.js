/* =========================================================
   ARREGLO DE PRODUCTOS
   Fuente única de datos de la tienda.
   ========================================================= */

const PRODUCTOS = [
    {
        id: 1,
        nombre: "Alas de sangre",
        autor: "Rebecca Yarros",
        categoria: "Fantasía",
        precio: 19990,
        stock: 12,
        imagen: "../../assets/img/Alas_de_sangre.webp",
        descripcion: "Violet Sorrengail esperaba una vida tranquila entre libros, pero la general la obliga a ingresar al cuadrante de jinetes de dragones, donde los alumnos débiles no sobreviven al primer año."
    },
    {
        id: 2,
        nombre: "Crimen y castigo",
        autor: "Fiódor Dostoievski",
        categoria: "Clásicos",
        precio: 11990,
        stock: 8,
        imagen: "../../assets/img/crimen_y_castigo.webp",
        descripcion: "Raskólnikov, un estudiante empobrecido de San Petersburgo, comete un asesinato convencido de que ciertos hombres están por encima de la ley. La culpa se convierte en su verdadero castigo."
    },
    {
        id: 3,
        nombre: "El buzón de las impuras",
        autor: "Marcela Serrano",
        categoria: "Narrativa",
        precio: 14990,
        stock: 5,
        imagen: "../../assets/img/El_Buzon_De_Las_Impuras.webp",
        descripcion: "Una novela sobre mujeres que se escriben en secreto, tejiendo una red de confidencias donde la palabra escrita se transforma en refugio y en acto de rebeldía."
    },
    {
        id: 4,
        nombre: "Mientras Yubooh duerme",
        autor: "Autor destacado",
        categoria: "Narrativa",
        precio: 12990,
        stock: 0,
        imagen: "../../assets/img/Mientras_Yubooh_Duerme.webp",
        descripcion: "Una historia íntima sobre el paso del tiempo, la memoria familiar y aquello que decidimos callar para proteger a quienes amamos."
    },
    {
        id: 5,
        nombre: "Una corte de rosas y espinas",
        autor: "Sarah J. Maas",
        categoria: "Fantasía",
        precio: 16990,
        stock: 20,
        imagen: "../../assets/img/una_corte_de_rosas_y_espinas.webp",
        descripcion: "Feyre mata a un lobo en el bosque y es arrastrada a las tierras de las hadas como castigo. Allí descubre que su captor esconde una maldición que amenaza a los dos mundos."
    }
];

/* =========================================================
   UTILIDADES
   ========================================================= */

function formatoPrecio(valor) {
    return "$" + valor.toLocaleString("es-CL");
}

function buscarProducto(id) {
    return PRODUCTOS.find(producto => producto.id === Number(id));
}

/* =========================================================
   TARJETA DE PRODUCTO (HTML reutilizable)
   ========================================================= */

function crearTarjeta(producto) {
    const agotado = producto.stock === 0;

    return `
        <article class="producto">

            <a href="detalle_producto.html?id=${producto.id}" class="producto-imagen">
                <img src="${producto.imagen}" alt="Portada de ${producto.nombre}">
                ${agotado ? '<span class="etiqueta-agotado">Agotado</span>' : ''}
            </a>

            <div class="producto-cuerpo">
                <span class="producto-categoria">${producto.categoria}</span>

                <h3>
                    <a href="detalle_producto.html?id=${producto.id}">${producto.nombre}</a>
                </h3>

                <p class="producto-autor">${producto.autor}</p>
                <p class="producto-precio">${formatoPrecio(producto.precio)}</p>

                <button class="boton boton-agregar"
                        data-id="${producto.id}"
                        ${agotado ? "disabled" : ""}>
                    ${agotado ? "Sin stock" : "Añadir al carrito"}
                </button>
            </div>

        </article>
    `;
}

/* =========================================================
   HOME: PRODUCTOS DESTACADOS (primeros 4)
   ========================================================= */

function renderDestacados() {
    const contenedor = document.getElementById("destacados");
    if (!contenedor) return;

    contenedor.innerHTML = PRODUCTOS
        .slice(0, 4)
        .map(crearTarjeta)
        .join("");
}

/* =========================================================
   CATÁLOGO COMPLETO + FILTRO POR CATEGORÍA
   ========================================================= */

function renderCatalogo(categoria = "todas") {
    const contenedor = document.getElementById("catalogo");
    if (!contenedor) return;

    const lista = categoria === "todas"
        ? PRODUCTOS
        : PRODUCTOS.filter(producto => producto.categoria === categoria);

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <p class="mensaje-vacio">
                No hay libros en esta categoría.
            </p>`;
        return;
    }

    contenedor.innerHTML = lista.map(crearTarjeta).join("");

    const contador = document.getElementById("contador-resultados");
    if (contador) {
        contador.textContent = lista.length === 1
            ? "1 libro encontrado"
            : lista.length + " libros encontrados";
    }
}

function cargarFiltroCategorias() {
    const select = document.getElementById("filtro-categoria");
    if (!select) return;

    // Set elimina las categorías repetidas del arreglo
    const categorias = [...new Set(PRODUCTOS.map(p => p.categoria))];

    categorias.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria;
        opcion.textContent = categoria;
        select.appendChild(opcion);
    });

    select.addEventListener("change", () => renderCatalogo(select.value));
}

/* =========================================================
   DETALLE DEL PRODUCTO (lee el id desde la URL)
   ========================================================= */

function renderDetalle() {
    const contenedor = document.getElementById("detalle");
    if (!contenedor) return;

    const parametros = new URLSearchParams(window.location.search);
    const producto = buscarProducto(parametros.get("id"));

    if (!producto) {
        contenedor.innerHTML = `
            <div class="mensaje-vacio">
                <h2>Producto no encontrado</h2>
                <p>El libro que buscas no existe o fue retirado del catálogo.</p>
                <a class="boton" href="productos.html">Volver al catálogo</a>
            </div>`;
        return;
    }

    document.title = producto.nombre + " - Online Library";

    const rutaMigas = document.getElementById("migas-nombre");
    if (rutaMigas) rutaMigas.textContent = producto.nombre;

    const agotado = producto.stock === 0;

    contenedor.innerHTML = `
        <div class="detalle-imagen">
            <img src="${producto.imagen}" alt="Portada de ${producto.nombre}">
        </div>

        <div class="detalle-info">
            <span class="producto-categoria">${producto.categoria}</span>
            <h2>${producto.nombre}</h2>
            <p class="producto-autor">${producto.autor}</p>

            <p class="detalle-precio">${formatoPrecio(producto.precio)}</p>

            <p class="detalle-descripcion">${producto.descripcion}</p>

            <p class="detalle-stock">
                ${agotado
        ? '<span class="sin-stock">Sin stock disponible</span>'
        : `Stock disponible: <strong>${producto.stock}</strong> unidades`}
            </p>

            <div class="detalle-acciones">
                <label for="cantidad">Cantidad</label>

                <input type="number"
                       id="cantidad"
                       value="1"
                       min="1"
                       max="${producto.stock || 1}"
                       ${agotado ? "disabled" : ""}>

                <button class="boton boton-agregar"
                        data-id="${producto.id}"
                        data-cantidad="input"
                        ${agotado ? "disabled" : ""}>
                    ${agotado ? "Sin stock" : "Añadir al carrito"}
                </button>
            </div>
        </div>
    `;

    renderRelacionados(producto);
}

function renderRelacionados(productoActual) {
    const contenedor = document.getElementById("relacionados");
    if (!contenedor) return;

    const relacionados = PRODUCTOS.filter(
        producto => producto.categoria === productoActual.categoria
            && producto.id !== productoActual.id
    );

    if (relacionados.length === 0) {
        contenedor.closest("section").style.display = "none";
        return;
    }

    contenedor.innerHTML = relacionados.map(crearTarjeta).join("");
}

/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    renderDestacados();
    cargarFiltroCategorias();
    renderCatalogo();
    renderDetalle();
});
/* =========================================================
   EVENT LISTENER GLOBAL PARA BOTONES "AÑADIR AL CARRITO"
   ========================================================= */

document.addEventListener("click", (e) => {
    // Detecta el clic en cualquier botón con la clase "boton-agregar"
    if (e.target && e.target.classList.contains("boton-agregar")) {
        const id = Number(e.target.dataset.id);
        const producto = buscarProducto(id);

        if (!producto || producto.stock === 0) return;

        // Verifica si viene con un input de cantidad (pantalla de detalle)
        let cantidad = 1;
        if (e.target.dataset.cantidad === "input") {
            const inputCantidad = document.getElementById("cantidad");
            cantidad = inputCantidad ? Number(inputCantidad.value) : 1;
        }

        // Llama a la función global del carrito
        if (typeof agregarAlCarrito === "function") {
            agregarAlCarrito(producto, cantidad);
        } else {
            console.error("La función agregarAlCarrito() no está definida en carrito.js");
        }
    }
});