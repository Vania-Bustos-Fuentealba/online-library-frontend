import BlogCard from '../components/BlogCard'
import { cargarPosts } from '../services/contenidoApi'
import { useAdminResource } from '../admin/useAdminResource'

function Blog() {
  const { data: blogs, loading, error, retry } = useAdminResource(cargarPosts)

  return (
    <section className="user-section">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="user-section-title">Blog</h1>
          <p className="user-section-description">
            Descubre noticias, curiosidades y contenidos
            relacionados con el mundo de los libros y la lectura.
          </p>
        </div>

        {loading && <p className="text-center">Cargando artículos…</p>}

        {error && (
          <div className="user-alert user-alert-error text-center" role="alert">
            <p className="mb-2">{error}</p>
            <button type="button" className="btn user-btn" onClick={retry}>
              Reintentar
            </button>
          </div>
        )}

        {blogs && blogs.length === 0 && (
          <p className="text-center">Aún no hay artículos publicados.</p>
        )}

        {blogs && blogs.length > 0 && (
          <div className="row g-4">
            {blogs.map((blog) => (
              <div className="col-12 col-md-6" key={blog.id}>
                <BlogCard
                  id={blog.id}
                  titulo={blog.titulo}
                  resumen={blog.resumen}
                  imagen={blog.imagen}
                  alt={blog.alt}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Blog