import { useState } from 'react'
import TarjetaLibro from '../components/TarjetaLibro'
import Cargando from '../components/Cargando'
import AvisoError from '../components/AvisoError'
import { useCarrito } from '../hooks/useCarrito'
import { useLibros } from '../hooks/useLibros'

function Productos() {
  // Estado: categoría seleccionada en el filtro ('' significa todas)
  const [categoria, setCategoria] = useState('')
  // Estado: mensaje que confirma que se añadió un libro
  const [aviso, setAviso] = useState('')
  const { agregarAlCarrito } = useCarrito()
  // Los libros vienen de la API del backend
  const { libros, cargando, error } = useLibros()

  const categorias = [...new Set(libros.map((libro) => libro.categoria))].sort()

  const librosVisibles = categoria
    ? libros.filter((libro) => libro.categoria === categoria)
    : libros

  function manejarAgregar(libro) {
    agregarAlCarrito(libro)
    setAviso(`Se añadió "${libro.nombre}" al carrito.`)
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h1 className="h2 mb-0">Catálogo</h1>

        <div className="d-flex align-items-center gap-2">
          <label htmlFor="filtroCategoria" className="small text-muted mb-0">
            Categoría:
          </label>
          <select
            id="filtroCategoria"
            className="form-select form-select-sm"
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando && <Cargando texto="Cargando catálogo..." />}
      {error && <AvisoError mensaje={error} />}

      {aviso && (
        <div className="alert alert-success py-2" role="status">
          {aviso}
        </div>
      )}

      {!cargando && !error && (
        <p className="text-muted small">
          {librosVisibles.length} {librosVisibles.length === 1 ? 'producto' : 'productos'}
        </p>
      )}

      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
        {librosVisibles.map((libro) => (
          <div className="col" key={libro.id}>
            <TarjetaLibro libro={libro} onAgregar={manejarAgregar} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Productos