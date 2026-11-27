// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useEffect, useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useParams } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import FichaLibro from '../components/FichaLibro'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCarrito } from '../hooks/useCarrito'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { obtenerLibro } from '../services/tiendaApi'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function DetalleProducto() {
    // Nota de lectura: Obtiene el identificador definido en la URL.
    const { id } = useParams()
    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const { agregarAlCarrito } = useCarrito()

    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [recarga, setRecarga] = useState(0)
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [estado, setEstado] = useState({
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        id: null,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        libro: null,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        cargando: true,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        error: '',
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    })

    // Nota de lectura: Sincroniza el componente con una consulta o evento externo y permite limpiar al desmontarse.
    useEffect(() => {
        // Nota de lectura: Define activo, que se utiliza en las instrucciones siguientes.
        let activo = true

        // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
        async function cargarLibro() {
            // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
            setEstado({
                // Nota de lectura: Aporta el valor id a la declaración o llamada abierta.
                id,
                // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                libro: null,
                // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                cargando: true,
                // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                error: '',
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            })

            // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
            try {
                // Nota de lectura: Define libro, que se utiliza en las instrucciones siguientes.
                const libro = await obtenerLibro(id)

                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (activo) {
                    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                    setEstado({
                        // Nota de lectura: Aporta el valor id a la declaración o llamada abierta.
                        id,
                        // Nota de lectura: Aporta el valor libro a la declaración o llamada abierta.
                        libro,
                        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                        cargando: false,
                        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                        error: '',
                    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                    })
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }
            // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
            } catch (err) {
                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (activo) {
                    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                    setEstado({
                        // Nota de lectura: Aporta el valor id a la declaración o llamada abierta.
                        id,
                        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                        libro: null,
                        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                        cargando: false,
                        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                        error: err.message || 'No se pudo cargar el libro.',
                    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                    })
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            }
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }

        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        cargarLibro()

        // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
        return () => {
            // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
            activo = false
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    }, [id, recarga])

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (estado.id !== id || estado.cargando) {
        // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
        return (
            // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
            <section className="py-5">
                {/* Nota de lectura: Anuncia carga o confirmación sin tratarla como error. */}
                <p role="status">Cargando libro…</p>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </section>
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (estado.error || !estado.libro) {
        // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
        return (
            // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
            <section className="py-5">
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <h1 className="h2">No se pudo mostrar el libro</h1>

                {/* Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla. */}
                <div className="alert alert-danger" role="alert">
                    {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                    {estado.error || 'No se encontró información del libro.'}
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <div className="d-flex flex-wrap gap-2">
                    {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setRecarga((valor) => valor + 1)}
                    >
                        Reintentar
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </button>

                    {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                    <Link to="/productos" className="btn btn-success">
                        Volver al catálogo
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </Link>

                    {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                    <Link to="/login" className="btn btn-outline-secondary">
                        Iniciar sesión
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </Link>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </section>
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Define libro, que se utiliza en las instrucciones siguientes.
    const libro = estado.libro

    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return (
        // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
        <section>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <nav
                className="small text-muted mb-4"
                aria-label="Ruta de navegación"
            >
                {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                <Link to="/">Inicio</Link>
                {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                {' / '}
                {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                <Link to="/productos">Productos</Link>
                {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                {' / '}
                {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                {libro.nombre}
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </nav>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <FichaLibro
                key={libro.id}
                libro={libro}
                onAgregar={agregarAlCarrito}
            />
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </section>
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default DetalleProducto