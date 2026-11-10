import { useState } from 'react'
import { formatearPrecio } from '../utils/formato'

// Props:
//  - libro: objeto con los datos del libro
//  - onAgregar(libro, cantidad): se ejecuta al presionar "Añadir al carrito"
function FichaLibro({ libro, onAgregar }) {
  // Estado: cantidad elegida y mensaje de confirmación
  const [cantidad, setCantidad] = useState(1)
  const [mensaje, setMensaje] = useState('')

  const sinStock = libro.stock === 0
  const pocoStock = !sinStock && libro.stock <= libro.stockCritico

  function cambiarCantidad(nueva) {
    setCantidad(Math.max(1, Math.min(nueva, libro.stock)))
  }

  function manejarAgregar() {
    onAgregar(libro, cantidad)
    setMensaje(`Se añadió ${cantidad} unidad(es) al carrito.`)
  }

  return (
    <div className="row g-5">
      <div className="col-12 col-lg-5">
        <div className="ficha-imagen">
          <img src={libro.imagen} alt={`Portada de ${libro.nombre}`} />
        </div>
      </div>

      <div className="col-12 col-lg-7">
        <span className="tarjeta-libro-categoria">{libro.categoria}</span>
        <h1 className="mt-2">{libro.nombre}</h1>
        <p className="text-muted fst-italic">{libro.autor}</p>

        <p>{libro.descripcion}</p>

        <p className="ficha-precio">{formatearPrecio(libro.precio)}</p>

        {sinStock && <p className="text-danger fw-semibold">Sin stock disponible</p>}
        {pocoStock && (
          <p className="text-warning-emphasis fw-semibold">¡Últimas {libro.stock} unidades!</p>
        )}
        {!sinStock && !pocoStock && <p className="text-muted">Stock disponible</p>}

        {!sinStock && (
          <div className="d-flex align-items-center gap-3 my-4">
            <span className="fw-semibold">Cantidad:</span>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                aria-label="Disminuir cantidad"
                disabled={cantidad <= 1}
                onClick={() => cambiarCantidad(cantidad - 1)}
              >
                −
              </button>

              <span className="item-carrito-numero" aria-live="polite">
                {cantidad}
              </span>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                aria-label="Aumentar cantidad"
                disabled={cantidad >= libro.stock}
                onClick={() => cambiarCantidad(cantidad + 1)}
              >
                +
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="btn btn-success btn-lg"
          disabled={sinStock}
          onClick={manejarAgregar}
        >
          {sinStock ? 'Sin stock' : 'Añadir al carrito'}
        </button>

        {mensaje && (
          <p className="text-success fw-semibold mt-3" role="status">
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}

export default FichaLibro