import { Link } from 'react-router-dom'
import productos from '../data/productos'
import TarjetaLibro from '../components/TarjetaLibro'
import { useCarrito } from '../hooks/useCarrito'

function Inicio() {
  const { agregarAlCarrito } = useCarrito()

  // Destacados: los primeros 4 libros que tengan stock
  const destacados = productos.filter((libro) => libro.stock > 0).slice(0, 4)

  return (
    <>
      <section className="hero-tienda mb-5">
        <div className="row align-items-center">
          <div className="col-12 col-lg-7">
            <h1 className="display-5 fw-bold">Tu próxima historia comienza aquí</h1>
            <p className="lead">
              Fantasía, romance, clásicos y más, a un clic de distancia. Explora el catálogo y arma
              tu próxima lectura.
            </p>
            <Link to="/productos" className="btn btn-light btn-lg">
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-baseline flex-wrap gap-2 mb-4">
          <h2 className="h3 mb-0">Destacados</h2>
          <Link to="/productos">Ver todo el catálogo →</Link>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {destacados.map((libro) => (
            <div className="col" key={libro.id}>
              <TarjetaLibro libro={libro} onAgregar={agregarAlCarrito} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Inicio