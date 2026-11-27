// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCallback } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useParams } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cargarPost } from '../services/contenidoApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useAdminResource } from '../admin/useAdminResource'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function DetalleBlog() {
  // Nota de lectura: Obtiene el identificador definido en la URL.
  const { id } = useParams()
  // Nota de lectura: Mantiene estable la función mientras no cambien sus dependencias.
  const cargar = useCallback(() => cargarPost(id), [id])
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const { data: blog, loading, error } = useAdminResource(cargar)

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (loading) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return (
      // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
      <section className="user-section">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="container text-center">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <p>Cargando artículo…</p>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </section>
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (error || !blog) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return (
      // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
      <section className="user-section">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="container text-center">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <h1 className="user-section-title">Artículo no disponible</h1>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <p className="user-section-description">
            {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
            {error || 'El artículo que buscas no existe o fue eliminado.'}
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </p>
          {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
          <Link to="/blog" className="btn user-btn">
            Volver al Blog
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </Link>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </section>
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <section className="user-section">
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="container">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="user-blog-detail">
          {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
          <Link to="/blog" className="user-btn-secondary mb-4 d-inline-block">
            ← Volver al Blog
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </Link>

          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <article className="user-blog-detail-card">
            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {blog.imagen && (
              // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
              <img
                className="user-blog-detail-image"
                src={blog.imagen}
                alt={blog.alt}
              />
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )}

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="user-blog-detail-body">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <h1>{blog.titulo}</h1>

              {/* Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual. */}
              {blog.contenido.map((parrafo, indice) => (
                // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                <p key={indice}>{parrafo}</p>
              // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
              ))}
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </article>
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
export default DetalleBlog