import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, saveProducts } from './adminData'

function AdminProducts() {
  const [products, setProducts] = useState(getProducts)
  const [query, setQuery] = useState('')

  function removeProduct(id) {
    const product = products.find((item) => item.id === id)
    if (!window.confirm(`¿Eliminar ${product?.name ?? 'este libro'} del catálogo?`)) return
    const updated = products.filter((product) => product.id !== id)
    saveProducts(updated)
    setProducts(updated)
  }

  const filtered = products.filter((product) => `${product.code} ${product.name} ${product.author} ${product.category}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <div className="admin-heading admin-heading-row">
        <div><p className="admin-eyebrow">Catálogo</p><h1>Productos</h1><p>Gestiona los libros disponibles en la tienda.</p></div>
        <Link className="btn btn-primary" to="/admin/productos/nuevo">Nuevo producto</Link>
      </div>
      <div className="admin-toolbar"><label className="visually-hidden" htmlFor="productSearch">Buscar productos</label><input id="productSearch" className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, código o categoría" /></div>
      <div className="admin-table-wrap"><table className="table table-hover align-middle mb-0"><thead><tr><th>Código</th><th>Libro</th><th>Autor</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>
        {filtered.map((product) => <tr key={product.id}><td>{product.code}</td><td>{product.name}</td><td>{product.author}</td><td>{product.category}</td><td>${Number(product.price).toLocaleString('es-CL')}</td><td><span className={Number(product.stock) <= Number(product.criticalStock ?? 5) ? 'badge text-bg-warning' : 'badge text-bg-success'}>{product.stock}</span></td><td><div className="d-flex gap-2"><Link className="btn btn-sm btn-outline-primary" to={`/admin/productos/${product.id}/editar`}>Editar</Link><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeProduct(product.id)} aria-label={`Eliminar ${product.name}`}>Eliminar</button></div></td></tr>)}
        {filtered.length === 0 && <tr><td colSpan="7" className="text-center py-4">No se encontraron productos.</td></tr>}
      </tbody></table></div>
    </>
  )
}

export default AdminProducts
