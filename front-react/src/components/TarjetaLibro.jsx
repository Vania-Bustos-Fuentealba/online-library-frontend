// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { formatearPrecio } from '../utils/formato'

// Props:
//  - libro: objeto con los datos del libro
//  - onAgregar: función que se ejecuta al presionar "Añadir al carrito"
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function TarjetaLibro({ libro, onAgregar }) {
  // Nota de lectura: Define sinStock, que se utiliza en las instrucciones siguientes.
  const sinStock = libro.stock === 0
  // Nota de lectura: Define pocoStock, que se utiliza en las instrucciones siguientes.
  const pocoStock = !sinStock && libro.stock <= libro.stockCritico

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <div className="card h-100 tarjeta-libro">
      {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
      <Link to={`/productos/${libro.id}`} className="tarjeta-libro-imagen">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <img src={libro.imagen} alt={`Portada de ${libro.nombre}`} />
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </Link>

      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="card-body d-flex flex-column gap-1">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <span className="tarjeta-libro-categoria">{libro.categoria}</span>

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <h3 className="h6 mb-0">
          {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
          <Link to={`/productos/${libro.id}`} className="tarjeta-libro-titulo">
            {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
            {libro.nombre}
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </Link>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </h3>

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="text-muted fst-italic small mb-1">{libro.autor}</p>

        {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
        {sinStock && <span className="text-danger small fw-semibold">Sin stock</span>}
        {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
        {pocoStock && (
          // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
          <span className="text-warning-emphasis small fw-semibold">¡Últimas unidades!</span>
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )}

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <span className="tarjeta-libro-precio mt-auto">{formatearPrecio(libro.precio)}</span>

        {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
        <button
          type="button"
          className="btn btn-success btn-sm mt-2"
          disabled={sinStock}
          onClick={() => onAgregar(libro)}
        >
          {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
          {sinStock ? 'Sin stock' : 'Añadir al carrito'}
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </button>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </div>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </div>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default TarjetaLibro