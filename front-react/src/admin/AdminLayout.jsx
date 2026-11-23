import { useEffect, useState } from 'react'
import {
  Link,
  Navigate,
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'
import { cerrarSesion, obtenerSesion } from '../data/usuarios'
import './admin.css'

function AdminLayout() {
  const navigate = useNavigate()
  const [sesion, setSesion] = useState(obtenerSesion)

  useEffect(() => {
    // La sesión se comprueba al montar, al vencer, al volver a la pestaña y al cambiar en otra.
    let temporizador

    function comprobarSesion() {
      window.clearTimeout(temporizador)

      const actual = obtenerSesion()
      setSesion(actual)

      if (!actual) {
        cerrarSesionSinRepetir()
        return
      }

      const restante = actual.expiresAt - Date.now()

      temporizador = window.setTimeout(
          comprobarSesion,
          Math.min(Math.max(restante, 1), 2147483647)
      )
    }

    function cerrarSesionSinRepetir() {
      // Evita que el evento de cerrarSesion vuelva a ejecutar
      // este mismo comprobador mientras se limpia la sesión.
      window.removeEventListener('sesion-cambiada', comprobarSesion)

      try {
        cerrarSesion()
      } finally {
        window.addEventListener('sesion-cambiada', comprobarSesion)
      }
    }

    function manejarStorage(evento) {
      if (
          evento.key === 'token' ||
          evento.key === 'sesion' ||
          evento.key === null
      ) {
        comprobarSesion()
      }
    }

    function manejarVisibilidad() {
      if (document.visibilityState === 'visible') {
        comprobarSesion()
      }
    }

    window.addEventListener('sesion-cambiada', comprobarSesion)
    window.addEventListener('storage', manejarStorage)
    window.addEventListener('focus', comprobarSesion)
    document.addEventListener(
        'visibilitychange',
        manejarVisibilidad
    )

    comprobarSesion()

    return () => {
      window.clearTimeout(temporizador)
      window.removeEventListener('sesion-cambiada', comprobarSesion)
      window.removeEventListener('storage', manejarStorage)
      window.removeEventListener('focus', comprobarSesion)
      document.removeEventListener(
          'visibilitychange',
          manejarVisibilidad
      )
    }
  }, [])

  function salir() {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  if (!sesion) {
    return <Navigate to="/login" replace />
  }

  if (sesion.rol !== 'admin') {
    // Esta barrera protege la interfaz; el Gateway debe validar cada operación real.
    return <Navigate to="/productos" replace />
  }

  return (
      <div className="admin-shell">
        <header className="admin-topbar">
          <Link className="admin-brand" to="/admin">
            Online Library <span>Administración</span>
          </Link>

          <div className="d-flex gap-2">
            <Link
                className="btn btn-outline-light btn-sm"
                to="/blog"
            >
              Volver al sitio
            </Link>

            <button
                className="btn btn-light btn-sm"
                type="button"
                onClick={salir}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="admin-frame">
          <aside
              className="admin-nav"
              aria-label="Navegación de administración"
          >
            <NavLink end to="/admin">
              Resumen
            </NavLink>

            <NavLink to="/admin/productos">
              Productos
            </NavLink>

            <NavLink to="/admin/usuarios">
              Usuarios
            </NavLink>
          </aside>

          <main className="admin-main">
            <Outlet />
          </main>
        </div>
      </div>
  )
}

export default AdminLayout
