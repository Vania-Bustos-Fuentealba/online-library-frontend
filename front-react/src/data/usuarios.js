const CLAVE_SESION = 'sesion'
const CLAVE_TOKEN = 'token'

// SESIÓN CON JWT
// Esta lectura no verifica la firma.
// La firma y los permisos se verifican en el backend.
function leerDatosToken() {
  try {
    const token = localStorage.getItem(CLAVE_TOKEN)

    if (!token) return null

    // Un JWT contiene cabecera, datos y firma separados por puntos.
    const partes = token.split('.')

    if (partes.length !== 3) return null

    // Convertimos Base64URL a Base64 para poder leer los datos en el navegador.
    const base64 = partes[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')

    const base64Completo = base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        '='
    )

    // TextDecoder conserva caracteres Unicode del correo o nombre.
    const bytes = Uint8Array.from(
        atob(base64Completo),
        (caracter) => caracter.charCodeAt(0)
    )

    const datos = JSON.parse(new TextDecoder().decode(bytes))

    if (!datos || typeof datos !== 'object') return null

    // exp usa segundos; Date.now utiliza milisegundos.
    if (
        typeof datos.exp !== 'number' ||
        !Number.isFinite(datos.exp) ||
        datos.exp * 1000 <= Date.now()
    ) {
      return null
    }

    if (typeof datos.sub !== 'string' || !datos.sub.trim() || !['ADMIN', 'CLIENT'].includes(datos.role)) {
      return null
    }

    return datos
  } catch {
    return null
  }
}

export function iniciarSesion(usuario) {
  // La identidad devuelta por login debe coincidir con el sujeto del JWT.
  const datosToken = leerDatosToken()

  if (!datosToken || usuario.email !== datosToken.sub) {
    cerrarSesion()
    throw new Error('El token no es válido o ha vencido.')
  }

  const sesion = {
    email: datosToken.sub,
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
  // Se vuelve a leer el token en cada comprobación; el rol local no da permisos.
  try {
    const datosToken = leerDatosToken()
    const guardada = localStorage.getItem(CLAVE_SESION)

    if (!datosToken || !guardada) return null

    const sesion = JSON.parse(guardada)

    if (
        !sesion ||
        typeof sesion.email !== 'string' ||
        sesion.email !== datosToken.sub
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
  // Todas las vistas escuchan este evento para actualizarse sin recargar.
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
