// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cerrarSesion, iniciarSesion, obtenerSesion } from '../data/usuarios'

// El navegador siempre pasa por el Gateway mediante el proxy /api.
// Nota de lectura: Define API_URL, que se utiliza en las instrucciones siguientes.
const API_URL = '/api'

// Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
export async function solicitar(ruta, { body, autenticar = true, renovar = true, ...opciones } = {}) {
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (autenticar && renovar) await renovarSiNecesario()
    // Login y registro son públicos: no necesitan un token anterior.
    // Nota de lectura: Lee el valor persistido bajo esa clave en este navegador.
    const token = autenticar ? localStorage.getItem('token') : null
    // Nota de lectura: Define headers, que se utiliza en las instrucciones siguientes.
    const headers = new Headers(opciones.headers)

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (body !== undefined) {
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        headers.set('Content-Type', 'application/json')
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (token) {
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        headers.set('Authorization', `Bearer ${token}`)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Define respuesta, que se utiliza en las instrucciones siguientes.
    let respuesta

    // Un Gateway caído no debe dejar el formulario bloqueado indefinidamente.
    // Nota de lectura: Define controller, que se utiliza en las instrucciones siguientes.
    const controller = new AbortController()
    // Nota de lectura: Programa una comprobación o un límite de espera para más adelante.
    const timer = setTimeout(() => controller.abort(), 15000)

    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
        // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
        respuesta = await fetch(`${API_URL}${ruta}`, {
            // Nota de lectura: Aporta el valor ...opciones a la declaración o llamada abierta.
            ...opciones,
            // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
            signal: controller.signal,
            // Nota de lectura: Aporta el valor headers a la declaración o llamada abierta.
            headers,
            // Nota de lectura: Convierte el objeto JavaScript en texto JSON para enviarlo o persistirlo.
            body: body === undefined ? undefined : JSON.stringify(body),
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        })
    // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
    } catch {
        // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
        if (controller.signal.aborted) throw new Error('El servidor tardó demasiado en responder. Intenta nuevamente.')
        // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
        throw new Error('No se pudo conectar con el servidor.')
    // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
    } finally {
        // Nota de lectura: Cancela el temporizador anterior para no ejecutar una acción duplicada.
        clearTimeout(timer)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!respuesta.ok) {
        // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
        if (respuesta.status === 401) {
            // Una respuesta antigua no debe cerrar una sesión iniciada después.
            // Nota de lectura: Lee el valor persistido bajo esa clave en este navegador.
            if (token && token === localStorage.getItem('token')) cerrarSesion()

            // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
            throw new Error('No se pudo autenticar. Inicia sesión nuevamente.')
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }

        // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
        if (respuesta.status === 403) {
            // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
            throw new Error('No tienes permisos para realizar esta operación.')
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }

        // Spring devuelve errores de validación por campo y errores de negocio.
        // No exponemos detalles internos de errores 5xx en la interfaz.
        // Nota de lectura: Define detalle, que se utiliza en las instrucciones siguientes.
        let detalle = ''
        // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
        if (respuesta.status < 500) {
            // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
            try {
                // Nota de lectura: Interpreta JSON como datos; una respuesta inválida produce un error.
                const datos = await respuesta.json()
                // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
                detalle = Object.values(datos.errors ?? {}).filter((valor) => typeof valor === 'string').join(' ')
                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (!detalle && typeof datos.details === 'string') detalle = datos.details
                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (!detalle && typeof datos.message === 'string') detalle = datos.message
            // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
            } catch { /* Un cuerpo vacío o HTML no contiene un error de negocio. */ }
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }
        // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
        throw new Error(detalle || `No se pudo completar la operación (${respuesta.status}).`)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (respuesta.status === 204) {
        // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
        return null
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Define texto, que se utiliza en las instrucciones siguientes.
    const texto = await respuesta.text()
    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
        // Nota de lectura: Interpreta JSON como datos; una respuesta inválida produce un error.
        return texto ? JSON.parse(texto) : null
    // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
    } catch {
        // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
        throw new Error('El servidor devolvió una respuesta inválida. Revisa la conexión con el Gateway.')
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Todas las llamadas de esta pestaña comparten una renovación para evitar carreras.
// Nota de lectura: Define renovacionPendiente, que se utiliza en las instrucciones siguientes.
let renovacionPendiente = null
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export async function renovarSiNecesario() {
  // Nota de lectura: Define sesion, que se utiliza en las instrucciones siguientes.
  const sesion = obtenerSesion()
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!sesion || sesion.expiresAt - Date.now() > 120000) return
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (renovacionPendiente) return renovacionPendiente
  // Nota de lectura: Lee el valor persistido bajo esa clave en este navegador.
  const anterior = localStorage.getItem('token')
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  renovacionPendiente = (async () => {
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    const datos = await solicitar('/auth/refresh', { method: 'POST', renovar: false })
    // Una respuesta tardía no reabre una sesión cerrada ni reemplaza otra cuenta.
    // Nota de lectura: Lee el valor persistido bajo esa clave en este navegador.
    if (localStorage.getItem('token') !== anterior) return
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!datos?.token || datos.email !== sesion.email || !['ADMIN', 'CLIENT', 'SELLER'].includes(datos.role)) {
      // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
      throw new Error('El servidor no pudo renovar la sesión de forma válida.')
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    localStorage.setItem('token', datos.token)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    iniciarSesion({ email: datos.email, nombre: sesion.nombre })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })()
  // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
  try { await renovacionPendiente } finally { renovacionPendiente = null }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
