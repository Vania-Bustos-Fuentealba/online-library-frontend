// Ejecutar solo contra una base de pruebas: los pedidos conservan su historial.
// Recorre APIs reales de administración, tienda y contenido por el mismo Gateway.
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import assert from 'node:assert/strict'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { randomUUID, randomBytes } from 'node:crypto'

// Nota de lectura: Define base, que se utiliza en las instrucciones siguientes.
const base = process.env.BASE_URL || 'http://127.0.0.1:8080'
// Nota de lectura: Define password, que se utiliza en las instrucciones siguientes.
const password = process.env.ADMIN_PASSWORD
// Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
if (!password) throw new Error('Configura ADMIN_PASSWORD para la base de pruebas.')
// Nota de lectura: Define suffix, que se utiliza en las instrucciones siguientes.
const suffix = Date.now()
// Nota de lectura: Define clientEmail, que se utiliza en las instrucciones siguientes.
const clientEmail = `entrega-${suffix}@gmail.com`
// Nota de lectura: Define clientPassword, que se utiliza en las instrucciones siguientes.
const clientPassword = randomBytes(18).toString('base64url')
// Nota de lectura: Define checks, que se utiliza en las instrucciones siguientes.
let checks = 0
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
async function request(path, { method = 'GET', token, body, headers = {}, status = 200 } = {}) {
  // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
  const res = await fetch(base + path, {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    method, headers: { 'Content-Type': 'application/json', Origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    // Nota de lectura: Convierte el objeto JavaScript en texto JSON para enviarlo o persistirlo.
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(20000),
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define raw, que se utiliza en las instrucciones siguientes.
  const raw = await res.text()
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  assert.equal(res.status, status, `${method} ${path}: esperado ${status}, recibido ${res.status}`)
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
// Nota de lectura: Define admin, que se utiliza en las instrucciones siguientes.
const admin = await login('admin@library.cl', password)
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/auth/register', { method: 'POST', status: 201,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  body: { name: 'Cliente de integración', email: clientEmail, password: clientPassword } })
// Nota de lectura: Define client, que se utiliza en las instrucciones siguientes.
const client = await login(clientEmail, clientPassword)
// Nota de lectura: Define books, que se utiliza en las instrucciones siguientes.
const books = []
// Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
for (const [title, price, stock] of [['Pedido integrado', 14990.5, 6], ['Última unidad', 10000, 1]]) {
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  books.push(await request('/books', { method: 'POST', status: 201, token: admin.token,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    body: { title: `${title} ${suffix}`, author: 'Equipo Online Library', price, stock } }))
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/books')
// Nota de lectura: Define data, que se utiliza en las instrucciones siguientes.
const data = {
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  cliente: 'Cliente de integración', correo: clientEmail, direccion: 'Dirección de prueba 123',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  comuna: 'Santiago', metodoPago: 'transferencia', cupon: 'DUOC10',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  items: [{ libroId: books[0].id, cantidad: 2 }],
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/pedidos', { method: 'POST', body: data, status: 401 })
// Nota de lectura: Define key, que se utiliza en las instrucciones siguientes.
const key = randomUUID()
// Nota de lectura: Define options, que se utiliza en las instrucciones siguientes.
const options = { method: 'POST', token: client.token, body: data, status: 201, headers: {
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  'Idempotency-Key': key, 'X-User-Id': '999999', 'X-User-Email': 'otra-cuenta@gmail.com', 'X-User-Role': 'ADMIN',
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
} }
// Nota de lectura: Define order, que se utiliza en las instrucciones siguientes.
const order = await request('/pedidos', options)
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.equal(order.total, 30973)
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.equal(order.estado, 'PENDIENTE_PAGO')
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.equal((await request('/pedidos', options)).id, order.id)
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.equal((await request(`/books/${books[0].id}`)).stock, 4)
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request(`/pedidos/${order.id}`, { token: client.token })
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/pedidos', { token: client.token, status: 403 })
// Nota de lectura: Define orders, que se utiliza en las instrucciones siguientes.
const orders = await request('/pedidos', { token: admin.token })
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.ok(orders.some(item => item.id === order.id))

// El segundo login tiene otra identidad y no puede leer el pedido anterior.
// Nota de lectura: Define secondEmail, que se utiliza en las instrucciones siguientes.
const secondEmail = `entrega-otra-${suffix}@gmail.com`
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/auth/register', { method: 'POST', status: 201,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  body: { name: 'Otra cuenta', email: secondEmail, password: clientPassword } })
// Nota de lectura: Define second, que se utiliza en las instrucciones siguientes.
const second = await login(secondEmail, clientPassword)
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request(`/pedidos/${order.id}`, { token: second.token, status: 403 })
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/pedidos', { ...options, body: { ...data, cliente: 'Datos diferentes' }, status: 409 })
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/pedidos', { ...options, body: { ...data, cupon: 'INVALIDO' }, status: 400,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  headers: { 'Idempotency-Key': randomUUID() } })
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.equal((await request(`/books/${books[0].id}`)).stock, 4)
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/pedidos', { ...options, body: { ...data, items: [data.items[0], data.items[0]] }, status: 400,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  headers: { 'Idempotency-Key': randomUUID() } })
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.equal((await request(`/books/${books[0].id}`)).stock, 4)

// Dos compras reales compiten por la última unidad: solo una puede confirmarse.
// Nota de lectura: Define raceBody, que se utiliza en las instrucciones siguientes.
const raceBody = { ...data, cupon: '', items: [{ libroId: books[1].id, cantidad: 1 }] }
// Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
const concurrent = await Promise.all([1, 2].map(() => fetch(base + '/pedidos', {
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${client.token}`,
    // Nota de lectura: Convierte el objeto JavaScript en texto JSON para enviarlo o persistirlo.
    'Idempotency-Key': randomUUID() }, body: JSON.stringify(raceBody), signal: AbortSignal.timeout(20000),
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})))
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.deepEqual(concurrent.map(res => res.status).sort(), [201, 409])
// Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
checks += 2
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
console.log('OK dos compras concurrentes → 201 y 409')
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.equal((await request(`/books/${books[1].id}`)).stock, 0)

// Nota de lectura: Define posts, que se utiliza en las instrucciones siguientes.
const posts = await request('/v1/posts')
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.ok(Array.isArray(posts))
// Nota de lectura: Define post, que se utiliza en las instrucciones siguientes.
const post = await request('/v1/posts', { method: 'POST', token: admin.token, status: 201,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  body: { title: `Publicación ${suffix}`, summary: 'Integración de contenido', content: 'Párrafo uno.\n\nPárrafo dos.' } })
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request(`/v1/posts/${post.id}`)
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/v1/posts', { method: 'POST', status: 401, body: {} })
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/v1/posts', { method: 'POST', token: client.token, status: 403, body: {} })
// Nota de lectura: Define contact, que se utiliza en las instrucciones siguientes.
const contact = await request('/v1/contact', { method: 'POST', status: 201,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  body: { name: 'Contacto de prueba', email: clientEmail, message: 'Consulta desde el sitio integrado.' } })
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/v1/contact', { status: 401 })
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request('/v1/contact', { token: client.token, status: 403 })
// Nota de lectura: Define messages, que se utiliza en las instrucciones siguientes.
const messages = await request('/v1/contact', { token: admin.token })
// Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
assert.ok(messages.some(item => item.id === contact.id))
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request(`/v1/contact/${contact.id}/read`, { method: 'PATCH', token: admin.token })
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request(`/v1/contact/${contact.id}`, { method: 'DELETE', token: admin.token, status: 204 })
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
await request(`/v1/posts/${post.id}`, { method: 'DELETE', token: admin.token, status: 204 })
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
// Recupera el ID estable de la cuenta que creó el pedido.
const identity = await request('/auth/session', { token: client.token })
// Cambia el correo conservando la cuenta y sus pedidos.
const renamedEmail = `renombrada-${suffix}@gmail.com`
// La administración sincroniza también el perfil de User.
await request(`/auth/users/${identity.id}`, { method: 'PUT', token: admin.token,
  body: { name: 'Cuenta renombrada', email: renamedEmail, role: 'CLIENT' } })
// El token con el correo anterior deja de ser válido.
await request('/auth/session', { token: client.token, status: 401 })
// Inicia una sesión con la identidad actualizada.
const renamed = await login(renamedEmail, clientPassword)
// El pedido sigue perteneciendo al mismo ID después de cambiar el correo.
await request(`/pedidos/${order.id}`, { token: renamed.token })
// Otra cuenta puede registrar el correo liberado, pero no heredar sus permisos.
await request('/auth/register', { method: 'POST', status: 201,
  body: { name: 'Correo reutilizado', email: clientEmail, password: clientPassword } })
// Inicia sesión como la nueva persona que reutiliza ese correo.
const reused = await login(clientEmail, clientPassword)
// El ID diferente impide consultar el pedido antiguo.
await request(`/pedidos/${order.id}`, { token: reused.token, status: 403 })
// El token anterior tampoco se transfiere a la cuenta recién registrada.
await request('/auth/session', { token: client.token, status: 401 })
// Genera una contraseña de prueba que no se imprime.
const rotatedPassword = randomBytes(18).toString('base64url')
// Un cambio de contraseña incrementa la versión de credenciales en Auth.
await request(`/auth/users/${identity.id}`, { method: 'PUT', token: admin.token,
  body: { name: 'Cuenta renombrada', email: renamedEmail, role: 'CLIENT', password: rotatedPassword } })
// El JWT emitido antes del cambio ya no autoriza consultas.
await request('/auth/session', { token: renamed.token, status: 401 })
// Las credenciales nuevas emiten un token de la versión vigente.
const rotated = await login(renamedEmail, rotatedPassword)
// La sesión nueva conserva acceso legítimo a su pedido.
await request(`/pedidos/${order.id}`, { token: rotated.token })
// Resume únicamente los casos que completaron todas sus aserciones.
console.log(`Integración del equipo: ${checks} respuestas comprobadas; stock, reintentos, permisos y persistencia correctos.`)
// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
console.log('Los pedidos y sus libros permanecen en la base aislada de pruebas como evidencia; no se registró ningún cobro.')
