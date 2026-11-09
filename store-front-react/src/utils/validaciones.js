// Validaciones del formulario de compra (funciones puras).
// Cada función devuelve '' si el valor es válido, o el mensaje de error.

export const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']

export function validarNombre(valor) {
  const texto = valor.trim()
  if (texto === '') return 'Ingresa tu nombre completo.'
  if (texto.length > 100) return 'El nombre no puede superar los 100 caracteres.'
  return ''
}

export function validarCorreo(valor) {
  const texto = valor.trim().toLowerCase()
  if (texto === '') return 'Ingresa tu correo electrónico.'
  if (texto.length > 100) return 'El correo no puede superar los 100 caracteres.'

  const partes = texto.split('@')
  if (partes.length !== 2 || partes[0] === '') return 'Ingresa un correo válido, por ejemplo nombre@gmail.com.'
  if (!DOMINIOS_PERMITIDOS.includes(partes[1])) {
    return 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  }
  return ''
}

export function validarDireccion(valor) {
  const texto = valor.trim()
  if (texto === '') return 'Ingresa tu dirección de despacho.'
  if (texto.length > 300) return 'La dirección no puede superar los 300 caracteres.'
  return ''
}

export function validarComuna(valor) {
  const texto = valor.trim()
  if (texto === '') return 'Ingresa tu comuna.'
  if (texto.length > 100) return 'La comuna no puede superar los 100 caracteres.'
  return ''
}

export function validarPago(valor) {
  if (valor !== 'webpay' && valor !== 'transferencia') return 'Selecciona un método de pago.'
  return ''
}

// Valida todos los campos y devuelve un objeto con los errores (vacío si todo está bien)
export function validarFormularioCompra(datos) {
  const errores = {
    nombre: validarNombre(datos.nombre),
    correo: validarCorreo(datos.correo),
    direccion: validarDireccion(datos.direccion),
    comuna: validarComuna(datos.comuna),
    pago: validarPago(datos.pago),
  }

  return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje !== ''))
}