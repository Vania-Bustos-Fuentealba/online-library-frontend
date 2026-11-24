import { useEffect, useState } from 'react'
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useCarrito } from '../hooks/useCarrito'
import { cerrarSesion, obtenerSesion } from '../data/usuarios'

function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { unidades } = useCarrito()

  const [sesion, setSesion] = useState(obtenerSesion)

  const claseLink = ({ isActive }) =>
      isActive ? 'nav-link active' : 'nav-link'

  useEffect(() => {
    let temporizador

    function actualizarSesion() {
      window.clearTimeout(temporizador)

      const actual = obtenerSesion()
      setSesion(actual)

      if (actual) {
        const restante = actual.expiresAt - Date.now()

        temporizador = window.setTimeout(
            actualizarSesion,
            Math.min(Math.max(restante, 1), 2147483647)
        )
      }
    }

    function manejarStorage(evento) {
      if (
          evento.key === 'token' ||
          evento.key === 'sesion' ||
          evento.key === null
      ) {
        actualizarSesion()
      }
    }

    function manejarVisibilidad() {
      if (document.visibilityState === 'visible') {
        actualizarSesion()
      }
    }

    window.addEventListener('sesion-cambiada', actualizarSesion)
    window.addEventListener('storage', manejarStorage)
    window.addEventListener('focus', actualizarSesion)
    document.addEventListener(
        'visibilitychange',
        manejarVisibilidad
    )

    actualizarSesion()

    return () => {
      window.clearTimeout(temporizador)
      window.removeEventListener(
          'sesion-cambiada',
          actualizarSesion
      )
      window.removeEventListener('storage', manejarStorage)
      window.removeEventListener('focus', actualizarSesion)
      document.removeEventListener(
          'visibilitychange',
          manejarVisibilidad
      )
    }
  }, [pathname])

  function salir() {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  return (
      <header className="user-header">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <span>📚</span> Online Library
            </Link>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#userNavbar"
                aria-controls="userNavbar"
                aria-expanded="false"
                aria-label="Abrir navegación"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
                className="collapse navbar-collapse"
                id="userNavbar"
            >
              <ul className="navbar-nav ms-auto align-items-lg-center">
                <li className="nav-item">
                  <NavLink className={claseLink} to="/" end>
                    Inicio
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={claseLink} to="/productos">
                    Productos
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={claseLink} to="/nosotros">
                    Nosotros
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={claseLink} to="/blog">
                    Blog
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={claseLink} to="/contacto">
                    Contacto
                  </NavLink>
                </li>

                {sesion ? (
                    <>
                      {sesion.rol === 'admin' && (
                          <li className="nav-item">
                            <NavLink
                                className={claseLink}
                                to="/admin"
                            >
                              Administración
                            </NavLink>
                          </li>
                      )}

                      <li className="nav-item">
                    <span
                        className="navbar-text small px-lg-2 d-inline-block text-truncate"
                        style={{ maxWidth: '200px' }}
                        title={sesion.email}
                    >
                      {sesion.nombre || sesion.email}
                    </span>
                      </li>

                      <li className="nav-item">
                        <button
                            className="nav-link"
                            type="button"
                            onClick={salir}
                        >
                          Cerrar sesión
                        </button>
                      </li>
                    </>
                ) : (
                    <>
                      <li className="nav-item">
                        <NavLink className={claseLink} to="/login">
                          Iniciar sesión
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                            className={claseLink}
                            to="/registro"
                        >
                          Registrarse
                        </NavLink>
                      </li>
                    </>
                )}

                <li className="nav-item">
                  <NavLink
                      className="nav-link store-cart-link"
                      to="/carrito"
                  >
                    🛒 Carrito
                    <span className="store-cart-badge">
                    {unidades}
                  </span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
  )
}

export default Header