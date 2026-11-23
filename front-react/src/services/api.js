const API_URL = '/api'

export async function solicitar(ruta, { body, ...opciones } = {}) {
    const token = localStorage.getItem('token')
    const headers = new Headers(opciones.headers)

    if (body !== undefined) {
        headers.set('Content-Type', 'application/json')
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    let respuesta

    try {
        respuesta = await fetch(`${API_URL}${ruta}`, {
            ...opciones,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        })
    } catch {
        throw new Error('No se pudo conectar con el servidor.')
    }

    if (!respuesta.ok) {
        if (respuesta.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('sesion')

            throw new Error('No se pudo autenticar. Inicia sesión nuevamente.')
        }

        if (respuesta.status === 403) {
            throw new Error('No tienes permisos para realizar esta operación.')
        }

        throw new Error(
            `No se pudo completar la operación (${respuesta.status}).`
        )
    }

    if (respuesta.status === 204) {
        return null
    }

    const texto = await respuesta.text()
    return texto ? JSON.parse(texto) : null
}