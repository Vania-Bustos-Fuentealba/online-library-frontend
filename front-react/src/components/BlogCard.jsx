import { Link } from 'react-router-dom'

function BlogCard({ id, titulo, resumen, imagen, alt }) {
  return (
    <article className="user-card">
      <img className="user-card-image" src={imagen} alt={alt} />

      <div className="user-card-body">
        <h2 className="user-card-title">{titulo}</h2>
        <p className="user-card-text">{resumen}</p>

        <Link to={`/blog/${id}`} className="btn user-btn">
          Leer más
        </Link>
      </div>
    </article>
  )
}

export default BlogCard