// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { formatearPrecio } from '../utils/formato'

// Props:
//  - libro: objeto con los datos del libro
//  - onAgregar(libro, cantidad): se ejecuta al presionar "Añadir al carrito"
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function FichaLibro({ libro, onAgregar }) {
  // Estado: cantidad elegida y mensaje de confirmación
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [cantidad, setCantidad] = useState(1)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [mensaje, setMensaje] = useState('')

  // Nota de lectura: Define sinStock, que se utiliza en las instrucciones siguientes.
  const sinStock = libro.stock === 0
  // Nota de lectura: Define pocoStock, que se utiliza en las instrucciones siguientes.
  const pocoStock = !sinStock && libro.stock <= libro.stockCritico

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function cambiarCantidad(nueva) {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setCantidad(Math.max(1, Math.min(nueva, libro.stock)))
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function manejarAgregar() {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    onAgregar(libro, cantidad)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setMensaje(`Se añadió ${cantidad} unidad(es) al carrito.`)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <div className="row g-5">
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="col-12 col-lg-5">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="ficha-imagen">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <img src={libro.imagen} alt={`Portada de ${libro.nombre}`} />
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </div>

      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="col-12 col-lg-7">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <span className="tarjeta-libro-categoria">{libro.categoria}</span>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <h1 className="mt-2">{libro.nombre}</h1>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="text-muted fst-italic">{libro.autor}</p>

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p>{libro.descripcion}</p>

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="ficha-precio">{formatearPrecio(libro.precio)}</p>

        {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
        {sinStock && <p className="text-danger fw-semibold">Sin stock disponible</p>}
        {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
        {pocoStock && (
          // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
          <p className="text-warning-emphasis fw-semibold">¡Últimas {libro.stock} unidades!</p>
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )}
        {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
        {!sinStock && !pocoStock && <p className="text-muted">Stock disponible</p>}

        {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
        {!sinStock && (
          // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
          <div className="d-flex align-items-center gap-3 my-4">
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <span className="fw-semibold">Cantidad:</span>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="d-flex align-items-center gap-2">
              {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                aria-label="Disminuir cantidad"
                disabled={cantidad <= 1}
                onClick={() => cambiarCantidad(cantidad - 1)}
              >
                −
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </button>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span className="item-carrito-numero" aria-live="polite">
                {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                {cantidad}
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </span>

              {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                aria-label="Aumentar cantidad"
                disabled={cantidad >= libro.stock}
                onClick={() => cambiarCantidad(cantidad + 1)}
              >
                +
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </button>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )}

        {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
        <button
          type="button"
          className="btn btn-success btn-lg"
          disabled={sinStock}
          onClick={manejarAgregar}
        >
          {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
          {sinStock ? 'Sin stock' : 'Añadir al carrito'}
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </button>

        {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
        {mensaje && (
          // Nota de lectura: Anuncia carga o confirmación sin tratarla como error.
          <p className="text-success fw-semibold mt-3" role="status">
            {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
            {mensaje}
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </p>
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )}
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </div>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </div>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default FichaLibro