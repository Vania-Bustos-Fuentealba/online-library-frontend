import { Link, NavLink } from 'react-router-dom'

function Header() {
  const claseLink = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

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

          <div className="collapse navbar-collapse" id="userNavbar">
            <ul className="navbar-nav ms-auto align-items-lg-center">
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

              <li className="nav-item">
                <NavLink className={claseLink} to="/login">
                  Iniciar sesión
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className={claseLink} to="/registro">
                  Registrarse
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