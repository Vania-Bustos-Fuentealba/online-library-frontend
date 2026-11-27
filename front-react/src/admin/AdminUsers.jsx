// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useLocation } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { obtenerSesion } from '../data/usuarios'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cargarUsuarios } from './adminApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useAdminResource } from './useAdminResource'

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default function AdminUsers() {
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const { data: users, loading, error, retry } = useAdminResource(cargarUsuarios)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [query, setQuery] = useState('')
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [deleting, setDeleting] = useState(null)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [actionError, setActionError] = useState('')
  // Nota de lectura: Consulta la ruta y el estado que otra pantalla envió al navegar.
  const location = useLocation()
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [success, setSuccess] = useState(location.state?.success ?? '')
  // Nota de lectura: Define email, que se utiliza en las instrucciones siguientes.
  const email = obtenerSesion()?.email
  // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
  const filtered = (users ?? []).filter((user) =>
    // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
    `${user.id} ${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.trim().toLowerCase()))

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  async function remove(user) {
    // Nota de lectura: Solicita confirmación de eliminación antes de enviar una petición destructiva.
    if (deleting !== null || !window.confirm(`¿Eliminar la cuenta de ${user.name} y su perfil?`)) return
    // Nota de lectura: Marca la operación en curso para impedir envíos o borrados duplicados.
    setDeleting(user.id)
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setActionError('')
    // Nota de lectura: Muestra una confirmación solo después de una respuesta satisfactoria.
    setSuccess('')
    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
      // Ahora el listado y la eliminación utilizan el mismo ID de Auth.
      // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
      await solicitar(`/auth/users/${encodeURIComponent(user.id)}`, { method: 'DELETE' })
      // Nota de lectura: Muestra una confirmación solo después de una respuesta satisfactoria.
      setSuccess('Cuenta eliminada correctamente.')
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      retry()
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    } catch (err) { setActionError(err.message) }
    // Nota de lectura: Marca la operación en curso para impedir envíos o borrados duplicados.
    finally { setDeleting(null) }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <div className="admin-heading admin-heading-row">
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div><p className="admin-eyebrow">Cuentas</p><h1>Usuarios</h1><p>Administra las cuentas y sus permisos.</p></div>
      {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
      <Link className="btn btn-primary" to="/admin/usuarios/nuevo">Nuevo usuario</Link>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </div>
    {/* Nota de lectura: Anuncia carga o confirmación sin tratarla como error. */}
    {success && <p className="alert alert-success" role="status">{success}</p>}
    {/* Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla. */}
    {actionError && <p className="alert alert-danger" role="alert">{actionError}</p>}
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <div className="admin-toolbar">
      {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
      <label className="visually-hidden" htmlFor="userSearch">Buscar usuarios</label>
      {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
      <input id="userSearch" className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por ID, nombre, correo o rol" />
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </div>
    {/* Nota de lectura: Anuncia carga o confirmación sin tratarla como error. */}
    {loading && <p role="status">Cargando usuarios…</p>}
    {/* Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla. */}
    {error && <div className="alert alert-danger" role="alert"><p>{error}</p><button className="btn btn-outline-danger" onClick={retry}>Reintentar</button></div>}
    {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
    {!loading && !error && <div className="admin-table-wrap"><table className="table table-hover align-middle mb-0">
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <tbody>{filtered.map((user) => <tr key={user.id}>
        {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
        <td>{user.id}</td><td><Link to={`/admin/usuarios/${encodeURIComponent(user.id)}`}>{user.name}</Link></td><td>{user.email}</td>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <td>{user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</td>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <td><div className="d-flex gap-2">
          {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
          <Link className="btn btn-sm btn-outline-primary" to={`/admin/usuarios/${encodeURIComponent(user.id)}/editar`}>Editar {user.name}</Link>
          {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
          <button className="btn btn-sm btn-outline-danger" onClick={() => remove(user)} disabled={deleting !== null || user.email === email || user.email.toLowerCase() === 'admin@library.cl'} aria-label={`Eliminar ${user.name}`}>
            {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
            {deleting === user.id ? 'Eliminando…' : 'Eliminar'}
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </button>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div></td>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </tr>)}
      {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
      {filtered.length === 0 && <tr><td colSpan="5">No se encontraron usuarios.</td></tr>}</tbody>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </table></div>}
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </>
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
