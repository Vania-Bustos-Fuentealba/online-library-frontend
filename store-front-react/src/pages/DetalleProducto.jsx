import { Link, useParams } from 'react-router-dom'
import FichaLibro from '../components/FichaLibro'
import TarjetaLibro from '../components/TarjetaLibro'
import Cargando from '../components/Cargando'
import AvisoError from '../components/AvisoError'
import { useCarrito } from '../hooks/useCarrito'
import { useLibro, useLibros } from '../hooks/useLibros'

function DetalleProducto() {
  // El id viene de la URL: /productos/:id
  const { id } = useParams()
  const { agregarAlCarrito } = useCarrito()

  // El libro y la lista de libros relacionados vienen de la API
  const { libro, cargando, noEncontrado, error } = useLibro(id)
  const { libros } = useLibros()

  if (cargando) {
    return <Cargando texto="Cargando libro..." />
  }

  if (error) {
    return <AvisoError mensaje={error} />
  }

  if (noEncontrado || !libro) {
    return (
      <section className="text-center py-5">
        <h1 className="h2">Producto no encontrado</h1>
        <p className="text-muted">El libro que buscas no existe o el enlace no es válido.</p>
        <Link to="/productos" className="btn btn-success">
          Volver al catálogo
        </Link>
      </section>
    )
  }

  const relacionados = libros
    .filter((p) => p.categoria === libro.categoria && p.id !== libro.id)
    .slice(0, 4)

  return (
    <section>
      <nav className="small text-muted mb-4">
        <Link to="/">Inicio</Link> / <Link to="/productos">Productos</Link> / {libro.nombre}
      </nav>

      {/* key hace que la ficha reinicie su estado al cambiar de libro */}
      <FichaLibro key={libro.id} libro={libro} onAgregar={agregarAlCarrito} />

      {relacionados.length > 0 && (
        <div className="mt-5 pt-4 border-top">
          <h2 className="h4 mb-4">También te puede interesar</h2>
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
            {relacionados.map((p) => (
              <div className="col" key={p.id}>
                <TarjetaLibro libro={p} onAgregar={agregarAlCarrito} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default DetalleProducto