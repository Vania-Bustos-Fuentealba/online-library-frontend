// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useEffect, useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import {
  // Nota de lectura: Aporta el valor Link a la declaración o llamada abierta.
  Link,
  // Nota de lectura: Aporta el valor Navigate a la declaración o llamada abierta.
  Navigate,
  // Nota de lectura: Aporta el valor NavLink a la declaración o llamada abierta.
  NavLink,
  // Nota de lectura: Aporta el valor Outlet a la declaración o llamada abierta.
  Outlet,
  // Nota de lectura: Obtiene la función para cambiar de pantalla desde código.
  useNavigate,
// Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
} from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cerrarSesion, obtenerSesion } from '../data/usuarios'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import './admin.css'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function AdminLayout() {
  // Nota de lectura: Obtiene la función para cambiar de pantalla desde código.
  const navigate = useNavigate()
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [sesion, setSesion] = useState(obtenerSesion)

  // Nota de lectura: Sincroniza el componente con una consulta o evento externo y permite limpiar al desmontarse.
  useEffect(() => {
    // La sesión se comprueba al montar, al vencer, al volver a la pestaña y al cambiar en otra.
    // Nota de lectura: Define temporizador, que se utiliza en las instrucciones siguientes.
    let temporizador

    // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
    function comprobarSesion() {
      // Nota de lectura: Cancela el temporizador anterior para no ejecutar una acción duplicada.
      window.clearTimeout(temporizador)

      // Nota de lectura: Define actual, que se utiliza en las instrucciones siguientes.
      const actual = obtenerSesion()
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      setSesion(actual)

      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (!actual) {
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        cerrarSesionSinRepetir()
        // Nota de lectura: Aporta el valor return a la declaración o llamada abierta.
        return
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }

      // Nota de lectura: Define restante, que se utiliza en las instrucciones siguientes.
      const restante = actual.expiresAt - Date.now()

      // Nota de lectura: Programa una comprobación o un límite de espera para más adelante.
      temporizador = window.setTimeout(
          // Nota de lectura: Aporta el valor comprobarSesion a la declaración o llamada abierta.
          comprobarSesion,
          // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
          Math.min(Math.max(restante, 1), 2147483647)
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      )
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
    function cerrarSesionSinRepetir() {
      // Evita que el evento de cerrarSesion vuelva a ejecutar
      // este mismo comprobador mientras se limpia la sesión.
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      window.removeEventListener('sesion-cambiada', comprobarSesion)

      // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
      try {
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        cerrarSesion()
      // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
      } finally {
        // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
        window.addEventListener('sesion-cambiada', comprobarSesion)
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
    function manejarStorage(evento) {
      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (
          // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
          evento.key === 'token' ||
          // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
          evento.key === 'sesion' ||
          // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
          evento.key === null
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      ) {
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        comprobarSesion()
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
    function manejarVisibilidad() {
      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (document.visibilityState === 'visible') {
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        comprobarSesion()
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    window.addEventListener('sesion-cambiada', comprobarSesion)
    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    window.addEventListener('storage', manejarStorage)
    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    window.addEventListener('focus', comprobarSesion)
    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    document.addEventListener(
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'visibilitychange',
        // Nota de lectura: Aporta el valor manejarVisibilidad a la declaración o llamada abierta.
        manejarVisibilidad
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    comprobarSesion()

    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return () => {
      // Nota de lectura: Cancela el temporizador anterior para no ejecutar una acción duplicada.
      window.clearTimeout(temporizador)
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      window.removeEventListener('sesion-cambiada', comprobarSesion)
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      window.removeEventListener('storage', manejarStorage)
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      window.removeEventListener('focus', comprobarSesion)
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      document.removeEventListener(
          // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
          'visibilitychange',
          // Nota de lectura: Aporta el valor manejarVisibilidad a la declaración o llamada abierta.
          manejarVisibilidad
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      )
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }, [])

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function salir() {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    cerrarSesion()
    // Nota de lectura: Cambia de pantalla; state transporta un mensaje y replace evita volver al formulario enviado.
    navigate('/login', { replace: true })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!sesion) {
    // Nota de lectura: Redirige al visitante porque no cumple la condición de acceso.
    return <Navigate to="/login" replace />
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (sesion.rol !== 'admin') {
    // Esta barrera protege la interfaz; el Gateway debe validar cada operación real.
    // Nota de lectura: Redirige al visitante porque no cumple la condición de acceso.
    return <Navigate to="/productos" replace />
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
      // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
      <div className="admin-shell">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <header className="admin-topbar">
          {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
          <Link className="admin-brand" to="/admin">
            Online Library <span>Administración</span>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </Link>

          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <div className="d-flex gap-2">
            {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
            <Link
                className="btn btn-outline-light btn-sm"
                to="/blog"
            >
              Volver al sitio
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </Link>

            {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
            <button
                className="btn btn-light btn-sm"
                type="button"
                onClick={salir}
            >
              Cerrar sesión
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </button>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </header>

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="admin-frame">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <aside
              className="admin-nav"
              aria-label="Navegación de administración"
          >
            {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
            <NavLink end to="/admin">
              Resumen
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </NavLink>

            {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
            <NavLink to="/admin/productos">
              Productos
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </NavLink>

            {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
            <NavLink to="/admin/usuarios">
              Usuarios
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </NavLink>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </aside>

          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <main className="admin-main">
            {/* Nota de lectura: Inserta la pantalla hija dentro del panel administrativo. */}
            <Outlet />
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </main>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </div>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default AdminLayout
