import { formatearPrecio } from '../utils/formato'

// Props:
//  - item: producto dentro del carrito (con su cantidad)
//  - onCambiarCantidad(id, nuevaCantidad)
//  - onQuitar(id)
function ItemCarrito({ item, onCambiarCantidad, onQuitar }) {
  return (
    <div className="item-carrito">
      <div className="item-carrito-imagen">
        <img src={item.imagen} alt={`Portada de ${item.nombre}`} />
      </div>

      <div className="item-carrito-info">
        <h3 className="h6 mb-1">{item.nombre}</h3>
        <p className="text-muted small fst-italic mb-1">{item.autor}</p>
        <p className="text-muted small mb-0">{formatearPrecio(item.precio)} c/u</p>
      </div>

      <div className="item-carrito-cantidad">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          aria-label={`Disminuir cantidad de ${item.nombre}`}
          onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
        >
          −
        </button>

        <span className="item-carrito-numero" aria-live="polite">
          {item.cantidad}
        </span>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          aria-label={`Aumentar cantidad de ${item.nombre}`}
          disabled={item.cantidad >= item.stock}
          onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
        >
          +
        </button>
      </div>

      <div className="item-carrito-subtotal">{formatearPrecio(item.precio * item.cantidad)}</div>

      <button type="button" className="btn btn-link text-danger btn-sm p-0" onClick={() => onQuitar(item.id)}>
        Eliminar
      </button>
    </div>
  )
}

export default ItemCarrito