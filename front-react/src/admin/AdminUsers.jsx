import { useState } from 'react'
import { Link } from 'react-router-dom'
import { eliminarUsuario, obtenerUsuarios } from '../data/usuarios'

function AdminUsers() {
  const [users, setUsers] = useState(obtenerUsuarios)
  const [query, setQuery] = useState('')

  function removeUser(id) {
    if (!window.confirm('¿Eliminar esta cuenta de usuario?')) return
    eliminarUsuario(id)
    setUsers(obtenerUsuarios())
  }

  const filtered = users.filter((user) => `${user.run} ${user.nombre} ${user.apellidos} ${user.email}`.toLowerCase().includes(query.toLowerCase()))

  return <>
    <div className="admin-heading admin-heading-row"><div><p className="admin-eyebrow">Cuentas</p><h1>Usuarios</h1><p>Consulta y administra las cuentas de la plataforma.</p></div><Link className="btn btn-primary" to="/admin/usuarios/nuevo">Nuevo usuario</Link></div>
    <div className="admin-toolbar"><label className="visually-hidden" htmlFor="userSearch">Buscar usuarios</label><input id="userSearch" className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por RUN, nombre o correo" /></div>
    <div className="admin-table-wrap"><table className="table table-hover align-middle mb-0"><thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th>Acciones</th></tr></thead><tbody>
      {filtered.map((user) => <tr key={user.id}><td>{user.run}</td><td>{user.nombre} {user.apellidos}</td><td>{user.email}</td><td>{user.rol}</td><td><div className="d-flex gap-2"><Link className="btn btn-sm btn-outline-primary" to={`/admin/usuarios/${user.id}/editar`}>Editar</Link><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeUser(user.id)} aria-label={`Eliminar ${user.nombre} ${user.apellidos}`}>Eliminar</button></div></td></tr>)}
      {filtered.length === 0 && <tr><td colSpan="5" className="text-center py-4">No se encontraron usuarios.</td></tr>}
    </tbody></table></div>
  </>
}

export default AdminUsers
