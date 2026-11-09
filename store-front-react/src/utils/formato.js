// Convierte un número a pesos chilenos: 19990 -> "$19.990"
export function formatearPrecio(monto) {
  return '$' + Number(monto).toLocaleString('es-CL')
}