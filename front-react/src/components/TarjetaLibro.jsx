import { Link } from 'react-router-dom'
import { formatearPrecio } from '../utils/formato'

// Props:
//  - libro: objeto con los datos del libro
//  - onAgregar: función que se ejecuta al presionar "Añadir al carrito"
function TarjetaLibro({ libro, onAgregar }) {
  const sinStock = libro.stock === 0
  const pocoStock = !sinStock && libro.stock <= libro.stockCritico

  return (
    <div className="card h-100 tarjeta-libro">
      <Link to={`/productos/${libro.id}`} className="tarjeta-libro-imagen">
        <img src={libro.imagen} alt={`Portada de ${libro.nombre}`} />
      </Link>

      <div className="card-body d-flex flex-column gap-1">
        <span className="tarjeta-libro-categoria">{libro.categoria}</span>

        <h3 className="h6 mb-0">
          <Link to={`/productos/${libro.id}`} className="tarjeta-libro-titulo">
            {libro.nombre}
          </Link>
        </h3>

        <p className="text-muted fst-italic small mb-1">{libro.autor}</p>

        {sinStock && <span className="text-danger small fw-semibold">Sin stock</span>}
        {pocoStock && (
          <span className="text-warning-emphasis small fw-semibold">¡Últimas unidades!</span>
        )}

        <span className="tarjeta-libro-precio mt-auto">{formatearPrecio(libro.precio)}</span>

        <button
          type="button"
          className="btn btn-success btn-sm mt-2"
          disabled={sinStock}
          onClick={() => onAgregar(libro)}
        >
          {sinStock ? 'Sin stock' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  )
}

export default TarjetaLibro