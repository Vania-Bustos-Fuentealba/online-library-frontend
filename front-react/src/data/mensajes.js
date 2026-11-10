const CLAVE_MENSAJES = 'mensajes'

function leerMensajes() {
  try {
    const guardado = localStorage.getItem(CLAVE_MENSAJES)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

function guardarMensajes(lista) {
  try {
    localStorage.setItem(CLAVE_MENSAJES, JSON.stringify(lista))
  } catch {
    // sin almacenamiento, el mensaje no se persiste
  }
}

// READ: todos
export function obtenerMensajes() {
  return leerMensajes()
}

// CREATE
export function crearMensaje({ nombre, email, comentario }) {
  const lista = leerMensajes()
  const nuevoId = lista.length ? Math.max(...lista.map((m) => m.id)) + 1 : 1

  const nuevo = {
    id: nuevoId,
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    comentario: comentario.trim(),
    fecha: new Date().toISOString()
  }

  lista.push(nuevo)
  guardarMensajes(lista)

  return nuevo
}

// DELETE
export function eliminarMensaje(id) {
  const lista = leerMensajes()
  const filtrada = lista.filter((m) => m.id !== Number(id))

  guardarMensajes(filtrada)

  return filtrada.length < lista.length
}