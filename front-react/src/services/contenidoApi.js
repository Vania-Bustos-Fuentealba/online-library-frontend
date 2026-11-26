import { solicitar } from './api'

// El backend guarda el contenido como texto con párrafos separados por una línea en blanco.
function adaptarPost(post) {
  if (!post || post.id == null || typeof post.title !== 'string' || typeof post.content !== 'string') {
    throw new Error('El servidor devolvió un artículo inválido.')
  }

  return {
    id: post.id,
    titulo: post.title,
    resumen: post.summary ?? '',
    imagen: post.imageUrl ?? '',
    alt: post.imageAlt || post.title,
    contenido: post.content
      .split(/\n{2,}/)
      .map((parrafo) => parrafo.trim())
      .filter(Boolean),
  }
}

// GET /v1/posts (público)
export async function cargarPosts() {
  const datos = await solicitar('/v1/posts', { autenticar: false })

  if (!Array.isArray(datos)) {
    throw new Error('El servidor devolvió una lista de artículos inválida.')
  }

  return datos.map(adaptarPost)
}

// GET /v1/posts/{id} (público)
export async function cargarPost(id) {
  if (!/^\d+$/.test(String(id))) {
    throw new Error('El artículo que buscas no existe.')
  }

  const dato = await solicitar(`/v1/posts/${id}`, { autenticar: false })
  return adaptarPost(dato)
}

// POST /v1/contact (público)
export async function enviarMensajeContacto({ nombre, email, comentario }) {
  return solicitar('/v1/contact', {
    method: 'POST',
    autenticar: false,
    body: {
      name: nombre.trim(),
      email: email.trim().toLowerCase(),
      message: comentario.trim(),
    },
  })
}