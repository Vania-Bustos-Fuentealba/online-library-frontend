
const API_URL = 'http://localhost:8080/api'

export class ErrorApi extends Error {
  constructor(mensaje, estado) {
    super(mensaje)
    this.estado = estado
  }
}


async function pedir(ruta, opciones) {
  let respuesta

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, opciones)
  } catch {
    throw new ErrorApi('No se pudo conectar con el servidor. Revisa que el backend esté encendido.', 0)
  }

  if (!respuesta.ok) {
    let mensaje = 'Ocurrió un error inesperado.'

    try {
      const cuerpo = await respuesta.json()
      if (cuerpo.mensaje) mensaje = cuerpo.mensaje
      if (cuerpo.errores) mensaje += ' ' + Object.values(cuerpo.errores).join(' ')
    } catch {
    }

    throw new ErrorApi(mensaje, respuesta.status)
  }

  if (respuesta.status === 204) return null
  return respuesta.json()
}

export function obtenerLibros() {
  return pedir('/libros')
}

export function obtenerLibro(id) {
  return pedir(`/libros/${id}`)
}

export function crearPedido(pedido) {
  return pedir('/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  })
}