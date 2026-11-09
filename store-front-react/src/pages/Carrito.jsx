import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../hooks/useCarrito'
import ItemCarrito from '../components/ItemCarrito'
import { formatearPrecio } from '../utils/formato'

function Carrito() {
  const {
    carrito,
    cupon,
    cambiarCantidadItem,
    quitarDelCarrito,
    aplicarCupon,
    quitarCupon,
    subtotal,
    descuento,
    envio,
    total,
  } = useCarrito()

  // Estados: lo que el usuario escribe en el cupón y el mensaje de resultado
  const [codigo, setCodigo] = useState('')
  const [aviso, setAviso] = useState({ texto: '', valido: false })

  function manejarCupon(evento) {
    evento.preventDefault()
    const resultado = aplicarCupon(codigo)
    setAviso({ texto: resultado.mensaje, valido: resultado.valido })
    if (resultado.valido) setCodigo('')
  }

  if (carrito.length === 0) {
    return (
      <section className="text-center py-5">
        <h1 className="h2">Tu carrito está vacío</h1>
        <p className="text-muted">Agrega libros desde el catálogo para verlos aquí.</p>
        <Link to="/productos" className="btn btn-success">
          Ver catálogo
        </Link>
      </section>
    )
  }

  return (
    <section>
      <h1 className="h2 mb-4">Mi carrito</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {carrito.map((item) => (
            <ItemCarrito
              key={item.id}
              item={item}
              onCambiarCantidad={cambiarCantidadItem}
              onQuitar={quitarDelCarrito}
            />
          ))}
        </div>

        <div className="col-12 col-lg-4">
          <div className="resumen-carrito">
            <h2 className="h5 mb-3">Resumen de compra</h2>

            <div className="resumen-fila">
              <span>Subtotal</span>
              <span>{formatearPrecio(subtotal)}</span>
            </div>

            {descuento > 0 && (
              <div className="resumen-fila">
                <span>
                  Descuento ({cupon}){' '}
                  <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={quitarCupon}>
                    Quitar
                  </button>
                </span>
                <span>- {formatearPrecio(descuento)}</span>
              </div>
            )}

            <div className="resumen-fila">
              <span>Envío</span>
              <span>{envio === 0 ? 'Gratis' : formatearPrecio(envio)}</span>
            </div>

            <div className="resumen-fila resumen-total">
              <span>Total</span>
              <span>{formatearPrecio(total)}</span>
            </div>

            <p className="checkout-ayuda mt-2 mb-3">Despacho gratis en compras sobre $30.000.</p>

            <form onSubmit={manejarCupon} noValidate>
              <label htmlFor="cupon" className="form-label small fw-semibold">
                Cupón de descuento
              </label>
              <div className="grupo-cupon">
                <input
                  id="cupon"
                  type="text"
                  className="form-control"
                  placeholder="Ej: DUOC10"
                  autoComplete="off"
                  value={codigo}
                  onChange={(evento) => setCodigo(evento.target.value)}
                />
                <button type="submit" className="btn btn-outline-secondary">
                  Aplicar
                </button>
              </div>

              {aviso.texto && (
                <p
                  className={`small mt-2 mb-0 ${aviso.valido ? 'text-success' : 'text-danger'}`}
                  role="status"
                >
                  {aviso.texto}
                </p>
              )}
            </form>

            <Link to="/checkout" className="btn btn-success w-100 mt-3">
              Finalizar compra
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Carrito