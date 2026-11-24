import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TarjetaLibro from '../components/TarjetaLibro'
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

function Productos() {
    const [productos, setProductos] = useState([])
    const [aviso, setAviso] = useState('')
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(true)
    const [recarga, setRecarga] = useState(0)

    const { agregarAlCarrito } = useCarrito()

    useEffect(() => {
        let activo = true

        async function cargarProductos() {
            setCargando(true)
            setError('')
            setAviso('')

            try {
                const datos = await solicitar('/books')

                if (!Array.isArray(datos)) {
                    throw new Error(
                        'El servidor no devolvió una lista de libros válida.'
                    )
                }

                const libros = datos.map((libro) => ({
                    id: libro.id,
                    nombre: libro.title,
                    autor: libro.author,
                    precio: Number(libro.price),
                    stock: Number(libro.stock ?? 0),
                    stockCritico: 5,
                    categoria: '',
                    descripcion: '',
                    imagen: SIN_PORTADA,
                }))

                if (activo) {
                    setProductos(libros)
                }
            } catch (err) {
                if (activo) {
                    setProductos([])
                    setError(
                        err.message || 'No se pudo cargar el catálogo.'
                    )
                }
            } finally {
                if (activo) {
                    setCargando(false)
                }
            }
        }

        cargarProductos()

        return () => {
            activo = false
        }
    }, [recarga])

    function manejarAgregar(libro) {
        if (libro.stock <= 0) return

        agregarAlCarrito(libro)
        setAviso(`Se añadió "${libro.nombre}" al carrito.`)
    }

    return (
        <section>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <h1 className="h2 mb-0">Catálogo</h1>

                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={cargando}
                    onClick={() => setRecarga((valor) => valor + 1)}
                >
                    {cargando ? 'Cargando…' : 'Actualizar catálogo'}
                </button>
            </div>

            {aviso && (
                <div
                    className="alert alert-success py-2"
                    role="status"
                >
                    {aviso}
                </div>
            )}

            {error && (
                <div className="alert alert-danger" role="alert">
                    <p className="mb-2">{error}</p>
                    <Link to="/login">Ir a iniciar sesión</Link>
                </div>
            )}

            {cargando && (
                <p role="status">Cargando libros…</p>
            )}

            {!cargando && !error && (
                <>
                    <p className="text-muted small">
                        {productos.length}{' '}
                        {productos.length === 1 ? 'producto' : 'productos'}
                    </p>

                    {productos.length === 0 ? (
                        <div className="alert alert-info">
                            Todavía no hay libros disponibles.
                        </div>
                    ) : (
                        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
                            {productos.map((libro) => (
                                <div className="col" key={libro.id}>
                                    <TarjetaLibro
                                        libro={libro}
                                        onAgregar={manejarAgregar}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default Productos