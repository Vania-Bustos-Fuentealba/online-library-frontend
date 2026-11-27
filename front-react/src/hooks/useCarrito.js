// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useContext } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { CarritoContext } from '../context/carritoContext'

// Hook para usar el carrito desde cualquier componente
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function useCarrito() {
  // Nota de lectura: Define contexto, que se utiliza en las instrucciones siguientes.
  const contexto = useContext(CarritoContext)

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!contexto) {
    // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
    throw new Error('useCarrito debe usarse dentro de <CarritoProvider>')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return contexto
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}