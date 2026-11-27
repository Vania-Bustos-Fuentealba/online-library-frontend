// Funciones puras del carrito: reciben el carrito actual y devuelven uno nuevo.
// No usan React ni el navegador, por eso son fáciles de probar con Jasmine.

// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
export const COSTO_ENVIO = 3990
// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
export const MONTO_ENVIO_GRATIS = 30000

// Cupones disponibles y su porcentaje de descuento sobre el subtotal
// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
export const CUPONES = {
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  DUOC10: 0.1,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  LIBROS5: 0.05,
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function tasaDeCupon(cupon) {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return Object.prototype.hasOwnProperty.call(CUPONES, cupon) ? CUPONES[cupon] : 0
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function agregarItem(carrito, libro, cantidad = 1) {
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!Number.isInteger(cantidad) || cantidad < 1 || !Number.isInteger(libro.stock) || libro.stock <= 0) return carrito
  // Nota de lectura: Define existente, que se utiliza en las instrucciones siguientes.
  const existente = carrito.find((item) => item.id === libro.id)

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (existente) {
    // Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual.
    return carrito.map((item) =>
      // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
      item.id === libro.id
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        ? { ...item, ...libro, cantidad: Math.min(item.cantidad + cantidad, libro.stock) }
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        : item,
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return [
    // Nota de lectura: Aporta el valor ...carrito a la declaración o llamada abierta.
    ...carrito,
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    {
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      id: libro.id,
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      nombre: libro.nombre,
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      autor: libro.autor,
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      precio: libro.precio,
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      imagen: libro.imagen,
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      stock: libro.stock,
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      cantidad: Math.min(cantidad, libro.stock),
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    },
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  ]
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function quitarItem(carrito, id) {
  // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
  return carrito.filter((item) => item.id !== id)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function cambiarCantidad(carrito, id, cantidad) {
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!Number.isInteger(cantidad)) return carrito
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (cantidad <= 0) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return quitarItem(carrito, id)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual.
  return carrito.map((item) =>
    // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
    item.id === id ? { ...item, cantidad: Math.min(cantidad, item.stock) } : item,
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// El almacenamiento del navegador puede contener datos antiguos o incompletos.
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarCarritoGuardado(valor) {
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!Array.isArray(valor)) return []
  // Nota de lectura: Define ids, que se utiliza en las instrucciones siguientes.
  const ids = new Set()
  // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
  return valor.filter((item) => {
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!item || !Number.isSafeInteger(item.id) || item.id < 1 || ids.has(item.id)
      // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
      || typeof item.nombre !== 'string' || !Number.isFinite(item.precio) || item.precio < 0
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      || !Number.isInteger(item.stock) || item.stock < 1
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      || !Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > item.stock) return false
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    ids.add(item.id)
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return true
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function calcularSubtotal(carrito) {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Revisa un código de cupón y devuelve { valido, codigo, mensaje }
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function buscarCupon(texto) {
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  const codigo = texto.trim().toUpperCase()

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (codigo === '') {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return { valido: false, codigo: '', mensaje: 'Escribe un código de cupón.' }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (tasaDeCupon(codigo) === 0) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return { valido: false, codigo: '', mensaje: 'El cupón ingresado no es válido.' }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    valido: true,
    // Nota de lectura: Aporta el valor codigo a la declaración o llamada abierta.
    codigo,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    mensaje: `Cupón ${codigo} aplicado: ${Math.round(tasaDeCupon(codigo) * 100)}% de descuento.`,
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function calcularDescuento(carrito, cupon = '') {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return Math.round(calcularSubtotal(carrito) * tasaDeCupon(cupon))
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Despacho gratis si el subtotal (ya con descuento) llega a $30.000
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function calcularEnvio(carrito, descuento = 0) {
  // Nota de lectura: Define base, que se utiliza en las instrucciones siguientes.
  const base = calcularSubtotal(carrito) - descuento
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return base === 0 || base >= MONTO_ENVIO_GRATIS ? 0 : COSTO_ENVIO
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function calcularTotal(carrito, cupon = '') {
  // Nota de lectura: Define descuento, que se utiliza en las instrucciones siguientes.
  const descuento = calcularDescuento(carrito, cupon)
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return calcularSubtotal(carrito) - descuento + calcularEnvio(carrito, descuento)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function contarUnidades(carrito) {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return carrito.reduce((suma, item) => suma + item.cantidad, 0)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
