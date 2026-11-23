const CLAVE_USUARIOS = 'usuarios'
const CLAVE_SESION = 'sesion'
const CLAVE_TOKEN = 'token'

// Datos locales de demostración.
// Registro y administración de usuarios aún están pendientes
// de conectarse al backend.
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
    rol: 'admin',
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
    rol: 'cliente',
  },
]

function leerUsuarios() {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIOS)

    if (guardado) {
      const usuarios = JSON.parse(guardado)

      if (Array.isArray(usuarios)) {
        return usuarios
      }
    }
  } catch {
    // Se utilizan los datos iniciales si no se pueden leer.
  }

  return USUARIOS_INICIALES.map((usuario) => ({ ...usuario }))
}

function guardarUsuarios(lista) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista))
}

// CONSULTAR USUARIOS LOCALES
export function obtenerUsuarios() {
  return leerUsuarios()
}

export function obtenerUsuarioPorId(id) {
  return (
      leerUsuarios().find((usuario) => usuario.id === Number(id)) ||
      null
  )
}

// CREAR USUARIO LOCAL
export function crearUsuario(datos) {
  const lista = leerUsuarios()
  const email = datos.email.trim().toLowerCase()
  const run = datos.run.toUpperCase().replace(/\s/g, '')

  if (lista.some((usuario) => usuario.email.toLowerCase() === email)) {
    throw new Error('Este correo ya está registrado.')
  }

  if (lista.some((usuario) => usuario.run === run)) {
    throw new Error('Este RUN ya está registrado.')
  }

  const nuevoId = lista.length
      ? Math.max(...lista.map((usuario) => usuario.id)) + 1
      : 1

  const nuevo = {
    rol: 'cliente',
    ...datos,
    id: nuevoId,
    email,
    run,
  }

  lista.push(nuevo)
  guardarUsuarios(lista)

  return nuevo
}

// ACTUALIZAR USUARIO LOCAL
export function actualizarUsuario(id, cambios) {
  const lista = leerUsuarios()
  const indice = lista.findIndex(
      (usuario) => usuario.id === Number(id)
  )

  if (indice === -1) return null

  lista[indice] = {
    ...lista[indice],
    ...cambios,
    id: lista[indice].id,
  }

  guardarUsuarios(lista)

  return lista[indice]
}

// ELIMINAR USUARIO LOCAL
export function eliminarUsuario(id) {
  const lista = leerUsuarios()
  const filtrada = lista.filter(
      (usuario) => usuario.id !== Number(id)
  )

  guardarUsuarios(filtrada)

  return filtrada.length < lista.length
}

// Autenticación local heredada.
// El Login conectado al backend ya no utiliza esta función.
export function autenticar(email, password) {
  const emailLimpio = email.trim().toLowerCase()

  const usuario = leerUsuarios().find(
      (item) =>
          item.email.toLowerCase() === emailLimpio &&
          item.password === password
  )

  if (!usuario) return null

  const { password: _omitida, ...sinPassword } = usuario

  return sinPassword
}

// SESIÓN CON JWT
// Esta lectura no verifica la firma.
// La firma y los permisos se verifican en el backend.
function leerDatosToken() {
  try {
    const token = localStorage.getItem(CLAVE_TOKEN)

    if (!token) return null

    const partes = token.split('.')

    if (partes.length !== 3) return null

    const base64 = partes[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')

    const base64Completo = base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        '='
    )

    const bytes = Uint8Array.from(
        atob(base64Completo),
        (caracter) => caracter.charCodeAt(0)
    )

    const datos = JSON.parse(new TextDecoder().decode(bytes))

    if (!datos || typeof datos !== 'object') return null

    if (
        typeof datos.exp !== 'number' ||
        !Number.isFinite(datos.exp) ||
        datos.exp * 1000 <= Date.now()
    ) {
      return null
    }

    if (!['ADMIN', 'CLIENT'].includes(datos.role)) {
      return null
    }

    return datos
  } catch {
    return null
  }
}

export function iniciarSesion(usuario) {
  const datosToken = leerDatosToken()

  if (!datosToken) {
    cerrarSesion()
    throw new Error('El token no es válido o ha vencido.')
  }

  const sesion = {
    email: usuario.email,
    nombre: usuario.nombre ?? '',
    rol: datosToken.role === 'ADMIN' ? 'admin' : 'cliente',
  }

  try {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  } catch {
    cerrarSesion()
    throw new Error('No se pudo guardar la sesión en el navegador.')
  }

  window.dispatchEvent(new Event('sesion-cambiada'))
}

export function obtenerSesion() {
  try {
    const datosToken = leerDatosToken()
    const guardada = localStorage.getItem(CLAVE_SESION)

    if (!datosToken || !guardada) return null

    const sesion = JSON.parse(guardada)

    if (
        !sesion ||
        typeof sesion.email !== 'string' ||
        !sesion.email.trim()
    ) {
      return null
    }

    return {
      ...sesion,
      rol: datosToken.role === 'ADMIN' ? 'admin' : 'cliente',
      expiresAt: datosToken.exp * 1000,
    }
  } catch {
    return null
  }
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(CLAVE_TOKEN)
  } finally {
    try {
      localStorage.removeItem(CLAVE_SESION)
    } finally {
      window.dispatchEvent(new Event('sesion-cambiada'))
    }
  }
}