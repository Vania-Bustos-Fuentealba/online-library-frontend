const CLAVE_USUARIOS = 'usuarios'
const CLAVE_SESION = 'sesion'

const USUARIOS_INICIALES = [
  {
    id: 1,
    run: '111111111',
    nombre: 'Admin',
    apellidos: 'Online Library',
    email: 'admin@duoc.cl',
    fechaNacimiento: '',
    region: 'Metropolitana de Santiago',
    comuna: 'Santiago',
    direccion: 'Av. Principal 123',
    password: 'admin',
    rol: 'admin'
  },
  {
    id: 2,
    run: '123456785',
    nombre: 'Cliente',
    apellidos: 'De Prueba',
    email: 'cliente@gmail.com',
    fechaNacimiento: '',
    region: 'Metropolitana de Santiago',
    comuna: 'Maipú',
    direccion: 'Calle Falsa 456',
    password: '1234',
    rol: 'cliente'
  }
]

function leerUsuarios() {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIOS)
    if (guardado) {
      return JSON.parse(guardado)
    }
  } catch {
    // si el almacenamiento falla, se usan los usuarios iniciales
  }
  return USUARIOS_INICIALES.map((u) => ({ ...u }))
}

function guardarUsuarios(lista) {
  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista))
  } catch {
    // sin almacenamiento disponible, los cambios no se persisten
  }
}

// READ: todos
export function obtenerUsuarios() {
  return leerUsuarios()
}

// READ: uno por id (null si no existe)
export function obtenerUsuarioPorId(id) {
  return leerUsuarios().find((u) => u.id === Number(id)) || null
}

// CREATE (lanza Error si el correo o el RUN ya existen)
export function crearUsuario(datos) {
  const lista = leerUsuarios()
  const email = datos.email.trim().toLowerCase()
  const run = datos.run.toUpperCase().replace(/\s/g, '')

  if (lista.some((u) => u.email.toLowerCase() === email)) {
    throw new Error('Este correo ya está registrado.')
  }

  if (lista.some((u) => u.run === run)) {
    throw new Error('Este RUN ya está registrado.')
  }

  const nuevoId = lista.length ? Math.max(...lista.map((u) => u.id)) + 1 : 1
  const nuevo = { rol: 'cliente', ...datos, id: nuevoId, email, run }

  lista.push(nuevo)
  guardarUsuarios(lista)

  return nuevo
}

// UPDATE (devuelve el usuario actualizado o null)
export function actualizarUsuario(id, cambios) {
  const lista = leerUsuarios()
  const indice = lista.findIndex((u) => u.id === Number(id))

  if (indice === -1) return null

  lista[indice] = { ...lista[indice], ...cambios, id: lista[indice].id }
  guardarUsuarios(lista)

  return lista[indice]
}

// DELETE (true si borró algo)
export function eliminarUsuario(id) {
  const lista = leerUsuarios()
  const filtrada = lista.filter((u) => u.id !== Number(id))

  guardarUsuarios(filtrada)

  return filtrada.length < lista.length
}

// LOGIN: devuelve el usuario sin la contraseña, o null
export function autenticar(email, password) {
  const emailLimpio = email.trim().toLowerCase()

  const usuario = leerUsuarios().find(
    (u) => u.email.toLowerCase() === emailLimpio && u.password === password
  )

  if (!usuario) return null

  const { password: _omitida, ...sinPassword } = usuario
  return sinPassword
}

// SESIÓN
export function iniciarSesion(usuario) {
  try {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
  } catch {
    // sin almacenamiento, la sesión no se guarda
  }
}

export function obtenerSesion() {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION)
    return guardada ? JSON.parse(guardada) : null
  } catch {
    return null
  }
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION)
  } catch {
    // nada que limpiar
  }
}