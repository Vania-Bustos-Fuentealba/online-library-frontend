import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cerrarSesion, obtenerSesion } from '../data/usuarios'
import './admin.css'

function AdminLayout() {
  const navigate = useNavigate()
  const sesion = obtenerSesion()
  if (sesion?.rol !== 'admin') return <Navigate to="/login" replace />

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link className="admin-brand" to="/admin">Online Library <span>Administración</span></Link>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-light btn-sm" to="/blog">Volver al sitio</Link>
          <button className="btn btn-light btn-sm" type="button" onClick={() => { cerrarSesion(); navigate('/login') }}>Cerrar sesión</button>
        </div>
      </header>
      <div className="admin-frame">
        <aside className="admin-nav" aria-label="Navegación de administración">
          <NavLink end to="/admin">Resumen</NavLink>
          <NavLink to="/admin/productos">Productos</NavLink>
          <NavLink to="/admin/usuarios">Usuarios</NavLink>
        </aside>
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  )
}

export default AdminLayout
