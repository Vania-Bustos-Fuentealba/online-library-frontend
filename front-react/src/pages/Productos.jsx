// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useEffect, useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import TarjetaLibro from '../components/TarjetaLibro'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCarrito } from '../hooks/useCarrito'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { obtenerLibros } from '../services/tiendaApi'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function Productos() {
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [productos, setProductos] = useState([])
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [aviso, setAviso] = useState('')
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [error, setError] = useState('')
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [cargando, setCargando] = useState(true)
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [recarga, setRecarga] = useState(0)
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [busqueda, setBusqueda] = useState('')
    // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
    const consulta = busqueda.trim().toLocaleLowerCase('es')
    // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
    const visibles = productos.filter((libro) => `${libro.nombre} ${libro.autor}`.toLocaleLowerCase('es').includes(consulta))

    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const { agregarAlCarrito } = useCarrito()

    // Nota de lectura: Sincroniza el componente con una consulta o evento externo y permite limpiar al desmontarse.
    useEffect(() => {
        // Nota de lectura: Define activo, que se utiliza en las instrucciones siguientes.
        let activo = true

        // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
        async function cargarProductos() {
            // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
            setCargando(true)
            // Nota de lectura: Actualiza el mensaje de error que verá la persona.
            setError('')
            // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
            setAviso('')

            // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
            try {
                // Nota de lectura: Define libros, que se utiliza en las instrucciones siguientes.
                const libros = await obtenerLibros()

                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (activo) {
                    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                    setProductos(libros)
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }
            // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
            } catch (err) {
                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (activo) {
                    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                    setProductos([])
                    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
                    setError(
                        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
                        err.message || 'No se pudo cargar el catálogo.'
                    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                    )
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }
            // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
            } finally {
                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (activo) {
                    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                    setCargando(false)
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            }
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }

        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        cargarProductos()

        // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
        return () => {
            // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
            activo = false
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    }, [recarga])

    // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
    function manejarAgregar(libro) {
        // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
        if (libro.stock <= 0) return

        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        agregarAlCarrito(libro)
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        setAviso(`Se añadió "${libro.nombre}" al carrito.`)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return (
        // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
        <section>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <h1 className="h2 mb-0">Catálogo</h1>

                {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={cargando}
                    onClick={() => setRecarga((valor) => valor + 1)}
                >
                    {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                    {cargando ? 'Cargando…' : 'Actualizar catálogo'}
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </button>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
            <label htmlFor="buscar-libros" className="form-label">Buscar por título o autor</label>
            {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
            <input id="buscar-libros" type="search" className="form-control mb-4" value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)} />

            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {aviso && (
                // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                <div
                    className="alert alert-success py-2"
                    role="status"
                >
                    {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                    {aviso}
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )}

            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {error && (
                // Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla.
                <div className="alert alert-danger" role="alert">
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <p className="mb-2">{error}</p>
                    {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                    <Link to="/login">Ir a iniciar sesión</Link>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )}

            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {cargando && (
                // Nota de lectura: Anuncia carga o confirmación sin tratarla como error.
                <p role="status">Cargando libros…</p>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )}

            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {!cargando && !error && (
                // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                <>
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <p className="text-muted small">
                        {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                        {visibles.length}{' '}
                        {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
                        {visibles.length === 1 ? 'producto' : 'productos'}
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </p>

                    {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
                    {visibles.length === 0 ? (
                        // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                        <div className="alert alert-info">
                            {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
                            {productos.length === 0 ? 'Todavía no hay libros disponibles.' : 'No hay libros que coincidan con tu búsqueda.'}
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        </div>
                    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                    ) : (
                        // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
                            {/* Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual. */}
                            {visibles.map((libro) => (
                                // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                                <div className="col" key={libro.id}>
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    <TarjetaLibro
                                        libro={libro}
                                        onAgregar={manejarAgregar}
                                    />
                                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                </div>
                            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                            ))}
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        </div>
                    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                    )}
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )}
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </section>
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default Productos
