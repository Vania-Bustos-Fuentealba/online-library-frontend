import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="user-footer">
      <div className="footer-columnas">
        <div>
          <h4>Online Library</h4>
          <p>Librería online chilena. Envíos a todo el país.</p>
        </div>

        <div>
          <h4>Categorías</h4>
          <ul>
            <li>
              <Link to="/productos">Fantasía</Link>
            </li>
            <li>
              <Link to="/productos">Clásicos</Link>
            </li>
            <li>
              <Link to="/productos">Narrativa</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Ayuda</h4>
          <ul>
            <li>
              <Link to="/nosotros">Nosotros</Link>
            </li>
            <li>
              <Link to="/blog">Blogs</Link>
            </li>
            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-base">
        <p>© 2026 Online Library — todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer