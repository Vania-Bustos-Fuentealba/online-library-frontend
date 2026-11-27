// Prueba real a través del Gateway o del proxy /api de Vite.
// Crea solo datos con un sufijo único y elimina únicamente los IDs creados aquí.
// Requiere BASE_URL, ADMIN_EMAIL y ADMIN_PASSWORD en el entorno. No imprime secretos.
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import assert from 'node:assert/strict'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { randomBytes } from 'node:crypto'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { testProfile } from './ers-fixtures.mjs'

// Nota de lectura: Define base, que se utiliza en las instrucciones siguientes.
const base = process.env.BASE_URL ?? 'http://127.0.0.1:8080'
// Nota de lectura: Define email, que se utiliza en las instrucciones siguientes.
const email = process.env.ADMIN_EMAIL
// Nota de lectura: Define password, que se utiliza en las instrucciones siguientes.
const password = process.env.ADMIN_PASSWORD
// Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
if (!email || !password) throw new Error('Configura ADMIN_EMAIL y ADMIN_PASSWORD para una base de pruebas.')
// Nota de lectura: Define suffix, que se utiliza en las instrucciones siguientes.
const suffix = Date.now()
// Nota de lectura: Define profileData, que se utiliza en las instrucciones siguientes.
const profileData = testProfile(suffix)
// Nota de lectura: Define publicData, que se utiliza en las instrucciones siguientes.
const publicData = testProfile(suffix + 1)
// Nota de lectura: Define clientEmail, que se utiliza en las instrucciones siguientes.
const clientEmail = `admin-check-${suffix}@gmail.com`
// Nota de lectura: Define editedEmail, que se utiliza en las instrucciones siguientes.
const editedEmail = `admin-edited-${suffix}@gmail.com`
// Nota de lectura: Define testPassword, que se utiliza en las instrucciones siguientes.
const testPassword = randomBytes(6).toString('base64url')
// Nota de lectura: Define adminToken, que se utiliza en las instrucciones siguientes.
let adminToken
// Nota de lectura: Define accounts, que se utiliza en las instrucciones siguientes.
const accounts = new Set()
// Nota de lectura: Define books, que se utiliza en las instrucciones siguientes.
const books = new Set()
// Nota de lectura: Define createdProfiles, que se utiliza en las instrucciones siguientes.
const createdProfiles = new Set()
// Nota de lectura: Define checks, que se utiliza en las instrucciones siguientes.
let checks = 0

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
async function request(path, { method = 'GET', token, body, status = 200 } = {}) {
  // Nota de lectura: Define headers, que se utiliza en las instrucciones siguientes.
  const headers = {}
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (token) headers.Authorization = `Bearer ${token}`
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (body) headers['Content-Type'] = 'application/json'
  // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15000) })
  // Nota de lectura: Define raw, que se utiliza en las instrucciones siguientes.
  const raw = await res.text()
  // Solo se informa el estado; una respuesta de login nunca se vuelca en los logs.
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal(res.status, status, `${method} ${path}: se esperaba ${status}, recibido ${res.status}`)
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  checks++
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  console.log(`OK ${method} ${path} → ${status}`)
  // Nota de lectura: Interpreta JSON como datos; una respuesta inválida produce un error.
  return raw ? JSON.parse(raw) : null
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define login, que se utiliza en las instrucciones siguientes.
const login = (email, password) => request('/auth/login', { method: 'POST', body: { email, password } })
// Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
try {
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/books') // El catálogo integrado es público.
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/users', { status: 401 })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/login', { method: 'POST', body: { email, password: testPassword }, status: 401 })
  // Nota de lectura: Define admin, que se utiliza en las instrucciones siguientes.
  const admin = await login(email, password)
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal(admin.role, 'ADMIN')
  // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
  adminToken = admin.token
  // Nota de lectura: Define list, que se utiliza en las instrucciones siguientes.
  const list = await request('/auth/users', { token: adminToken })
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.ok(list.every((user) => !('password' in user)))
  // Nota de lectura: Define self, que se utiliza en las instrucciones siguientes.
  const self = list.find((user) => user.email === email)
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.ok(self)

  // Reproduce un perfil guardado antes de un timeout de Auth: el alta debe poder reintentarse.
  // Nota de lectura: Define initialProfile, que se utiliza en las instrucciones siguientes.
  const initialProfile = await request('/users', { method: 'POST', token: adminToken, status: 201,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { name: 'Perfil anterior', email: clientEmail, phone: '912345678', address: 'Dirección conservada' } })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  createdProfiles.add(initialProfile.id)

  // Nota de lectura: Define user, que se utiliza en las instrucciones siguientes.
  const user = await request('/auth/users', { method: 'POST', token: adminToken, status: 201,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { ...profileData, name: 'Cuenta de prueba', email: clientEmail, password: testPassword, role: 'CLIENT' } })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  accounts.add(user.id)
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal(user.role, 'CLIENT')
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/users', { method: 'POST', token: adminToken, status: 409,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { ...profileData, name: 'Duplicado', email: clientEmail, password: testPassword, role: 'CLIENT' } })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/users', { method: 'POST', token: adminToken, status: 400,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { ...profileData, name: 'Rol inválido', email: clientEmail, password: testPassword, role: 'NO_EXISTE' } })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/users', { method: 'POST', token: adminToken, status: 400,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { ...profileData, name: 'Clave larga', email: clientEmail, password: 'é'.repeat(37), role: 'CLIENT' } })
  // Nota de lectura: Define profiles, que se utiliza en las instrucciones siguientes.
  const profiles = await request('/users', { token: adminToken })
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.ok(profiles.some((profile) => profile.email === clientEmail))
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal(profiles.filter((profile) => profile.email === clientEmail).length, 1)
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal(profiles.find((profile) => profile.email === clientEmail).phone, '912345678')
  // Nota de lectura: Define client, que se utiliza en las instrucciones siguientes.
  const client = await login(clientEmail, testPassword)
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/users', { token: client.token, status: 403 })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/books', { method: 'POST', token: client.token, body: {}, status: 403 })

  // Nota de lectura: Define bookData, que se utiliza en las instrucciones siguientes.
  const bookData = { code: `ADMIN-${suffix}`, category: 'Narrativa', criticalStock: 2, description: 'Prueba de administración', imageUrl: '/books/Alas_de_sangre.webp', title: `Libro de prueba ${suffix}`, author: 'Autora de prueba', price: 12.5, stock: 0 }
  // Nota de lectura: Define book, que se utiliza en las instrucciones siguientes.
  const book = await request('/books', { method: 'POST', token: adminToken, body: bookData, status: 201 })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  books.add(book.id)
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal((await request(`/books/${book.id}`, { token: adminToken })).stock, 0)
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/books/${book.id}`, { method: 'PUT', token: adminToken, body: { ...bookData, stock: 5 } })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/books/${book.id}`, { method: 'DELETE', token: client.token, status: 403 })
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal((await request(`/books/${book.id}`, { token: adminToken })).stock, 5)
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/books', { method: 'POST', token: adminToken, body: { ...bookData, price: null, stock: null }, status: 400 })

  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/auth/users/${user.id}`, { method: 'PUT', token: adminToken,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { ...profileData, name: 'Cuenta editada', email: editedEmail, role: 'CLIENT' } })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/users', { token: client.token, status: 401 })
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal((await login(editedEmail, testPassword)).role, 'CLIENT')
  // Nota de lectura: Define newPassword, que se utiliza en las instrucciones siguientes.
  const newPassword = randomBytes(6).toString('base64url')
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/auth/users/${user.id}`, { method: 'PUT', token: adminToken,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { ...profileData, name: 'Cuenta editada', email: editedEmail, password: newPassword, role: 'CLIENT' } })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/login', { method: 'POST', body: { email: editedEmail, password: testPassword }, status: 401 })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await login(editedEmail, newPassword)
  // Nota de lectura: Define updatedProfiles, que se utiliza en las instrucciones siguientes.
  const updatedProfiles = await request('/users', { token: adminToken })
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.ok(updatedProfiles.some((profile) => profile.email === editedEmail && profile.name === 'Cuenta editada'))

  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/auth/users/${user.id}`, { method: 'PUT', token: adminToken,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { ...profileData, name: 'Cuenta editada', email: editedEmail, role: 'ADMIN' } })
  // Nota de lectura: Define promoted, que se utiliza en las instrucciones siguientes.
  const promoted = await login(editedEmail, newPassword)
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal(promoted.role, 'ADMIN')
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/users', { token: promoted.token })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/auth/users/${user.id}`, { method: 'PUT', token: adminToken,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { ...profileData, name: 'Cuenta editada', email: editedEmail, role: 'CLIENT' } })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/users', { token: promoted.token, status: 403 })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/books/${book.id}`, { method: 'PUT', token: promoted.token, body: bookData, status: 403 })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/auth/users/${self.id}`, { method: 'DELETE', token: adminToken, status: 409 })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/auth/users/${self.id}`, { method: 'PUT', token: adminToken,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { ...profileData, name: self.name, email, role: 'CLIENT' }, status: 409 })

  // Nota de lectura: Define publicEmail, que se utiliza en las instrucciones siguientes.
  const publicEmail = `public-check-${suffix}@gmail.com`
  // Nota de lectura: Define publicUser, que se utiliza en las instrucciones siguientes.
  const publicUser = await request('/auth/register', { method: 'POST', status: 201,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { ...publicData, name: 'Registro público', email: publicEmail, password: testPassword, role: 'ADMIN' } })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  accounts.add(publicUser.id)
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal((await login(publicEmail, testPassword)).role, 'CLIENT')

  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/auth/users/${user.id}`, { method: 'DELETE', token: adminToken, status: 204 })
  // Nota de lectura: Consulta o modifica los registros mediante el repositorio de persistencia.
  accounts.delete(user.id)
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/auth/users/${user.id}`, { token: adminToken, status: 404 })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request('/auth/users', { token: promoted.token, status: 401 })
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.ok(!(await request('/users', { token: adminToken })).some((profile) => profile.email === editedEmail))
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/books/${book.id}`, { method: 'DELETE', token: adminToken, status: 204 })
  // Nota de lectura: Consulta o modifica los registros mediante el repositorio de persistencia.
  books.delete(book.id)
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await request(`/books/${book.id}`, { token: adminToken, status: 404 })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  console.log(`Integración real: ${checks} respuestas verificadas; CRUD, roles, revocación y sincronización correctos.`)
// Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
} finally {
  // Incluso si falla una aserción, solo se limpian los recursos de esta ejecución.
  // Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
  for (const id of books) await request(`/books/${id}`, { method: 'DELETE', token: adminToken, status: 204 })
  // Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
  for (const id of accounts) await request(`/auth/users/${id}`, { method: 'DELETE', token: adminToken, status: 204 })
  // Un timeout de Auth puede dejar un perfil sin cuenta: limpiar solo los IDs creados aquí.
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (adminToken && createdProfiles.size) {
    // Nota de lectura: Define remaining, que se utiliza en las instrucciones siguientes.
    const remaining = await request('/users', { token: adminToken })
    // Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
    for (const profile of remaining) if (createdProfiles.has(profile.id))
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      await request(`/users/${profile.id}`, { method: 'DELETE', token: adminToken, status: 204 })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
