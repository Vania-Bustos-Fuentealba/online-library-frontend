import { solicitar } from '../services/api'

// Umbral que ya utilizaba el listado. El backend no ofrece stock crítico por libro.
export const STOCK_BAJO = 5
export const tieneStockBajo = (libro) => libro.stock <= STOCK_BAJO

// Validamos el contrato para no mostrar un cero o una lista vacía ante datos inválidos.
export function validarLibro(libro) {
  if (!libro || libro.id == null || typeof libro.title !== 'string' ||
      typeof libro.author !== 'string' || !Number.isFinite(libro.price) ||
      libro.price <= 0 || !Number.isInteger(libro.stock) || libro.stock < 0) {
    throw new Error('El servidor devolvió un libro inválido.')
  }
  return libro
}

export function validarUsuario(usuario) {
  if (!usuario || usuario.id == null || typeof usuario.name !== 'string' ||
      typeof usuario.email !== 'string' || !['ADMIN', 'CLIENT'].includes(usuario.role)) {
    throw new Error('El servidor devolvió un usuario inválido.')
  }
  return usuario
}

export async function cargarLibros() {
  const datos = await solicitar('/books')
  if (!Array.isArray(datos)) throw new Error('El servidor devolvió una lista de libros inválida.')
  return datos.map(validarLibro)
}

export async function cargarUsuarios() {
  const datos = await solicitar('/auth/users')
  if (!Array.isArray(datos)) throw new Error('El servidor devolvió una lista de usuarios inválida.')
  return datos.map(validarUsuario)
}
