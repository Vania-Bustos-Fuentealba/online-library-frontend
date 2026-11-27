// Nota de lectura: Define CLAVE_MENSAJES, que se utiliza en las instrucciones siguientes.
const CLAVE_MENSAJES = 'mensajes'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function leerMensajes() {
  // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
  try {
    // Nota de lectura: Lee el valor persistido bajo esa clave en este navegador.
    const guardado = localStorage.getItem(CLAVE_MENSAJES)
    // Nota de lectura: Interpreta JSON como datos; una respuesta inválida produce un error.
    return guardado ? JSON.parse(guardado) : []
  // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
  } catch {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return []
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function guardarMensajes(lista) {
  // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
  try {
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    localStorage.setItem(CLAVE_MENSAJES, JSON.stringify(lista))
  // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
  } catch {
    // sin almacenamiento, el mensaje no se persiste
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// READ: todos
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function obtenerMensajes() {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return leerMensajes()
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// CREATE
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function crearMensaje({ nombre, email, comentario }) {
  // Nota de lectura: Define lista, que se utiliza en las instrucciones siguientes.
  const lista = leerMensajes()
  // Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual.
  const nuevoId = lista.length ? Math.max(...lista.map((m) => m.id)) + 1 : 1

  // Nota de lectura: Define nuevo, que se utiliza en las instrucciones siguientes.
  const nuevo = {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    id: nuevoId,
    // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
    nombre: nombre.trim(),
    // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
    email: email.trim().toLowerCase(),
    // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
    comentario: comentario.trim(),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    fecha: new Date().toISOString()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  lista.push(nuevo)
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  guardarMensajes(lista)

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return nuevo
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// DELETE
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function eliminarMensaje(id) {
  // Nota de lectura: Define lista, que se utiliza en las instrucciones siguientes.
  const lista = leerMensajes()
  // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
  const filtrada = lista.filter((m) => m.id !== Number(id))

  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  guardarMensajes(filtrada)

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return filtrada.length < lista.length
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}