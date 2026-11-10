import { Link, useParams } from 'react-router-dom'
import { obtenerBlogPorId } from '../data/blogs'

function DetalleBlog() {
  const { id } = useParams()
  const blog = obtenerBlogPorId(id)

  if (!blog) {
    return (
      <section className="user-section">
        <div className="container text-center">
          <h1 className="user-section-title">Artículo no encontrado</h1>
          <p className="user-section-description">
            El artículo que buscas no existe o fue eliminado.
          </p>
          <Link to="/blog" className="btn user-btn">
            Volver al Blog
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="user-section">
      <div className="container">
        <div className="user-blog-detail">
          <Link to="/blog" className="user-btn-secondary mb-4 d-inline-block">
            ← Volver al Blog
          </Link>

          <article className="user-blog-detail-card">
            <img
              className="user-blog-detail-image"
              src={blog.imagen}
              alt={blog.alt}
            />

            <div className="user-blog-detail-body">
              <h1>{blog.titulo}</h1>

              {blog.contenido.map((parrafo, indice) => (
                <p key={indice}>{parrafo}</p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default DetalleBlog