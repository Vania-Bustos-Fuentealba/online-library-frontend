import { Link, NavLink } from 'react-router-dom'
import { useCarrito } from '../hooks/useCarrito'

function Header() {
  const claseLink = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

  // La cantidad de unidades viene del estado compartido del carrito
  const { unidades } = useCarrito()

  return (
    <header className="store-header">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <span>📚</span> Online Library
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#storeNavbar"
            aria-controls="storeNavbar"
            aria-expanded="false"
            aria-label="Abrir navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="storeNavbar">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
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
                <NavLink className="nav-link store-cart-link" to="/carrito">
                  🛒 Carrito
                  <span className="store-cart-badge">{unidades}</span>
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