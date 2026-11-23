// Prueba real a través del Gateway o del proxy /api de Vite.
// Crea solo datos con un sufijo único y elimina únicamente los IDs creados aquí.
// Requiere BASE_URL, ADMIN_EMAIL y ADMIN_PASSWORD en el entorno. No imprime secretos.
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'

const base = process.env.BASE_URL ?? 'http://127.0.0.1:8080'
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
if (!email || !password) throw new Error('Configura ADMIN_EMAIL y ADMIN_PASSWORD para una base de pruebas.')
const suffix = Date.now()
const clientEmail = `admin-check-${suffix}@example.com`
const editedEmail = `admin-edited-${suffix}@example.com`
const testPassword = randomBytes(18).toString('base64url')
let adminToken
const accounts = new Set()
const books = new Set()
const createdProfiles = new Set()
let checks = 0

async function request(path, { method = 'GET', token, body, status = 200 } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body) headers['Content-Type'] = 'application/json'
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15000) })
  const raw = await res.text()
  // Solo se informa el estado; una respuesta de login nunca se vuelca en los logs.
  assert.equal(res.status, status, `${method} ${path}: se esperaba ${status}, recibido ${res.status}`)
  checks++
  console.log(`OK ${method} ${path} → ${status}`)
  return raw ? JSON.parse(raw) : null
}
const login = (email, password) => request('/auth/login', { method: 'POST', body: { email, password } })
try {
  await request('/books', { status: 401 })
  await request('/auth/login', { method: 'POST', body: { email, password: testPassword }, status: 401 })
  const admin = await login(email, password)
  assert.equal(admin.role, 'ADMIN')
  adminToken = admin.token
  const list = await request('/auth/users', { token: adminToken })
  assert.ok(list.every((user) => !('password' in user)))
  const self = list.find((user) => user.email === email)
  assert.ok(self)

  // Reproduce un perfil guardado antes de un timeout de Auth: el alta debe poder reintentarse.
  const initialProfile = await request('/users', { method: 'POST', token: adminToken, status: 201,
    body: { name: 'Perfil anterior', email: clientEmail, phone: '912345678', address: 'Dirección conservada' } })
  createdProfiles.add(initialProfile.id)

  const user = await request('/auth/users', { method: 'POST', token: adminToken, status: 201,
    body: { name: 'Cuenta de prueba', email: clientEmail, password: testPassword, role: 'CLIENT' } })
  accounts.add(user.id)
  assert.equal(user.role, 'CLIENT')
  await request('/auth/users', { method: 'POST', token: adminToken, status: 409,
    body: { name: 'Duplicado', email: clientEmail, password: testPassword, role: 'CLIENT' } })
  await request('/auth/users', { method: 'POST', token: adminToken, status: 400,
    body: { name: 'Rol inválido', email: clientEmail, password: testPassword, role: 'NO_EXISTE' } })
  await request('/auth/users', { method: 'POST', token: adminToken, status: 400,
    body: { name: 'Clave larga', email: clientEmail, password: 'é'.repeat(37), role: 'CLIENT' } })
  const profiles = await request('/users', { token: adminToken })
  assert.ok(profiles.some((profile) => profile.email === clientEmail))
  assert.equal(profiles.filter((profile) => profile.email === clientEmail).length, 1)
  assert.equal(profiles.find((profile) => profile.email === clientEmail).phone, '912345678')
  const client = await login(clientEmail, testPassword)
  await request('/auth/users', { token: client.token, status: 403 })
  await request('/books', { method: 'POST', token: client.token, body: {}, status: 403 })

  const bookData = { title: `Libro de prueba ${suffix}`, author: 'Autora de prueba', price: 12.5, stock: 0 }
  const book = await request('/books', { method: 'POST', token: adminToken, body: bookData, status: 201 })
  books.add(book.id)
  assert.equal((await request(`/books/${book.id}`, { token: adminToken })).stock, 0)
  await request(`/books/${book.id}`, { method: 'PUT', token: adminToken, body: { ...bookData, stock: 5 } })
  await request(`/books/${book.id}`, { method: 'DELETE', token: client.token, status: 403 })
  assert.equal((await request(`/books/${book.id}`, { token: adminToken })).stock, 5)
  await request('/books', { method: 'POST', token: adminToken, body: { ...bookData, price: null, stock: null }, status: 400 })

  await request(`/auth/users/${user.id}`, { method: 'PUT', token: adminToken,
    body: { name: 'Cuenta editada', email: editedEmail, role: 'CLIENT' } })
  await request('/books', { token: client.token, status: 401 })
  assert.equal((await login(editedEmail, testPassword)).role, 'CLIENT')
  const newPassword = randomBytes(18).toString('base64url')
  await request(`/auth/users/${user.id}`, { method: 'PUT', token: adminToken,
    body: { name: 'Cuenta editada', email: editedEmail, password: newPassword, role: 'CLIENT' } })
  await request('/auth/login', { method: 'POST', body: { email: editedEmail, password: testPassword }, status: 401 })
  await login(editedEmail, newPassword)
  const updatedProfiles = await request('/users', { token: adminToken })
  assert.ok(updatedProfiles.some((profile) => profile.email === editedEmail && profile.name === 'Cuenta editada'))

  await request(`/auth/users/${user.id}`, { method: 'PUT', token: adminToken,
    body: { name: 'Cuenta editada', email: editedEmail, role: 'ADMIN' } })
  const promoted = await login(editedEmail, newPassword)
  assert.equal(promoted.role, 'ADMIN')
  await request('/auth/users', { token: promoted.token })
  await request(`/auth/users/${user.id}`, { method: 'PUT', token: adminToken,
    body: { name: 'Cuenta editada', email: editedEmail, role: 'CLIENT' } })
  await request('/auth/users', { token: promoted.token, status: 403 })
  await request(`/books/${book.id}`, { method: 'PUT', token: promoted.token, body: bookData, status: 403 })
  await request(`/auth/users/${self.id}`, { method: 'DELETE', token: adminToken, status: 409 })
  await request(`/auth/users/${self.id}`, { method: 'PUT', token: adminToken,
    body: { name: self.name, email, role: 'CLIENT' }, status: 409 })

  const publicEmail = `public-check-${suffix}@example.com`
  const publicUser = await request('/auth/register', { method: 'POST', status: 201,
    body: { name: 'Registro público', email: publicEmail, password: testPassword, role: 'ADMIN' } })
  accounts.add(publicUser.id)
  assert.equal((await login(publicEmail, testPassword)).role, 'CLIENT')

  await request(`/auth/users/${user.id}`, { method: 'DELETE', token: adminToken, status: 204 })
  accounts.delete(user.id)
  await request(`/auth/users/${user.id}`, { token: adminToken, status: 404 })
  await request('/books', { token: promoted.token, status: 401 })
  assert.ok(!(await request('/users', { token: adminToken })).some((profile) => profile.email === editedEmail))
  await request(`/books/${book.id}`, { method: 'DELETE', token: adminToken, status: 204 })
  books.delete(book.id)
  await request(`/books/${book.id}`, { token: adminToken, status: 404 })
  console.log(`Integración real: ${checks} respuestas verificadas; CRUD, roles, revocación y sincronización correctos.`)
} finally {
  // Incluso si falla una aserción, solo se limpian los recursos de esta ejecución.
  for (const id of books) await request(`/books/${id}`, { method: 'DELETE', token: adminToken, status: 204 })
  for (const id of accounts) await request(`/auth/users/${id}`, { method: 'DELETE', token: adminToken, status: 204 })
  // Un timeout de Auth puede dejar un perfil sin cuenta: limpiar solo los IDs creados aquí.
  if (adminToken && createdProfiles.size) {
    const remaining = await request('/users', { token: adminToken })
    for (const profile of remaining) if (createdProfiles.has(profile.id))
      await request(`/users/${profile.id}`, { method: 'DELETE', token: adminToken, status: 204 })
  }
}
