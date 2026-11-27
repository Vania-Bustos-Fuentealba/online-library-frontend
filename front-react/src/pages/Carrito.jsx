// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCarrito } from '../hooks/useCarrito'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import ItemCarrito from '../components/ItemCarrito'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { formatearPrecio } from '../utils/formato'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function Carrito() {
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const {
    // Nota de lectura: Aporta el valor carrito a la declaración o llamada abierta.
    carrito,
    // Nota de lectura: Aporta el valor cupon a la declaración o llamada abierta.
    cupon,
    // Nota de lectura: Aporta el valor cambiarCantidadItem a la declaración o llamada abierta.
    cambiarCantidadItem,
    // Nota de lectura: Aporta el valor quitarDelCarrito a la declaración o llamada abierta.
    quitarDelCarrito,
    // Nota de lectura: Aporta el valor aplicarCupon a la declaración o llamada abierta.
    aplicarCupon,
    // Nota de lectura: Aporta el valor quitarCupon a la declaración o llamada abierta.
    quitarCupon,
    // Nota de lectura: Aporta el valor subtotal a la declaración o llamada abierta.
    subtotal,
    // Nota de lectura: Aporta el valor descuento a la declaración o llamada abierta.
    descuento,
    // Nota de lectura: Aporta el valor envio a la declaración o llamada abierta.
    envio,
    // Nota de lectura: Aporta el valor total a la declaración o llamada abierta.
    total,
  // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
  } = useCarrito()

  // Estados: lo que el usuario escribe en el cupón y el mensaje de resultado
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [codigo, setCodigo] = useState('')
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [aviso, setAviso] = useState({ texto: '', valido: false })

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function manejarCupon(evento) {
    // Nota de lectura: Evita el envío HTML tradicional para controlar la validación con React.
    evento.preventDefault()
    // Nota de lectura: Define resultado, que se utiliza en las instrucciones siguientes.
    const resultado = aplicarCupon(codigo)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setAviso({ texto: resultado.mensaje, valido: resultado.valido })
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (resultado.valido) setCodigo('')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (carrito.length === 0) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return (
      // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
      <section className="text-center py-5">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <h1 className="h2">Tu carrito está vacío</h1>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="text-muted">Agrega libros desde el catálogo para verlos aquí.</p>
        {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
        <Link to="/productos" className="btn btn-success">
          Ver catálogo
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </Link>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </section>
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <section>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <h1 className="h2 mb-4">Mi carrito</h1>

      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="row g-4">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="col-12 col-lg-8">
          {/* Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual. */}
          {carrito.map((item) => (
            // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
            <ItemCarrito
              key={item.id}
              item={item}
              onCambiarCantidad={cambiarCantidadItem}
              onQuitar={quitarDelCarrito}
            />
          // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
          ))}
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="col-12 col-lg-4">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <div className="resumen-carrito">
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <h2 className="h5 mb-3">Resumen de compra</h2>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="resumen-fila">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>Subtotal</span>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>{formatearPrecio(subtotal)}</span>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {descuento > 0 && (
              // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
              <div className="resumen-fila">
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <span>
                  Descuento ({cupon}){' '}
                  {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
                  <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={quitarCupon}>
                    Quitar
                  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                  </button>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </span>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <span>- {formatearPrecio(descuento)}</span>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )}

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="resumen-fila">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>Envío</span>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>{envio === 0 ? 'Gratis' : formatearPrecio(envio)}</span>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="resumen-fila resumen-total">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>Total</span>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>{formatearPrecio(total)}</span>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <p className="checkout-ayuda mt-2 mb-3">Despacho gratis en compras sobre $30.000.</p>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <form onSubmit={manejarCupon} noValidate>
              {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
              <label htmlFor="cupon" className="form-label small fw-semibold">
                Cupón de descuento
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </label>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="grupo-cupon">
                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
                <input
                  id="cupon"
                  type="text"
                  className="form-control"
                  placeholder="Ej: DUOC10"
                  autoComplete="off"
                  value={codigo}
                  onChange={(evento) => setCodigo(evento.target.value)}
                />
                {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
                <button type="submit" className="btn btn-outline-secondary">
                  Aplicar
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </button>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>

              {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
              {aviso.texto && (
                // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                <p
                  className={`small mt-2 mb-0 ${aviso.valido ? 'text-success' : 'text-danger'}`}
                  role="status"
                >
                  {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                  {aviso.texto}
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </p>
              // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
              )}
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </form>

            {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
            <Link to="/checkout" className="btn btn-success w-100 mt-3">
              Finalizar compra
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </Link>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </div>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </section>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default Carrito