// Convierte un número a pesos chilenos: 19990 -> "$19.990"
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function formatearPrecio(monto) {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return '$' + Number(monto).toLocaleString('es-CL')
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}