// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from './api'

// El backend guarda el contenido como texto con párrafos separados por una línea en blanco.
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function adaptarPost(post) {
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!post || post.id == null || typeof post.title !== 'string' || typeof post.content !== 'string') {
    // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
    throw new Error('El servidor devolvió un artículo inválido.')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    id: post.id,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    titulo: post.title,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    resumen: post.summary ?? '',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    imagen: post.imageUrl ?? '',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    alt: post.imageAlt || post.title,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    contenido: post.content
      // Nota de lectura: Encadena la operación split al resultado anterior.
      .split(/\n{2,}/)
      // Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual.
      .map((parrafo) => parrafo.trim())
      // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
      .filter(Boolean),
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// GET /v1/posts (público)
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export async function cargarPosts() {
  // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
  const datos = await solicitar('/v1/posts', { autenticar: false })

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!Array.isArray(datos)) {
    // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
    throw new Error('El servidor devolvió una lista de artículos inválida.')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual.
  return datos.map(adaptarPost)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// GET /v1/posts/{id} (público)
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export async function cargarPost(id) {
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!/^\d+$/.test(String(id))) {
    // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
    throw new Error('El artículo que buscas no existe.')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
  const dato = await solicitar(`/v1/posts/${id}`, { autenticar: false })
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return adaptarPost(dato)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// POST /v1/contact (público)
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export async function enviarMensajeContacto({ nombre, email, comentario }) {
  // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
  return solicitar('/v1/contact', {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    method: 'POST',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    autenticar: false,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: {
      // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
      name: nombre.trim(),
      // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
      email: email.trim().toLowerCase(),
      // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
      message: comentario.trim(),
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    },
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}