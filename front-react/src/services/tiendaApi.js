// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from './api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { validarLibro } from '../admin/adminApi'

// Nota de lectura: Define SIN_PORTADA, que se utiliza en las instrucciones siguientes.
const SIN_PORTADA =
    // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
    'data:image/svg+xml;charset=UTF-8,' +
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg"
         width="300" height="420" viewBox="0 0 300 420">
      <rect width="300" height="420" fill="#eee5f2"/>
      <text x="150" y="210"
            text-anchor="middle"
            font-family="Arial"
            font-size="22"
            fill="#51245f">
        Sin portada
      </text>
    </svg>
  `)


// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function adaptarLibro(dato) {
  // Nota de lectura: Define libro, que se utiliza en las instrucciones siguientes.
  const libro = validarLibro(dato)
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return { id: libro.id, nombre: libro.title, autor: libro.author, precio: libro.price,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stock: libro.stock, stockCritico: 5, categoria: '', descripcion: '', imagen: SIN_PORTADA }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export async function obtenerLibros() {
  // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
  const datos = await solicitar('/books', { autenticar: false })
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!Array.isArray(datos)) throw new Error('El servidor no devolvió una lista de libros válida.')
  // Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual.
  return datos.map(adaptarLibro)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export async function obtenerLibro(id) {
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!/^\d+$/.test(String(id))) throw new Error('No se encontró el libro.')
  // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
  return adaptarLibro(await solicitar(`/books/${id}`, { autenticar: false }))
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export async function crearPedido(datos, clave) {
  // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
  const pedido = await solicitar('/pedidos', { method: 'POST', body: datos,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    headers: { 'Idempotency-Key': clave } })
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!pedido || pedido.id == null || !Number.isFinite(pedido.total) || pedido.estado !== 'PENDIENTE_PAGO') {
    // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
    throw new Error('No se pudo confirmar la respuesta del pedido. Reintenta para consultar el mismo intento.')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return pedido
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
