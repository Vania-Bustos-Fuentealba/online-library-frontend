// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'

// Umbral que ya utilizaba el listado. El backend no ofrece stock crítico por libro.
// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
export const STOCK_BAJO = 5
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
export const tieneStockBajo = (libro) => libro.stock <= STOCK_BAJO

// Validamos el contrato para no mostrar un cero o una lista vacía ante datos inválidos.
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarLibro(libro) {
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!libro || libro.id == null || typeof libro.title !== 'string' ||
      // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
      typeof libro.author !== 'string' || !Number.isFinite(libro.price) ||
      // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
      libro.price <= 0 || !Number.isInteger(libro.stock) || libro.stock < 0) {
    // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
    throw new Error('El servidor devolvió un libro inválido.')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return libro
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarUsuario(usuario) {
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!usuario || usuario.id == null || typeof usuario.name !== 'string' ||
      // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
      typeof usuario.email !== 'string' || !['ADMIN', 'CLIENT'].includes(usuario.role)) {
    // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
    throw new Error('El servidor devolvió un usuario inválido.')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return usuario
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export async function cargarLibros() {
  // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
  const datos = await solicitar('/books')
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!Array.isArray(datos)) throw new Error('El servidor devolvió una lista de libros inválida.')
  // Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual.
  return datos.map(validarLibro)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export async function cargarUsuarios() {
  // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
  const datos = await solicitar('/auth/users')
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!Array.isArray(datos)) throw new Error('El servidor devolvió una lista de usuarios inválida.')
  // Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual.
  return datos.map(validarUsuario)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
