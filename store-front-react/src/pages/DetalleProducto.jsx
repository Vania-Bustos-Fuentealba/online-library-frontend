import { Link, useParams } from 'react-router-dom'
import productos from '../data/productos'
import FichaLibro from '../components/FichaLibro'
import TarjetaLibro from '../components/TarjetaLibro'
import { useCarrito } from '../hooks/useCarrito'

function DetalleProducto() {
  // El id viene de la URL: /productos/:id
  const { id } = useParams()
  const { agregarAlCarrito } = useCarrito()

  const libro = productos.find((p) => p.id === Number(id))

  if (!libro) {
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

  const relacionados = productos
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