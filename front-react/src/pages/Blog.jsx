// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import BlogCard from '../components/BlogCard'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cargarPosts } from '../services/contenidoApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useAdminResource } from '../admin/useAdminResource'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function Blog() {
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const { data: blogs, loading, error, retry } = useAdminResource(cargarPosts)

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <section className="user-section">
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="container">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="text-center mb-5">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <h1 className="user-section-title">Blog</h1>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <p className="user-section-description">
            Descubre noticias, curiosidades y contenidos
            relacionados con el mundo de los libros y la lectura.
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </p>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>

        {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
        {loading && <p className="text-center">Cargando artículos…</p>}

        {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
        {error && (
          // Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla.
          <div className="user-alert user-alert-error text-center" role="alert">
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <p className="mb-2">{error}</p>
            {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
            <button type="button" className="btn user-btn" onClick={retry}>
              Reintentar
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </button>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )}

        {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
        {blogs && blogs.length === 0 && (
          // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
          <p className="text-center">Aún no hay artículos publicados.</p>
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )}

        {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
        {blogs && blogs.length > 0 && (
          // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
          <div className="row g-4">
            {/* Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual. */}
            {blogs.map((blog) => (
              // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
              <div className="col-12 col-md-6" key={blog.id}>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <BlogCard
                  id={blog.id}
                  titulo={blog.titulo}
                  resumen={blog.resumen}
                  imagen={blog.imagen}
                  alt={blog.alt}
                />
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            ))}
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )}
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </div>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </section>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default Blog