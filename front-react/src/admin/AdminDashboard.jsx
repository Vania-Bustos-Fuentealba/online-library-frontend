import { Link } from 'react-router-dom'
import { cargarLibros, cargarUsuarios, STOCK_BAJO, tieneStockBajo } from './adminApi'
import { useAdminResource } from './useAdminResource'

function Indicador({ titulo, recurso, valor }) {
  return <article>
    <span>{titulo}</span>
    {recurso.loading ? <p role="status">Cargando…</p> : recurso.error ?
      <div role="alert"><p>{recurso.error}</p><button className="btn btn-outline-danger" onClick={recurso.retry}>Reintentar {titulo.toLowerCase()}</button></div> :
      <strong>{valor(recurso.data)}</strong>}
  </article>
}

function AdminDashboard() {
  // Consultas independientes: un fallo de usuarios no oculta los libros disponibles.
  const books = useAdminResource(cargarLibros)
  const users = useAdminResource(cargarUsuarios)
  return <>
    <div className="admin-heading"><p className="admin-eyebrow">Panel de control</p><h1>Resumen</h1><p>Administra el catálogo y las cuentas de la biblioteca.</p></div>
    <section className="admin-stats" aria-label="Indicadores">
      <Indicador titulo="Productos" recurso={books} valor={(items) => items.length} />
      <Indicador titulo="Usuarios" recurso={users} valor={(items) => items.length} />
      <Indicador titulo="Stock bajo" recurso={books} valor={(items) => items.filter(tieneStockBajo).length} />
    </section>
    <p>Stock bajo: {STOCK_BAJO} unidades o menos, según las existencias del catálogo.</p>
    <section className="admin-shortcuts">
      <article><h2>Catálogo</h2><p>Agrega libros, actualiza sus datos y revisa el stock disponible.</p><Link className="btn btn-primary" to="/admin/productos">Gestionar productos</Link></article>
      <article><h2>Usuarios</h2><p>Consulta las cuentas y administra sus datos y roles.</p><Link className="btn btn-primary" to="/admin/usuarios">Gestionar usuarios</Link></article>
    </section>
  </>
}
export default AdminDashboard
