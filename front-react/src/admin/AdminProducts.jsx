// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useEffect, useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useLocation } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cargarLibros, tieneStockBajo } from './adminApi'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function AdminProducts({ readOnly = false, base = '/admin' }) {
    // Nota de lectura: Consulta la ruta y el estado que otra pantalla envió al navegar.
    const location = useLocation()
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [success, setSuccess] = useState(location.state?.success ?? '')
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [products, setProducts] = useState([])
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [query, setQuery] = useState('')
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [loading, setLoading] = useState(true)
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [error, setError] = useState('')
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [deletingId, setDeletingId] = useState(null)
    // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
    const [reload, setReload] = useState(0)

    // Nota de lectura: Sincroniza el componente con una consulta o evento externo y permite limpiar al desmontarse.
    useEffect(() => {
        // Nota de lectura: Define active, que se utiliza en las instrucciones siguientes.
        let active = true

        // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
        async function loadProducts() {
            // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
            setLoading(true)
            // Nota de lectura: Actualiza el mensaje de error que verá la persona.
            setError('')

            // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
            try {
                // Nota de lectura: Define data, que se utiliza en las instrucciones siguientes.
                const data = await cargarLibros()

                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (!Array.isArray(data)) {
                    // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
                    throw new Error('El servidor devolvió una lista de libros inválida.')
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }

                // Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual.
                const books = data.map((book) => ({
                    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                    id: book.id, code: book.code, category: book.category, criticalStock: book.criticalStock,
                    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                    name: book.title,
                    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                    author: book.author,
                    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                    price: book.price,
                    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                    stock: book.stock,
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }))

                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (active) {
                    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                    setProducts(books)
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }
            // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
            } catch (err) {
                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (active) {
                    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
                    setError(err.message || 'No se pudieron cargar los libros.')
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }
            // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
            } finally {
                // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
                if (active) {
                    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                    setLoading(false)
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            }
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }

        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        loadProducts()

        // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
        return () => {
            // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
            active = false
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    }, [reload])

    // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
    async function removeProduct(id) {
        // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
        if (deletingId !== null) return

        // Nota de lectura: Define product, que se utiliza en las instrucciones siguientes.
        const product = products.find((item) => item.id === id)

        // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
        if (
            // Nota de lectura: Solicita confirmación de eliminación antes de enviar una petición destructiva.
            !window.confirm(
                // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
                `¿Eliminar ${product?.name ?? 'este libro'} del catálogo?`
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        ) {
            // Nota de lectura: Aporta el valor return a la declaración o llamada abierta.
            return
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }

        // Nota de lectura: Muestra una confirmación solo después de una respuesta satisfactoria.
        setSuccess('')
        // Nota de lectura: Marca la operación en curso para impedir envíos o borrados duplicados.
        setDeletingId(id)
        // Nota de lectura: Actualiza el mensaje de error que verá la persona.
        setError('')

        // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
        try {
            // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
            await solicitar(`/books/${encodeURIComponent(id)}`, {
                // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
                method: 'DELETE',
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            })

            // Nota de lectura: Muestra una confirmación solo después de una respuesta satisfactoria.
            setSuccess('Producto eliminado correctamente.')
            // Nota de lectura: Define una función corta usada como callback, condición o transformación.
            setProducts((current) =>
                // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
                current.filter((item) => item.id !== id)
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )
        // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
        } catch (err) {
            // Nota de lectura: Actualiza el mensaje de error que verá la persona.
            setError(err.message || 'No se pudo eliminar el libro.')
        // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
        } finally {
            // Nota de lectura: Marca la operación en curso para impedir envíos o borrados duplicados.
            setDeletingId(null)
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
    const filtered = products.filter((product) =>
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        `${product.id} ${product.code ?? ''} ${product.category ?? ''} ${product.name ?? ''} ${product.author ?? ''}`
            // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
            .toLowerCase()
            // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
            .includes(query.trim().toLowerCase())
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )

    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return (
        // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
        <>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="admin-heading admin-heading-row">
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <div>
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <p className="admin-eyebrow">Catálogo</p>
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <h1>Productos</h1>
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <p>{readOnly ? 'Consulta los libros y sus existencias.' : 'Gestiona los libros disponibles en la tienda.'}</p>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>

                {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                {!readOnly && <Link
                    className="btn btn-primary"
                    to="/admin/productos/nuevo"
                >
                    Nuevo producto
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </Link>}
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Anuncia carga o confirmación sin tratarla como error. */}
            {success && <p className="alert alert-success" role="status">{success}</p>}
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <p>Stock bajo: existencias iguales o inferiores al umbral configurado en cada libro.</p>
            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {error && (
                // Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla.
                <div className="alert alert-danger" role="alert">
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <p className="mb-2">{error}</p>
                    {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
                    <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => setReload((value) => value + 1)}
                        disabled={loading || deletingId !== null}
                    >
                        Recargar lista
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </button>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )}

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="admin-toolbar">
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label
                    className="visually-hidden"
                    htmlFor="productSearch"
                >
                    Buscar productos
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>

                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
                <input
                    id="productSearch"
                    className="form-control"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por ID, nombre o autor"
                />
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="admin-table-wrap">
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <table className="table table-hover align-middle mb-0">
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <thead>
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <tr>
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        <th>ID</th>
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        <th>Libro</th>
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        <th>Autor</th>
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        <th>Precio</th>
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        <th>Stock</th>
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        <th>Acciones</th>
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </tr>
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </thead>

                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <tbody>
                    {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
                    {loading ? (
                        // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                        <tr>
                            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                            <td colSpan="6" className="text-center py-4">
                                {/* Nota de lectura: Anuncia carga o confirmación sin tratarla como error. */}
                                <span role="status">Cargando libros…</span>
                            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                            </td>
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        </tr>
                    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                    ) : (
                        // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                        <>
                            {/* Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual. */}
                            {filtered.map((product) => (
                                // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                                <tr key={product.id}>
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    <td>{product.id}</td>
                                    {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                                    <td><Link to={`${base}/productos/${encodeURIComponent(product.id)}`}>{product.name}</Link><small className="d-block text-muted">{product.code || 'Código pendiente'} · {product.category || 'Categoría pendiente'}</small></td>
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    <td>{product.author}</td>
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    <td>
                                        ${Number(product.price).toLocaleString('es-CL')}
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    </td>
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    <td>
                      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                      <span
                          className={
                              // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                              tieneStockBajo(product)
                                  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
                                  ? 'badge text-bg-warning'
                                  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
                                  : 'badge text-bg-success'
                          }
                      >
                        {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
                        {product.stock} {tieneStockBajo(product) ? '(Stock bajo)' : ''}
                      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                      </span>
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    </td>
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    <td>
                                        {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
                                        {!readOnly && <div className="d-flex gap-2">
                                            {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                                            <Link
                                                className="btn btn-sm btn-outline-primary"
                                                to={`/admin/productos/${product.id}/editar`}
                                            >
                                                Editar
                                            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                            </Link>

                                            {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                type="button"
                                                onClick={() => removeProduct(product.id)}
                                                disabled={deletingId !== null}
                                                aria-label={`Eliminar ${product.name}`}
                                            >
                                                {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
                                                {deletingId === product.id
                                                    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
                                                    ? 'Eliminando…'
                                                    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
                                                    : 'Eliminar'}
                                            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                            </button>
                                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                        </div>}
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    </td>
                                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                </tr>
                            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                            ))}

                            {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
                            {!error && filtered.length === 0 && (
                                // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                                <tr>
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    <td colSpan="6" className="text-center py-4">
                                        No se encontraron productos.
                                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                    </td>
                                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                                </tr>
                            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                            )}
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        </>
                    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                    )}
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </tbody>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </table>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </>
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default AdminProducts
