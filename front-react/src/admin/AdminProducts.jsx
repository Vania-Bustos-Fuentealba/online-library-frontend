import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { solicitar } from '../services/api'

function AdminProducts() {
    const [products, setProducts] = useState([])
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deletingId, setDeletingId] = useState(null)
    const [reload, setReload] = useState(0)

    useEffect(() => {
        let active = true

        async function loadProducts() {
            setLoading(true)
            setError('')

            try {
                const data = await solicitar('/books')

                if (!Array.isArray(data)) {
                    throw new Error('El servidor devolvió una lista de libros inválida.')
                }

                const books = data.map((book) => ({
                    id: book.id,
                    name: book.title,
                    author: book.author,
                    price: book.price,
                    stock: book.stock,
                }))

                if (active) {
                    setProducts(books)
                }
            } catch (err) {
                if (active) {
                    setError(err.message || 'No se pudieron cargar los libros.')
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        loadProducts()

        return () => {
            active = false
        }
    }, [reload])

    async function removeProduct(id) {
        if (deletingId !== null) return

        const product = products.find((item) => item.id === id)

        if (
            !window.confirm(
                `¿Eliminar ${product?.name ?? 'este libro'} del catálogo?`
            )
        ) {
            return
        }

        setDeletingId(id)
        setError('')

        try {
            await solicitar(`/books/${encodeURIComponent(id)}`, {
                method: 'DELETE',
            })

            setProducts((current) =>
                current.filter((item) => item.id !== id)
            )
        } catch (err) {
            setError(err.message || 'No se pudo eliminar el libro.')
        } finally {
            setDeletingId(null)
        }
    }

    const filtered = products.filter((product) =>
        `${product.id} ${product.name ?? ''} ${product.author ?? ''}`
            .toLowerCase()
            .includes(query.trim().toLowerCase())
    )

    return (
        <>
            <div className="admin-heading admin-heading-row">
                <div>
                    <p className="admin-eyebrow">Catálogo</p>
                    <h1>Productos</h1>
                    <p>Gestiona los libros disponibles en la tienda.</p>
                </div>

                <Link
                    className="btn btn-primary"
                    to="/admin/productos/nuevo"
                >
                    Nuevo producto
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <p className="mb-2">{error}</p>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => setReload((value) => value + 1)}
                        disabled={loading || deletingId !== null}
                    >
                        Recargar lista
                    </button>
                </div>
            )}

            <div className="admin-toolbar">
                <label
                    className="visually-hidden"
                    htmlFor="productSearch"
                >
                    Buscar productos
                </label>

                <input
                    id="productSearch"
                    className="form-control"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por ID, nombre o autor"
                />
            </div>

            <div className="admin-table-wrap">
                <table className="table table-hover align-middle mb-0">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Libro</th>
                        <th>Autor</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4">
                                Cargando libros…
                            </td>
                        </tr>
                    ) : (
                        <>
                            {filtered.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.author}</td>
                                    <td>
                                        ${Number(product.price).toLocaleString('es-CL')}
                                    </td>
                                    <td>
                      <span
                          className={
                              Number(product.stock) <= 5
                                  ? 'badge text-bg-warning'
                                  : 'badge text-bg-success'
                          }
                      >
                        {product.stock}
                      </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link
                                                className="btn btn-sm btn-outline-primary"
                                                to={`/admin/productos/${product.id}/editar`}
                                            >
                                                Editar
                                            </Link>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                type="button"
                                                onClick={() => removeProduct(product.id)}
                                                disabled={deletingId !== null}
                                                aria-label={`Eliminar ${product.name}`}
                                            >
                                                {deletingId === product.id
                                                    ? 'Eliminando…'
                                                    : 'Eliminar'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!error && filtered.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            )}
                        </>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AdminProducts