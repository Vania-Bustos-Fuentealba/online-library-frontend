/* =========================================================
   CARRITO DE COMPRAS
   Reglas de negocio:
   - Solo se guardan {id, cantidad} en localStorage.
   - Cantidad mínima: 1. Máxima: el stock del producto.
   - No se puede agregar un producto sin stock.
   - Despacho gratis sobre $30.000, si no, $3.990.
   - Cupón DUOC10 = 10% de descuento sobre el subtotal.
   ========================================================= */


   const CLAVE_CARRITO       = "carrito";
   const CLAVE_CUPON         = "cupon";
   const COSTO_DESPACHO      = 3990;
   const MONTO_ENVIO_GRATIS = 30000;
   
   const CUPONES = {
       "DUOC10": 0.10,
       "LIBROS5": 0.05
   };
   
   /* ---------- Persistencia ---------- */
   
   function obtenerCarrito() {
       try {
           return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
       } catch (error) {
           console.error("Carrito corrupto en localStorage:", error);
           return [];
       }
   }
   
   function guardarCarrito(carrito) {
       localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
       actualizarContador();
   }
   
   /* ---------- Formateador de Moneda Chilena ---------- */
   
   function formatoPrecio(monto) {
       return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto);
   }
   
   /* ---------- Mensajes personalizados ---------- */
   
   function mostrarAviso(mensaje, tipo = "exito") {
       let aviso = document.getElementById("aviso");
   
       if (!aviso) {
           aviso = document.createElement("div");
           aviso.id = "aviso";
           document.body.appendChild(aviso);
       }
   
       aviso.textContent = mensaje;
       aviso.className = "aviso aviso-" + tipo + " visible";
   
       clearTimeout(aviso.temporizador);
       aviso.temporizador = setTimeout(() => {
           aviso.classList.remove("visible");
       }, 2800);
   }
   
   /* ---------- Contador del menú ---------- */
   
   function actualizarContador() {
       const contador = document.getElementById("contador-carrito");
       if (!contador) return;
   
       const total = obtenerCarrito().reduce((suma, item) => suma + item.cantidad, 0);
       contador.textContent = total;
   }
   
   /* ---------- Agregar ---------- */
   
   function agregarAlCarrito(id, cantidad = 1) {
       const idNumerico = Number(id);
       const producto = typeof buscarProducto === "function" ? buscarProducto(idNumerico) : null;
   
       if (!producto) {
           mostrarAviso("El producto no existe.", "error");
           return;
       }
   
       if (producto.stock === 0) {
           mostrarAviso("Este libro no tiene stock disponible.", "error");
           return;
       }
   
       const carrito = obtenerCarrito();
       const existente = carrito.find(item => Number(item.id) === idNumerico);
       const cantidadActual = existente ? existente.cantidad : 0;
   
       if (cantidadActual + cantidad > producto.stock) {
           mostrarAviso(`Solo quedan ${producto.stock} unidades de "${producto.titulo || producto.nombre}".`, "error");
           return;
       }
   
       if (existente) {
           existente.cantidad += cantidad;
       } else {
           carrito.push({ id: idNumerico, cantidad: cantidad });
       }
   
       guardarCarrito(carrito);
       mostrarAviso(`"${producto.titulo || producto.nombre}" se añadió al carrito.`);
   }
   
   /* ---------- Modificar ---------- */
   
   function cambiarCantidad(id, nuevaCantidad) {
       const idNumerico = Number(id);
       const producto = buscarProducto(idNumerico);
       const carrito  = obtenerCarrito();
       const item     = carrito.find(item => Number(item.id) === idNumerico);
   
       if (!item || !producto) return;
   
       nuevaCantidad = parseInt(nuevaCantidad, 10);
   
       if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
           mostrarAviso("La cantidad mínima es 1.", "error");
           renderCarrito();
           return;
       }
   
       if (nuevaCantidad > producto.stock) {
           mostrarAviso(`Solo hay ${producto.stock} unidades disponibles.`, "error");
           nuevaCantidad = producto.stock;
       }
   
       item.cantidad = nuevaCantidad;
       guardarCarrito(carrito);
       renderCarrito();
   }
   
   function eliminarDelCarrito(id) {
       const idNumerico = Number(id);
       const carrito = obtenerCarrito().filter(item => Number(item.id) !== idNumerico);
       guardarCarrito(carrito);
       renderCarrito();
       mostrarAviso("Libro eliminado del carrito.");
   }
   
   function vaciarCarrito() {
       localStorage.removeItem(CLAVE_CARRITO);
       localStorage.removeItem(CLAVE_CUPON);
       actualizarContador();
       renderCarrito();
   }
   
   /* ---------- Cálculos ---------- */
   
   function calcularTotales() {
       const carrito = obtenerCarrito();
   
       const subtotal = carrito.reduce((suma, item) => {
           const producto = buscarProducto(Number(item.id));
           return producto ? suma + producto.precio * item.cantidad : suma;
       }, 0);
   
       const cupon     = localStorage.getItem(CLAVE_CUPON);
       const tasa      = CUPONES[cupon] || 0;
       const descuento = Math.round(subtotal * tasa);
   
       const base  = subtotal - descuento;
       const envio = (base === 0 || base >= MONTO_ENVIO_GRATIS) ? 0 : COSTO_DESPACHO;
   
       return {
           subtotal: subtotal,
           descuento: descuento,
           envio: envio,
           total: base + envio,
           cupon: cupon
       };
   }
   
   function aplicarCupon() {
       const campo = document.getElementById("cupon");
       if (!campo) return;
   
       const codigo = campo.value.trim().toUpperCase();
   
       if (codigo === "") {
           mostrarAviso("Escribe un código de cupón.", "error");
           return;
       }
   
       if (!CUPONES[codigo]) {
           mostrarAviso("El cupón ingresado no es válido.", "error");
           return;
       }
   
       localStorage.setItem(CLAVE_CUPON, codigo);
       mostrarAviso(`Cupón ${codigo} aplicado: ${CUPONES[codigo] * 100}% de descuento.`);
       renderCarrito();
   }
   
   /* ---------- Render de la vista carrito ---------- */
   
   function renderCarrito() {
       const contenedor = document.getElementById("lista-carrito");
       if (!contenedor) return;
   
       const carrito = obtenerCarrito();
       const resumen = document.getElementById("resumen-carrito");
   
       if (carrito.length === 0) {
           contenedor.innerHTML = `
               <div class="mensaje-vacio">
                   <h3>Tu carrito está vacío 🛒</h3>
                   <p>Todavía no has añadido ningún libro.</p>
                   <a class="boton" href="productos.html">Ver catálogo</a>
               </div>`;
   
           if (resumen) resumen.style.display = "none";
           actualizarContador();
           return;
       }
   
       if (resumen) resumen.style.display = "block";
   
       contenedor.innerHTML = carrito.map(item => {
           const producto = buscarProducto(Number(item.id));
           if (!producto) return "";
   
           const subtotalItem = producto.precio * item.cantidad;
           const tituloLibro = producto.titulo || producto.nombre;
   
           return `
               <article class="item-carrito">
   
                   <div class="item-imagen">
                       <img src="${producto.imagen}" alt="${tituloLibro}">
                   </div>
   
                   <div class="item-info">
                       <h3>${tituloLibro}</h3>
                       <p>${producto.autor || ''}</p>
                       <p class="precio">${formatoPrecio(producto.precio)} c/u</p>
                   </div>
   
                   <div class="item-cantidad">
                       <label for="cantidad-${producto.id}">Cantidad</label>
                       <input type="number"
                              id="cantidad-${producto.id}"
                              value="${item.cantidad}"
                              min="1"
                              max="${producto.stock}"
                              onchange="cambiarCantidad(${producto.id}, this.value)">
                   </div>
   
                   <p class="item-subtotal"><strong>${formatoPrecio(subtotalItem)}</strong></p>
   
                   <button class="btn-eliminar"
                           onclick="eliminarDelCarrito(${producto.id})"
                           aria-label="Eliminar ${tituloLibro}">
                       Eliminar
                   </button>
   
               </article>
           `;
       }).join("");
   
       const totales = calcularTotales();
   
       if (document.getElementById("subtotal")) document.getElementById("subtotal").textContent = formatoPrecio(totales.subtotal);
       if (document.getElementById("envio")) document.getElementById("envio").textContent = totales.envio === 0 ? "Gratis" : formatoPrecio(totales.envio);
       if (document.getElementById("total")) document.getElementById("total").textContent = formatoPrecio(totales.total);
   
       const lineaDescuento = document.getElementById("linea-descuento");
       if (lineaDescuento) {
           if (totales.descuento > 0) {
               lineaDescuento.style.display = "flex";
               if (document.getElementById("descuento")) {
                   document.getElementById("descuento").textContent = "- " + formatoPrecio(totales.descuento);
               }
           } else {
               lineaDescuento.style.display = "none";
           }
       }
   
       actualizarContador();
   }
   
   /* ---------- Compra ---------- */
   
   function finalizarCompra() {
       const carrito = obtenerCarrito();
   
       if (carrito.length === 0) {
           mostrarAviso("Tu carrito está vacío.", "error");
           return;
       }
   
       window.location.href = "checkout.html";
   }
   
   /* ---------- Delegación de eventos y Carga Inicial ---------- */
   
   document.addEventListener("click", evento => {
       const boton = evento.target.closest(".boton-agregar");
       if (!boton) return;
   
       let cantidad = 1;
   
       if (boton.dataset.cantidad === "input") {
           const campo = document.getElementById("cantidad");
           cantidad = campo ? parseInt(campo.value, 10) : 1;
           if (isNaN(cantidad) || cantidad < 1) cantidad = 1;
       }
   
       agregarAlCarrito(boton.dataset.id, cantidad);
   });
   
   document.addEventListener("DOMContentLoaded", () => {
       renderCarrito();
       actualizarContador();
   });