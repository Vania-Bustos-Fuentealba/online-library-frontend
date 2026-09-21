/* =========================================================
   CHECKOUT
   Validación en tiempo real + resumen del pedido
   ========================================================= */

const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

/* ---------- Reglas de validación por campo ---------- */

function validarNombre(valor) {
    if (valor.trim() === "") return "El nombre es obligatorio.";
    if (valor.length > 100) return "Máximo 100 caracteres.";
    return "";
}

function validarCorreo(valor) {
    if (valor.trim() === "") return "El correo es obligatorio.";
    if (valor.length > 100) return "Máximo 100 caracteres.";

    const partes = valor.split("@");
    const dominio = partes.length === 2 ? partes[1].toLowerCase() : "";

    if (!/^\S+@\S+\.\S+$/.test(valor) || !DOMINIOS_PERMITIDOS.includes(dominio)) {
        return "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }
    return "";
}

function validarDireccion(valor) {
    if (valor.trim() === "") return "La dirección es obligatoria.";
    if (valor.length > 300) return "Máximo 300 caracteres.";
    return "";
}

function validarComuna(valor) {
    if (valor.trim() === "") return "La comuna es obligatoria.";
    return "";
}

function validarMetodoPago(valor) {
    if (valor === "") return "Selecciona un método de pago.";
    return "";
}

const REGLAS = {
    nombre: validarNombre,
    correo: validarCorreo,
    direccion: validarDireccion,
    comuna: validarComuna,
    "metodo-pago": validarMetodoPago
};

/* ---------- Mostrar/ocultar error de un campo ---------- */

function mostrarErrorCampo(idCampo, mensaje) {
    const spanError = document.getElementById("error-" + idCampo);
    const input = document.getElementById(idCampo);
    if (!spanError || !input) return;

    spanError.textContent = mensaje;
    input.classList.toggle("campo-invalido", mensaje !== "");
}

function validarCampo(idCampo) {
    const input = document.getElementById(idCampo);
    if (!input) return true;

    const mensaje = REGLAS[idCampo](input.value);
    mostrarErrorCampo(idCampo, mensaje);
    return mensaje === "";
}

/* ---------- Resumen del pedido ---------- */

function renderResumenCheckout() {
    const contenedor = document.getElementById("items-resumen");
    const totalEl = document.getElementById("total-checkout");
    if (!contenedor || !totalEl) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalEl.textContent = formatoPrecio(0);
        return;
    }

    contenedor.innerHTML = carrito.map(item => {
        const producto = buscarProducto(item.id);
        if (!producto) return "";
        return `
            <div class="linea-resumen">
                <span>${producto.nombre} x${item.cantidad}</span>
                <span>${formatoPrecio(producto.precio * item.cantidad)}</span>
            </div>`;
    }).join("");

    totalEl.textContent = formatoPrecio(calcularTotales().total);
}

/* ---------- Envío del formulario ---------- */

function inicializarCheckout() {
    const form = document.getElementById("form-checkout");
    if (!form) return;

    renderResumenCheckout();

    if (obtenerCarrito().length === 0) {
        mostrarAviso("Tu carrito está vacío, agrega libros antes de pagar.", "error");
    }

    // Valida cada campo mientras el usuario escribe (validación en tiempo real)
    Object.keys(REGLAS).forEach(idCampo => {
        const input = document.getElementById(idCampo);
        if (input) {
            input.addEventListener("input", () => validarCampo(idCampo));
            input.addEventListener("change", () => validarCampo(idCampo));
        }
    });

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (obtenerCarrito().length === 0) {
            mostrarAviso("No puedes pagar con el carrito vacío.", "error");
            return;
        }

        const camposValidos = Object.keys(REGLAS)
            .map(validarCampo)
            .every(esValido => esValido);

        if (!camposValidos) {
            mostrarAviso("Revisa los campos marcados en rojo.", "error");
            return;
        }

        // Simula la confirmación del pedido
        mostrarAviso("¡Pedido confirmado! Gracias por tu compra.");
        vaciarCarrito();
        form.reset();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    });
}

document.addEventListener("DOMContentLoaded", inicializarCheckout);