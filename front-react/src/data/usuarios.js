// Nota de lectura: Define CLAVE_SESION, que se utiliza en las instrucciones siguientes.
const CLAVE_SESION = 'sesion'
// Nota de lectura: Define CLAVE_TOKEN, que se utiliza en las instrucciones siguientes.
const CLAVE_TOKEN = 'token'

// SESIÓN CON JWT
// Esta lectura no verifica la firma.
// La firma y los permisos se verifican en el backend.
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function leerDatosToken() {
  // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
  try {
    // Nota de lectura: Lee el valor persistido bajo esa clave en este navegador.
    const token = localStorage.getItem(CLAVE_TOKEN)

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!token) return null

    // Un JWT contiene cabecera, datos y firma separados por puntos.
    // Nota de lectura: Define partes, que se utiliza en las instrucciones siguientes.
    const partes = token.split('.')

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (partes.length !== 3) return null

    // Convertimos Base64URL a Base64 para poder leer los datos en el navegador.
    // Nota de lectura: Define base64, que se utiliza en las instrucciones siguientes.
    const base64 = partes[1]
        // Nota de lectura: Encadena la operación replace al resultado anterior.
        .replace(/-/g, '+')
        // Nota de lectura: Encadena la operación replace al resultado anterior.
        .replace(/_/g, '/')

    // Nota de lectura: Define base64Completo, que se utiliza en las instrucciones siguientes.
    const base64Completo = base64.padEnd(
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        Math.ceil(base64.length / 4) * 4,
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        '='
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )

    // TextDecoder conserva caracteres Unicode del correo o nombre.
    // Nota de lectura: Define bytes, que se utiliza en las instrucciones siguientes.
    const bytes = Uint8Array.from(
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        atob(base64Completo),
        // Nota de lectura: Define una función corta usada como callback, condición o transformación.
        (caracter) => caracter.charCodeAt(0)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )

    // Nota de lectura: Interpreta JSON como datos; una respuesta inválida produce un error.
    const datos = JSON.parse(new TextDecoder().decode(bytes))

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!datos || typeof datos !== 'object') return null

    // exp usa segundos; Date.now utiliza milisegundos.
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        typeof datos.exp !== 'number' ||
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        !Number.isFinite(datos.exp) ||
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        datos.exp * 1000 <= Date.now()
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    ) {
      // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
      return null
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
    if (typeof datos.sub !== 'string' || !datos.sub.trim() || !['ADMIN', 'CLIENT'].includes(datos.role)) {
      // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
      return null
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return datos
  // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
  } catch {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return null
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function iniciarSesion(usuario) {
  // La identidad devuelta por login debe coincidir con el sujeto del JWT.
  // Nota de lectura: Define datosToken, que se utiliza en las instrucciones siguientes.
  const datosToken = leerDatosToken()

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!datosToken || usuario.email !== datosToken.sub) {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    cerrarSesion()
    // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
    throw new Error('El token no es válido o ha vencido.')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define sesion, que se utiliza en las instrucciones siguientes.
  const sesion = {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    email: datosToken.sub,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    nombre: usuario.nombre ?? '',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    rol: datosToken.role === 'ADMIN' ? 'admin' : 'cliente',
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
  try {
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
  } catch {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    cerrarSesion()
    // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
    throw new Error('No se pudo guardar la sesión en el navegador.')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Notifica a los componentes que escuchan cambios de sesión.
  window.dispatchEvent(new Event('sesion-cambiada'))
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function obtenerSesion() {
  // Se vuelve a leer el token en cada comprobación; el rol local no da permisos.
  // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
  try {
    // Nota de lectura: Define datosToken, que se utiliza en las instrucciones siguientes.
    const datosToken = leerDatosToken()
    // Nota de lectura: Lee el valor persistido bajo esa clave en este navegador.
    const guardada = localStorage.getItem(CLAVE_SESION)

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!datosToken || !guardada) return null

    // Nota de lectura: Interpreta JSON como datos; una respuesta inválida produce un error.
    const sesion = JSON.parse(guardada)

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        !sesion ||
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        typeof sesion.email !== 'string' ||
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        sesion.email !== datosToken.sub
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    ) {
      // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
      return null
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return {
      // Nota de lectura: Aporta el valor ...sesion a la declaración o llamada abierta.
      ...sesion,
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      rol: datosToken.role === 'ADMIN' ? 'admin' : 'cliente',
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      expiresAt: datosToken.exp * 1000,
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
  } catch {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return null
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function cerrarSesion() {
  // Todas las vistas escuchan este evento para actualizarse sin recargar.
  // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
  try {
    // Nota de lectura: Retira esa parte de la sesión almacenada localmente.
    localStorage.removeItem(CLAVE_TOKEN)
  // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
  } finally {
    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
      // Nota de lectura: Retira esa parte de la sesión almacenada localmente.
      localStorage.removeItem(CLAVE_SESION)
    // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
    } finally {
      // Nota de lectura: Notifica a los componentes que escuchan cambios de sesión.
      window.dispatchEvent(new Event('sesion-cambiada'))
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
