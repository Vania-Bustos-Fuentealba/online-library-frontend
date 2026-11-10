import { useState } from 'react'
import BlogCard from '../components/BlogCard'
import { obtenerBlogs } from '../data/blogs'

function Blog() {
  const [blogs] = useState(() => obtenerBlogs())

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
      </div>
    </section>
  )
}

export default Blog