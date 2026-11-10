// Funciones puras del carrito: reciben el carrito actual y devuelven uno nuevo.
// No usan React ni el navegador, por eso son fáciles de probar con Jasmine.

export const COSTO_ENVIO = 3990
export const MONTO_ENVIO_GRATIS = 30000

// Cupones disponibles y su porcentaje de descuento sobre el subtotal
export const CUPONES = {
  DUOC10: 0.1,
  LIBROS5: 0.05,
}

function tasaDeCupon(cupon) {
  return Object.prototype.hasOwnProperty.call(CUPONES, cupon) ? CUPONES[cupon] : 0
}

export function agregarItem(carrito, libro, cantidad = 1) {
  const existente = carrito.find((item) => item.id === libro.id)

  if (existente) {
    return carrito.map((item) =>
      item.id === libro.id
        ? { ...item, cantidad: Math.min(item.cantidad + cantidad, item.stock) }
        : item,
    )
  }

  return [
    ...carrito,
    {
      id: libro.id,
      nombre: libro.nombre,
      autor: libro.autor,
      precio: libro.precio,
      imagen: libro.imagen,
      stock: libro.stock,
      cantidad: Math.min(cantidad, libro.stock),
    },
  ]
}

export function quitarItem(carrito, id) {
  return carrito.filter((item) => item.id !== id)
}

export function cambiarCantidad(carrito, id, cantidad) {
  if (cantidad <= 0) {
    return quitarItem(carrito, id)
  }

  return carrito.map((item) =>
    item.id === id ? { ...item, cantidad: Math.min(cantidad, item.stock) } : item,
  )
}

export function calcularSubtotal(carrito) {
  return carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
}

// Revisa un código de cupón y devuelve { valido, codigo, mensaje }
export function buscarCupon(texto) {
  const codigo = texto.trim().toUpperCase()

  if (codigo === '') {
    return { valido: false, codigo: '', mensaje: 'Escribe un código de cupón.' }
  }

  if (tasaDeCupon(codigo) === 0) {
    return { valido: false, codigo: '', mensaje: 'El cupón ingresado no es válido.' }
  }

  return {
    valido: true,
    codigo,
    mensaje: `Cupón ${codigo} aplicado: ${Math.round(tasaDeCupon(codigo) * 100)}% de descuento.`,
  }
}

export function calcularDescuento(carrito, cupon = '') {
  return Math.round(calcularSubtotal(carrito) * tasaDeCupon(cupon))
}

// Despacho gratis si el subtotal (ya con descuento) llega a $30.000
export function calcularEnvio(carrito, descuento = 0) {
  const base = calcularSubtotal(carrito) - descuento
  return base === 0 || base >= MONTO_ENVIO_GRATIS ? 0 : COSTO_ENVIO
}

export function calcularTotal(carrito, cupon = '') {
  const descuento = calcularDescuento(carrito, cupon)
  return calcularSubtotal(carrito) - descuento + calcularEnvio(carrito, descuento)
}

export function contarUnidades(carrito) {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0)
}