import { cerrarSesion } from '../data/usuarios'

// El navegador siempre pasa por el Gateway mediante el proxy /api.
const API_URL = '/api'

export async function solicitar(ruta, { body, autenticar = true, ...opciones } = {}) {
    // Login y registro son públicos: no necesitan un token anterior.
    const token = autenticar ? localStorage.getItem('token') : null
    const headers = new Headers(opciones.headers)

    if (body !== undefined) {
        headers.set('Content-Type', 'application/json')
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    let respuesta

    // Un Gateway caído no debe dejar el formulario bloqueado indefinidamente.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)

    try {
        respuesta = await fetch(`${API_URL}${ruta}`, {
            ...opciones,
            signal: controller.signal,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        })
    } catch {
        if (controller.signal.aborted) throw new Error('El servidor tardó demasiado en responder. Intenta nuevamente.')
        throw new Error('No se pudo conectar con el servidor.')
    } finally {
        clearTimeout(timer)
    }

    if (!respuesta.ok) {
        if (respuesta.status === 401) {
            // Una respuesta antigua no debe cerrar una sesión iniciada después.
            if (token && token === localStorage.getItem('token')) cerrarSesion()

            throw new Error('No se pudo autenticar. Inicia sesión nuevamente.')
        }

        if (respuesta.status === 403) {
            throw new Error('No tienes permisos para realizar esta operación.')
        }

        // Spring devuelve errores de validación por campo y errores de negocio.
        // No exponemos detalles internos de errores 5xx en la interfaz.
        let detalle = ''
        if (respuesta.status < 500) {
            try {
                const datos = await respuesta.json()
                detalle = Object.values(datos.errors ?? {}).filter((valor) => typeof valor === 'string').join(' ')
                if (!detalle && typeof datos.details === 'string') detalle = datos.details
                if (!detalle && typeof datos.message === 'string') detalle = datos.message
            } catch { /* Un cuerpo vacío o HTML no contiene un error de negocio. */ }
        }
        throw new Error(detalle || `No se pudo completar la operación (${respuesta.status}).`)
    }

    if (respuesta.status === 204) {
        return null
    }

    const texto = await respuesta.text()
    try {
        return texto ? JSON.parse(texto) : null
    } catch {
        throw new Error('El servidor devolvió una respuesta inválida. Revisa la conexión con el Gateway.')
    }
}
