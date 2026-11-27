// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCallback, useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { obtenerSesion } from '../data/usuarios'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { validarUsuario } from './adminApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useAdminResource } from './useAdminResource'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import ProfileFields from '../components/ProfileFields'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { perfilVacio, validarPerfil, datosPerfil, errorPassword, nombresRoles } from '../utils/perfil'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function AccountLoader({ id, editing }) {
  // Se consulta Auth para que ID y rol pertenezcan a la cuenta, no a otra tabla.
  // Nota de lectura: Mantiene estable la función mientras no cambien sus dependencias.
  const cargar = useCallback(async () => validarUsuario(await solicitar(`/auth/users/${encodeURIComponent(id)}`)), [id])
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const { data: user, loading, error, retry } = useAdminResource(cargar)
  // Nota de lectura: Anuncia carga o confirmación sin tratarla como error.
  if (loading) return <p role="status">Cargando usuario…</p>
  // Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla.
  if (error) return <div role="alert" className="alert alert-danger"><p>{error}</p><button className="btn btn-outline-danger" onClick={retry}>Reintentar</button> <Link to="/admin/usuarios">Volver al listado</Link></div>
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (editing) return <AccountEditor key={id} current={user} />
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <div className="admin-heading"><h1>Detalle de usuario</h1></div>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <dl className="admin-form"><dt>Nombre</dt><dd>{user.name}</dd><dt>Correo</dt><dd>{user.email}</dd>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <dt>RUN</dt><dd>{user.run || 'Pendiente de completar'}</dd><dt>Apellidos</dt><dd>{user.lastName || 'Pendiente de completar'}</dd><dt>Fecha de nacimiento</dt><dd>{user.birthDate || 'No indicada'}</dd><dt>Región / comuna</dt><dd>{user.region} / {user.commune}</dd><dt>Dirección</dt><dd>{user.address || 'Pendiente de completar'}</dd><dt>Rol</dt><dd>{nombresRoles[user.role]}</dd></dl>
    {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
    <Link className="btn btn-primary" to={`/admin/usuarios/${id}/editar`}>Editar usuario</Link>{' '}
    {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
    <Link className="btn btn-outline-secondary" to="/admin/usuarios">Volver al listado</Link>
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </>
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function AccountEditor({ current }) {
  // Nota de lectura: Obtiene la función para cambiar de pantalla desde código.
  const navigate = useNavigate()
  // Nota de lectura: Define editing, que se utiliza en las instrucciones siguientes.
  const editing = Boolean(current)
  // La contraseña siempre empieza vacía; el servidor nunca devuelve la contraseña almacenada.
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [form, setForm] = useState({ ...Object.fromEntries(Object.keys(perfilVacio).map(key => [key, current?.[key] ?? ''])), role: current?.role ?? 'CLIENT', password: '', confirm: '' })
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [error, setError] = useState('')
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [errors, setErrors] = useState({})
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [saving, setSaving] = useState(false)
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  const protectedIdentity = editing && (current.email === obtenerSesion()?.email || current.email.toLowerCase() === 'admin@library.cl')
  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function update(event) {
    // Nota de lectura: Actualiza los valores visibles del formulario.
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value, ...(event.target.name === 'region' ? { commune: '' } : {}) }))
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setError('')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  async function submit(event) {
    // Nota de lectura: Evita el envío HTML tradicional para controlar la validación con React.
    event.preventDefault()
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (saving) return
    // Nota de lectura: Define found, que se utiliza en las instrucciones siguientes.
    const found = validarPerfil(form, protectedIdentity)
    // Nota de lectura: Define passwordError, que se utiliza en las instrucciones siguientes.
    const passwordError = errorPassword(form.password, form.confirm, !editing)
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setErrors(found); setError(passwordError)
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (Object.keys(found).length || passwordError) return
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    if (!['ADMIN', 'CLIENT', 'SELLER'].includes(form.role)) return setError('Selecciona un rol válido.')
    // Nota de lectura: Marca la operación en curso para impedir envíos o borrados duplicados.
    setSaving(true)
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setError('')
    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
      // Solo las rutas administrativas aceptan un rol; registro público sigue creando CLIENT.
      // Nota de lectura: Define body, que se utiliza en las instrucciones siguientes.
      const body = { ...datosPerfil(form), role: form.role }
      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (form.password) body.password = form.password
      // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
      const user = await solicitar(editing ? `/auth/users/${encodeURIComponent(current.id)}` : '/auth/users', { method: editing ? 'PUT' : 'POST', body })
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      validarUsuario(user)
      // Nota de lectura: Cambia de pantalla; state transporta un mensaje y replace evita volver al formulario enviado.
      navigate('/admin/usuarios', { replace: true, state: { success: editing ? 'Cuenta actualizada correctamente.' : 'Cuenta creada correctamente.' } })
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    } catch (err) { setError(err.message || 'No se pudo guardar la cuenta.') }
    // Nota de lectura: Marca la operación en curso para impedir envíos o borrados duplicados.
    finally { setSaving(false) }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <div className="admin-heading"><p className="admin-eyebrow">Cuentas</p><h1>{editing ? 'Editar usuario' : 'Nuevo usuario'}</h1><p>Completa los datos y el rol de la cuenta.</p></div>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <form className="admin-form" onSubmit={submit} noValidate aria-busy={saving}>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <fieldset disabled={saving}><legend className="visually-hidden">Datos de la cuenta</legend>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="row g-3">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <ProfileFields form={form} onChange={update} errors={errors} lockedEmail={protectedIdentity} />
          {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
          <div className="col-md-6"><label className="form-label" htmlFor="role">Rol</label><select className="form-select" id="role" name="role" value={form.role} onChange={update} disabled={protectedIdentity}><option value="CLIENT">Cliente</option><option value="ADMIN">Administrador</option><option value="SELLER">Vendedor</option></select></div>
          {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
          <div className="col-md-6"><label className="form-label" htmlFor="password">{editing ? 'Contraseña nueva (opcional)' : 'Contraseña inicial'}</label><input className="form-control" id="password" name="password" type="password" maxLength={10} autoComplete="new-password" value={form.password} onChange={update} /></div>
          {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
          <div className="col-md-6"><label className="form-label" htmlFor="confirm">Confirmar contraseña</label><input className="form-control" id="confirm" name="confirm" type="password" maxLength={10} autoComplete="new-password" value={form.confirm} onChange={update} /></div>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
        {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
        {protectedIdentity && <p className="form-text">Tu cuenta y la administradora principal deben conservar su correo y rol.</p>}
        {/* Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla. */}
        {error && <p className="alert alert-danger mt-3" role="alert">{error}</p>}
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          {/* Nota de lectura: Cambia de pantalla; state transporta un mensaje y replace evita volver al formulario enviado. */}
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/admin/usuarios')}>Cancelar</button>
          {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
          <button className="btn btn-primary" type="submit">{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear usuario'}</button>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </fieldset>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </form>
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </>
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default function AdminUserForm() {
  // Nota de lectura: Obtiene el identificador definido en la URL.
  const { id } = useParams()
  // Nota de lectura: Consulta la ruta y el estado que otra pantalla envió al navegar.
  const location = useLocation()
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return id ? <AccountLoader id={id} editing={location.pathname.endsWith('/editar')} /> : <AccountEditor />
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
