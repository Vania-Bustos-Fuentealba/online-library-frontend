import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { solicitar } from '../services/api'
import { obtenerSesion } from '../data/usuarios'
import { cargarUsuarios } from './adminApi'
import { useAdminResource } from './useAdminResource'

export default function AdminUsers() {
  const { data: users, loading, error, retry } = useAdminResource(cargarUsuarios)
  const [query, setQuery] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [actionError, setActionError] = useState('')
  const location = useLocation()
  const [success, setSuccess] = useState(location.state?.success ?? '')
  const email = obtenerSesion()?.email
  const filtered = (users ?? []).filter((user) =>
    `${user.id} ${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.trim().toLowerCase()))

  async function remove(user) {
    if (deleting !== null || !window.confirm(`¿Eliminar la cuenta de ${user.name} y su perfil?`)) return
    setDeleting(user.id)
    setActionError('')
    setSuccess('')
    try {
      // Ahora el listado y la eliminación utilizan el mismo ID de Auth.
      await solicitar(`/auth/users/${encodeURIComponent(user.id)}`, { method: 'DELETE' })
      setSuccess('Cuenta eliminada correctamente.')
      retry()
    } catch (err) { setActionError(err.message) }
    finally { setDeleting(null) }
  }

  return <>
    <div className="admin-heading admin-heading-row">
      <div><p className="admin-eyebrow">Cuentas</p><h1>Usuarios</h1><p>Administra las cuentas y sus permisos.</p></div>
      <Link className="btn btn-primary" to="/admin/usuarios/nuevo">Nuevo usuario</Link>
    </div>
    {success && <p className="alert alert-success" role="status">{success}</p>}
    {actionError && <p className="alert alert-danger" role="alert">{actionError}</p>}
    <div className="admin-toolbar">
      <label className="visually-hidden" htmlFor="userSearch">Buscar usuarios</label>
      <input id="userSearch" className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por ID, nombre, correo o rol" />
    </div>
    {loading && <p role="status">Cargando usuarios…</p>}
    {error && <div className="alert alert-danger" role="alert"><p>{error}</p><button className="btn btn-outline-danger" onClick={retry}>Reintentar</button></div>}
    {!loading && !error && <div className="admin-table-wrap"><table className="table table-hover align-middle mb-0">
      <thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
      <tbody>{filtered.map((user) => <tr key={user.id}>
        <td>{user.id}</td><td><Link to={`/admin/usuarios/${encodeURIComponent(user.id)}`}>{user.name}</Link></td><td>{user.email}</td>
        <td>{user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</td>
        <td><div className="d-flex gap-2">
          <Link className="btn btn-sm btn-outline-primary" to={`/admin/usuarios/${encodeURIComponent(user.id)}/editar`}>Editar {user.name}</Link>
          <button className="btn btn-sm btn-outline-danger" onClick={() => remove(user)} disabled={deleting !== null || user.email === email || user.email.toLowerCase() === 'admin@library.cl'} aria-label={`Eliminar ${user.name}`}>
            {deleting === user.id ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div></td>
      </tr>)}
      {filtered.length === 0 && <tr><td colSpan="5">No se encontraron usuarios.</td></tr>}</tbody>
    </table></div>}
  </>
}
