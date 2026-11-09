import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../hooks/useCarrito'
import { formatearPrecio } from '../utils/formato'
import {
  validarNombre,
  validarCorreo,
  validarDireccion,
  validarComuna,
  validarPago,
  validarFormularioCompra,
} from '../utils/validaciones'

const DATOS_INICIALES = { nombre: '', correo: '', direccion: '', comuna: '', pago: '' }

const VALIDADORES = {
  nombre: validarNombre,
  correo: validarCorreo,
  direccion: validarDireccion,
  comuna: validarComuna,
  pago: validarPago,
}

function Checkout() {
  const { carrito, subtotal, descuento, envio, total, vaciarCarrito } = useCarrito()

  // Estados del formulario: valores, errores por campo y campos que el usuario ya tocó
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  // Estado: resumen del pedido una vez confirmado
  const [pedido, setPedido] = useState(null)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setDatos((actual) => ({ ...actual, [name]: value }))
    // Validación en tiempo real: se actualiza el error del campo mientras se escribe
    setErrores((actual) => ({ ...actual, [name]: VALIDADORES[name](value) }))
  }

  function manejarSalida(evento) {
    const { name } = evento.target
    setTocados((actual) => ({ ...actual, [name]: true }))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()

    const erroresFinales = validarFormularioCompra(datos)
    setErrores(erroresFinales)
    setTocados({ nombre: true, correo: true, direccion: true, comuna: true, pago: true })

    if (Object.keys(erroresFinales).length > 0) return

    setPedido({ cliente: datos.nombre.trim(), correo: datos.correo.trim(), total })
    vaciarCarrito()
  }

  // Un campo se muestra con error solo después de que el usuario lo tocó
  function claseCampo(nombre) {
    if (!tocados[nombre]) return 'form-control'
    return errores[nombre] ? 'form-control is-invalid' : 'form-control is-valid'
  }

  if (pedido) {
    return (
      <section className="checkout-confirmacion text-center" role="status">
        <h1 className="h2">¡Pedido registrado!</h1>
        <p className="mb-1">Gracias por tu compra, {pedido.cliente}.</p>
        <p className="mb-1">Enviaremos el detalle a {pedido.correo}.</p>
        <p className="fw-semibold">Total pagado: {formatearPrecio(pedido.total)}</p>
        <Link to="/productos" className="btn btn-success">
          Seguir comprando
        </Link>
      </section>
    )
  }

  if (carrito.length === 0) {
    return (
      <section className="text-center py-5">
        <h1 className="h2">No hay productos para pagar</h1>
        <p className="text-muted">Agrega libros al carrito antes de finalizar la compra.</p>
        <Link to="/productos" className="btn btn-success">
          Ver catálogo
        </Link>
      </section>
    )
  }

  return (
    <section>
      <h1 className="h2 mb-4">Finalizar compra</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <form className="checkout-formulario" onSubmit={manejarEnvio} noValidate>
            <h2 className="h5 mb-4">Datos de despacho</h2>

            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className={claseCampo('nombre')}
                value={datos.nombre}
                onChange={manejarCambio}
                onBlur={manejarSalida}
                placeholder="Ingresa tu nombre completo"
                autoComplete="name"
                maxLength={100}
              />
              <div className="invalid-feedback">{errores.nombre}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="correo" className="form-label">
                Correo electrónico
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                className={claseCampo('correo')}
                value={datos.correo}
                onChange={manejarCambio}
                onBlur={manejarSalida}
                placeholder="ejemplo@gmail.com"
                autoComplete="email"
                maxLength={100}
              />
              <div className="checkout-ayuda">Se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com.</div>
              <div className="invalid-feedback">{errores.correo}</div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-md-7">
                <label htmlFor="direccion" className="form-label">
                  Dirección
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  className={claseCampo('direccion')}
                  value={datos.direccion}
                  onChange={manejarCambio}
                  onBlur={manejarSalida}
                  placeholder="Calle y número"
                  autoComplete="street-address"
                  maxLength={300}
                />
                <div className="invalid-feedback">{errores.direccion}</div>
              </div>

              <div className="col-12 col-md-5">
                <label htmlFor="comuna" className="form-label">
                  Comuna
                </label>
                <input
                  id="comuna"
                  name="comuna"
                  type="text"
                  className={claseCampo('comuna')}
                  value={datos.comuna}
                  onChange={manejarCambio}
                  onBlur={manejarSalida}
                  placeholder="Ingresa tu comuna"
                  autoComplete="address-level2"
                  maxLength={100}
                />
                <div className="invalid-feedback">{errores.comuna}</div>
              </div>
            </div>

            <fieldset className="mb-4">
              <legend className="h6">Método de pago</legend>

              <div className="form-check form-check-inline">
                <input
                  id="pagoWebpay"
                  name="pago"
                  type="radio"
                  value="webpay"
                  className="form-check-input"
                  checked={datos.pago === 'webpay'}
                  onChange={manejarCambio}
                />
                <label htmlFor="pagoWebpay" className="form-check-label">
                  WebPay
                </label>
              </div>

              <div className="form-check form-check-inline">
                <input
                  id="pagoTransferencia"
                  name="pago"
                  type="radio"
                  value="transferencia"
                  className="form-check-input"
                  checked={datos.pago === 'transferencia'}
                  onChange={manejarCambio}
                />
                <label htmlFor="pagoTransferencia" className="form-check-label">
                  Transferencia bancaria
                </label>
              </div>

              {tocados.pago && errores.pago && (
                <div className="text-danger small mt-1" role="alert">
                  {errores.pago}
                </div>
              )}
            </fieldset>

            <button type="submit" className="btn btn-success btn-lg">
              Confirmar pedido
            </button>
          </form>
        </div>

        <div className="col-12 col-lg-4">
          <div className="resumen-carrito">
            <h2 className="h5 mb-3">Tu pedido</h2>

            {carrito.map((item) => (
              <div className="resumen-fila" key={item.id}>
                <span>
                  {item.nombre} × {item.cantidad}
                </span>
                <span>{formatearPrecio(item.precio * item.cantidad)}</span>
              </div>
            ))}

            <div className="resumen-fila">
              <span>Subtotal</span>
              <span>{formatearPrecio(subtotal)}</span>
            </div>

            {descuento > 0 && (
              <div className="resumen-fila">
                <span>Descuento</span>
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout