// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { obtenerLibros } from '../services/tiendaApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useAdminResource } from '../admin/useAdminResource'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import TarjetaLibro from '../components/TarjetaLibro'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCarrito } from '../hooks/useCarrito'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function Inicio() {
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const { agregarAlCarrito } = useCarrito()

  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const { data: productos, loading, error, retry } = useAdminResource(obtenerLibros)

  // Destacados provienen de los mismos libros que administra el equipo.
  // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
  const destacados = (productos || []).filter((libro) => libro.stock > 0).slice(0, 4)

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <section className="hero-tienda mb-5">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="row align-items-center">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <div className="col-12 col-lg-7">
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <h1 className="display-5 fw-bold">Tu próxima historia comienza aquí</h1>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <p className="lead">
              Fantasía, romance, clásicos y más, a un clic de distancia. Explora el catálogo y arma
              tu próxima lectura.
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </p>
            {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
            <Link to="/productos" className="btn btn-light btn-lg">
              Ver catálogo
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </Link>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </section>

      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <section>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="d-flex justify-content-between align-items-baseline flex-wrap gap-2 mb-4">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <h2 className="h3 mb-0">Destacados</h2>
          {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
          <Link to="/productos">Ver todo el catálogo →</Link>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>

        {/* Nota de lectura: Anuncia carga o confirmación sin tratarla como error. */}
        {loading && <p role="status">Cargando libros…</p>}
        {/* Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla. */}
        {error && <div role="alert" className="alert alert-danger">{error} <button type="button" onClick={retry}>Reintentar</button></div>}
        {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
        {!loading && !error && destacados.length === 0 && <p>Aún no hay libros disponibles.</p>}
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {/* Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual. */}
          {destacados.map((libro) => (
            // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
            <div className="col" key={libro.id}>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <TarjetaLibro libro={libro} onAgregar={agregarAlCarrito} />
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>
          // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
          ))}
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </section>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default Inicio