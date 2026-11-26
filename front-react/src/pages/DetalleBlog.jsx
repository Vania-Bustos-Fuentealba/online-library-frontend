import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cargarPost } from '../services/contenidoApi'
import { useAdminResource } from '../admin/useAdminResource'

function DetalleBlog() {
  const { id } = useParams()
  const cargar = useCallback(() => cargarPost(id), [id])
  const { data: blog, loading, error } = useAdminResource(cargar)

  if (loading) {
    return (
      <section className="user-section">
        <div className="container text-center">
          <p>Cargando artículo…</p>
        </div>
      </section>
    )
  }

  if (error || !blog) {
    return (
      <section className="user-section">
        <div className="container text-center">
          <h1 className="user-section-title">Artículo no disponible</h1>
          <p className="user-section-description">
            {error || 'El artículo que buscas no existe o fue eliminado.'}
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
            {blog.imagen && (
              <img
                className="user-blog-detail-image"
                src={blog.imagen}
                alt={blog.alt}
              />
            )}

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