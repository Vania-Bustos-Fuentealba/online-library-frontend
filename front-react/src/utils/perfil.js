// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { validarRun, validarEmail, validarPassword } from './validaciones'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { regiones } from '../data/regiones'

// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
export const perfilVacio = { name: '', lastName: '', run: '', email: '', birthDate: '', region: '', commune: '', address: '' }
// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
export const nombresRoles = { ADMIN: 'Administrador', CLIENT: 'Cliente', SELLER: 'Vendedor' }
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarPerfil(datos, cuentaPrincipal = false) {
  // Nota de lectura: Define errores, que se utiliza en las instrucciones siguientes.
  const errores = {}
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  if (!datos.name.trim() || datos.name.trim().length > 50) errores.name = 'Ingresa un nombre de hasta 50 caracteres.'
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  if (!datos.lastName.trim() || datos.lastName.trim().length > 100) errores.lastName = 'Ingresa apellidos de hasta 100 caracteres.'
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!validarRun(datos.run)) errores.run = 'Ingresa un RUN válido, sin puntos ni guion (7 a 9 caracteres).'
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (datos.email.length > 100 || (!validarEmail(datos.email) && !(cuentaPrincipal && datos.email === 'admin@library.cl'))) errores.email = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!regiones[datos.region]) errores.region = 'Selecciona una región.'
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!regiones[datos.region]?.includes(datos.commune)) errores.commune = 'Selecciona una comuna de la región.'
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  if (!datos.address.trim() || datos.address.trim().length > 300) errores.address = 'Ingresa una dirección de hasta 300 caracteres.'
  // Nota de lectura: Define fecha, que se utiliza en las instrucciones siguientes.
  const fecha = datos.birthDate ? new Date(datos.birthDate + 'T00:00:00') : null
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (fecha && (!Number.isFinite(fecha.getTime()) || fecha > new Date())) errores.birthDate = 'La fecha de nacimiento no puede ser futura.'
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return errores
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function datosPerfil(datos) {
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  return { name: datos.name.trim(), lastName: datos.lastName.trim(), run: datos.run.toUpperCase(),
    // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
    email: datos.email.trim().toLowerCase(), birthDate: datos.birthDate || null,
    // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
    region: datos.region, commune: datos.commune, address: datos.address.trim() }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function errorPassword(password, confirm, obligatorio) {
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if ((obligatorio || password) && !validarPassword(password)) return 'La contraseña debe tener entre 4 y 10 caracteres.'
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (password !== confirm) return 'Las contraseñas deben coincidir.'
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return ''
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
