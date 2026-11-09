import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="store-footer">
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
              <Link to="/productos">Romance</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Tienda</h4>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/productos">Productos</Link>
            </li>
            <li>
              <Link to="/carrito">Carrito</Link>
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