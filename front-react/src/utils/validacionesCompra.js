// Validaciones del formulario de compra (funciones puras).
// Cada función devuelve '' si el valor es válido, o el mensaje de error.

// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
export const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarNombre(valor) {
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  const texto = valor.trim()
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (texto === '') return 'Ingresa tu nombre completo.'
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (texto.length > 100) return 'El nombre no puede superar los 100 caracteres.'
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return ''
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarCorreo(valor) {
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  const texto = valor.trim().toLowerCase()
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (texto === '') return 'Ingresa tu correo electrónico.'
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (texto.length > 100) return 'El correo no puede superar los 100 caracteres.'

  // Nota de lectura: Define partes, que se utiliza en las instrucciones siguientes.
  const partes = texto.split('@')
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (partes.length !== 2 || partes[0] === '') return 'Ingresa un correo válido, por ejemplo nombre@gmail.com.'
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!DOMINIOS_PERMITIDOS.includes(partes[1])) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return ''
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarDireccion(valor) {
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  const texto = valor.trim()
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (texto === '') return 'Ingresa tu dirección de despacho.'
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (texto.length > 300) return 'La dirección no puede superar los 300 caracteres.'
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return ''
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarComuna(valor) {
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  const texto = valor.trim()
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (texto === '') return 'Ingresa tu comuna.'
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (texto.length > 100) return 'La comuna no puede superar los 100 caracteres.'
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return ''
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarPago(valor) {
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (valor !== 'webpay' && valor !== 'transferencia') return 'Selecciona un método de pago.'
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return ''
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Valida todos los campos y devuelve un objeto con los errores (vacío si todo está bien)
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarFormularioCompra(datos) {
  // Nota de lectura: Define errores, que se utiliza en las instrucciones siguientes.
  const errores = {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    nombre: validarNombre(datos.nombre),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    correo: validarCorreo(datos.correo),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    direccion: validarDireccion(datos.direccion),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    comuna: validarComuna(datos.comuna),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    pago: validarPago(datos.pago),
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
  return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje !== ''))
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}