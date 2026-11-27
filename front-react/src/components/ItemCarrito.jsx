// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { formatearPrecio } from '../utils/formato'

// Props:
//  - item: producto dentro del carrito (con su cantidad)
//  - onCambiarCantidad(id, nuevaCantidad)
//  - onQuitar(id)
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function ItemCarrito({ item, onCambiarCantidad, onQuitar }) {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <div className="item-carrito">
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="item-carrito-imagen">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <img src={item.imagen} alt={`Portada de ${item.nombre}`} />
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </div>

      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="item-carrito-info">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <h3 className="h6 mb-1">{item.nombre}</h3>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="text-muted small fst-italic mb-1">{item.autor}</p>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="text-muted small mb-0">{formatearPrecio(item.precio)} c/u</p>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </div>

      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="item-carrito-cantidad">
        {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          aria-label={`Disminuir cantidad de ${item.nombre}`}
          onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
        >
          −
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </button>

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <span className="item-carrito-numero" aria-live="polite">
          {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
          {item.cantidad}
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </span>

        {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          aria-label={`Aumentar cantidad de ${item.nombre}`}
          disabled={item.cantidad >= item.stock}
          onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
        >
          +
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </button>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </div>

      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="item-carrito-subtotal">{formatearPrecio(item.precio * item.cantidad)}</div>

      {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
      <button type="button" className="btn btn-link text-danger btn-sm p-0" onClick={() => onQuitar(item.id)}>
        Eliminar
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </button>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </div>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default ItemCarrito