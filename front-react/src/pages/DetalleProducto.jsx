import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FichaLibro from '../components/FichaLibro'
import { useCarrito } from '../hooks/useCarrito'
import { solicitar } from '../services/api'

const SIN_PORTADA =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg"
         width="300" height="420" viewBox="0 0 300 420">
      <rect width="300" height="420" fill="#eee5f2"/>
      <text x="150" y="210"
            text-anchor="middle"
            font-family="Arial"
            font-size="22"
            fill="#51245f">
        Sin portada
      </text>
    </svg>
  `)

function DetalleProducto() {
    const { id } = useParams()
    const { agregarAlCarrito } = useCarrito()

    const [recarga, setRecarga] = useState(0)
    const [estado, setEstado] = useState({
        id: null,
        libro: null,
        cargando: true,
        error: '',
    })

    useEffect(() => {
        let activo = true

        async function cargarLibro() {
            setEstado({
                id,
                libro: null,
                cargando: true,
                error: '',
            })

            try {
                const datos = await solicitar(
                    `/books/${encodeURIComponent(id)}`
                )

                if (!datos || datos.id == null) {
                    throw new Error(
                        'El servidor no devolvió un libro válido.'
                    )
                }

                const libro = {
                    id: datos.id,
                    nombre: datos.title,
                    autor: datos.author,
                    precio: Number(datos.price),
                    stock: Number(datos.stock ?? 0),
                    stockCritico: 5,
                    categoria: '',
                    descripcion: '',
                    imagen: SIN_PORTADA,
                }

                if (activo) {
                    setEstado({
                        id,
                        libro,
                        cargando: false,
                        error: '',
                    })
                }
            } catch (err) {
                if (activo) {
                    setEstado({
                        id,
                        libro: null,
                        cargando: false,
                        error: err.message || 'No se pudo cargar el libro.',
                    })
                }
            }
        }

        cargarLibro()

        return () => {
            activo = false
        }
    }, [id, recarga])

    if (estado.id !== id || estado.cargando) {
        return (
            <section className="py-5">
                <p role="status">Cargando libro…</p>
            </section>
        )
    }

    if (estado.error || !estado.libro) {
        return (
            <section className="py-5">
                <h1 className="h2">No se pudo mostrar el libro</h1>

                <div className="alert alert-danger" role="alert">
                    {estado.error || 'No se encontró información del libro.'}
                </div>

                <div className="d-flex flex-wrap gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setRecarga((valor) => valor + 1)}
                    >
                        Reintentar
                    </button>

                    <Link to="/productos" className="btn btn-success">
                        Volver al catálogo
                    </Link>

                    <Link to="/login" className="btn btn-outline-secondary">
                        Iniciar sesión
                    </Link>
                </div>
            </section>
        )
    }

    const libro = estado.libro

    return (
        <section>
            <nav
                className="small text-muted mb-4"
                aria-label="Ruta de navegación"
            >
                <Link to="/">Inicio</Link>
                {' / '}
                <Link to="/productos">Productos</Link>
                {' / '}
                {libro.nombre}
            </nav>

            <FichaLibro
                key={libro.id}
                libro={libro}
                onAgregar={agregarAlCarrito}
            />
        </section>
    )
}

export default DetalleProducto