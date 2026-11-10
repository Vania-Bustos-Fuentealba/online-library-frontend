import { Link } from 'react-router-dom'
import { getProducts } from './adminData'
import { obtenerUsuarios } from '../data/usuarios'

function AdminDashboard() {
  const products = getProducts()
  const users = obtenerUsuarios()
  const lowStock = products.filter((product) => Number(product.stock) <= Number(product.criticalStock ?? 5)).length

  return (
    <>
      <div className="admin-heading">
        <div><p className="admin-eyebrow">Panel de control</p><h1>Resumen</h1><p>Administra el catálogo y las cuentas de la biblioteca.</p></div>
      </div>
      <section className="admin-stats" aria-label="Indicadores">
        <article><span>Productos</span><strong>{products.length}</strong></article>
        <article><span>Usuarios</span><strong>{users.length}</strong></article>
        <article><span>Stock bajo</span><strong>{lowStock}</strong></article>
      </section>
      <section className="admin-shortcuts">
        <article><h2>Catálogo</h2><p>Agrega libros, actualiza sus datos y revisa el stock disponible.</p><Link className="btn btn-primary" to="/admin/productos">Gestionar productos</Link></article>
        <article><h2>Usuarios</h2><p>Consulta las cuentas y administra sus datos y roles.</p><Link className="btn btn-primary" to="/admin/usuarios">Gestionar usuarios</Link></article>
      </section>
    </>
  )
}

export default AdminDashboard
