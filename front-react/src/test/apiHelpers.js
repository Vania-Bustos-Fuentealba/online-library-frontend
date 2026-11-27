// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { vi } from 'vitest'

// Respuestas simuladas solo en pruebas: ninguna se utiliza en la aplicación.
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function json(data, status = 200) {
  // Nota de lectura: Convierte el objeto JavaScript en texto JSON para enviarlo o persistirlo.
  return new Response(status === 204 ? null : JSON.stringify(data), {
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    status, headers: { 'Content-Type': 'application/json' },
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function mockApi(handler) {
  // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
  const fetch = vi.fn(async (url, options) => handler(url, options))
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  vi.stubGlobal('fetch', fetch)
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return fetch
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function jwt(role = 'ADMIN', extra = {}) {
  // Nota de lectura: Define payload, que se utiliza en las instrucciones siguientes.
  const payload = { sub: 'admin@example.com', role, exp: Math.floor(Date.now() / 1000) + 3600, ...extra }
  // Nota de lectura: Convierte el objeto JavaScript en texto JSON para enviarlo o persistirlo.
  return `e30.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.firma-de-prueba`
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function session(role = 'ADMIN', extra = {}) {
  // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
  localStorage.setItem('token', jwt(role, extra))
  // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
  localStorage.setItem('sesion', JSON.stringify({ email: extra.sub ?? 'admin@example.com', rol: role === 'ADMIN' ? 'admin' : 'cliente' }))
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
export const book = { code: 'LIB-TEST', category: 'Narrativa', description: '', imageUrl: '', criticalStock: 5, id: 7, title: 'Libro real', author: 'Autora real', price: 12.5, stock: 5 }
// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
export const profileDetails = {"run": "123456785", "lastName": "Prueba", "birthDate": "1998-05-12", "region": "Metropolitana de Santiago", "commune": "Santiago", "address": "Calle de prueba 123"}
// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
export const profile = { ...profileDetails, id: 42, name: 'Persona real', email: 'persona@gmail.com', role: 'CLIENT', phone: '912345678' }

// Completa el perfil exigido por la ERS con datos ficticios y un RUN de prueba válido.
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function fillProfile(screen, fireEvent) {
  // Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
  for (const [label, value] of [['RUN (sin puntos ni guion)', profile.run], ['Nombre', profile.name], ['Apellidos', profile.lastName],
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      ['Correo electrónico', profile.email], ['Fecha de nacimiento (opcional)', profile.birthDate], ['Región', profile.region], ['Comuna', profile.commune], ['Dirección', profile.address]])
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
