import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { solicitar } from '../services/api'
import { obtenerSesion } from '../data/usuarios'
import { validarUsuario } from './adminApi'
import { useAdminResource } from './useAdminResource'

function AccountLoader({ id, editing }) {
  // Se consulta Auth para que ID y rol pertenezcan a la cuenta, no a otra tabla.
  const cargar = useCallback(async () => validarUsuario(await solicitar(`/auth/users/${encodeURIComponent(id)}`)), [id])
  const { data: user, loading, error, retry } = useAdminResource(cargar)
  if (loading) return <p role="status">Cargando usuario…</p>
  if (error) return <div role="alert" className="alert alert-danger"><p>{error}</p><button className="btn btn-outline-danger" onClick={retry}>Reintentar</button> <Link to="/admin/usuarios">Volver al listado</Link></div>
  if (editing) return <AccountEditor key={id} current={user} />
  return <>
    <div className="admin-heading"><h1>Detalle de usuario</h1></div>
    <dl className="admin-form"><dt>Nombre</dt><dd>{user.name}</dd><dt>Correo</dt><dd>{user.email}</dd>
      <dt>Rol</dt><dd>{user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</dd></dl>
    <Link className="btn btn-primary" to={`/admin/usuarios/${id}/editar`}>Editar usuario</Link>{' '}
    <Link className="btn btn-outline-secondary" to="/admin/usuarios">Volver al listado</Link>
  </>
}

function AccountEditor({ current }) {
  const navigate = useNavigate()
  const editing = Boolean(current)
  // La contraseña siempre empieza vacía; el servidor nunca devuelve la contraseña almacenada.
  const [form, setForm] = useState({ name: current?.name ?? '', email: current?.email ?? '', role: current?.role ?? 'CLIENT', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const protectedIdentity = editing && (current.email === obtenerSesion()?.email || current.email.toLowerCase() === 'admin@library.cl')
  function update(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
    setError('')
  }
  async function submit(event) {
    event.preventDefault()
    if (saving) return
    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    if (name.length < 2 || name.length > 100) return setError('El nombre debe tener entre 2 y 100 caracteres.')
    if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Ingresa un correo válido de hasta 100 caracteres.')
    if ((!editing || form.password) && (form.password.length < 6 || form.password.length > 100)) return setError('La contraseña debe tener entre 6 y 100 caracteres.')
    if (form.password !== form.confirm) return setError('Las contraseñas deben coincidir.')
    if (new TextEncoder().encode(form.password).length > 72) return setError('La contraseña supera los 72 bytes permitidos; usa una más corta.')
    if (!['ADMIN', 'CLIENT'].includes(form.role)) return setError('Selecciona un rol válido.')
    setSaving(true)
    setError('')
    try {
      // Solo las rutas administrativas aceptan un rol; registro público sigue creando CLIENT.
      const body = { name, email, role: form.role }
      if (form.password) body.password = form.password
      const user = await solicitar(editing ? `/auth/users/${encodeURIComponent(current.id)}` : '/auth/users', { method: editing ? 'PUT' : 'POST', body })
      validarUsuario(user)
      navigate('/admin/usuarios', { replace: true, state: { success: editing ? 'Cuenta actualizada correctamente.' : 'Cuenta creada correctamente.' } })
    } catch (err) { setError(err.message || 'No se pudo guardar la cuenta.') }
    finally { setSaving(false) }
  }
  return <>
    <div className="admin-heading"><p className="admin-eyebrow">Cuentas</p><h1>{editing ? 'Editar usuario' : 'Nuevo usuario'}</h1><p>Completa los datos y el rol de la cuenta.</p></div>
    <form className="admin-form" onSubmit={submit} noValidate aria-busy={saving}>
      <fieldset disabled={saving}><legend className="visually-hidden">Datos de la cuenta</legend>
        <div className="row g-3">
          <div className="col-md-6"><label className="form-label" htmlFor="name">Nombre completo</label><input className="form-control" id="name" name="name" maxLength={100} value={form.name} onChange={update} required /></div>
          <div className="col-md-6"><label className="form-label" htmlFor="email">Correo</label><input className="form-control" type="email" id="email" name="email" maxLength={100} value={form.email} onChange={update} disabled={protectedIdentity} required /></div>
          <div className="col-md-6"><label className="form-label" htmlFor="role">Rol</label><select className="form-select" id="role" name="role" value={form.role} onChange={update} disabled={protectedIdentity}><option value="CLIENT">Cliente</option><option value="ADMIN">Administrador</option></select></div>
          <div className="col-md-6"><label className="form-label" htmlFor="password">{editing ? 'Contraseña nueva (opcional)' : 'Contraseña inicial'}</label><input className="form-control" id="password" name="password" type="password" maxLength={100} autoComplete="new-password" value={form.password} onChange={update} /></div>
          <div className="col-md-6"><label className="form-label" htmlFor="confirm">Confirmar contraseña</label><input className="form-control" id="confirm" name="confirm" type="password" maxLength={100} autoComplete="new-password" value={form.confirm} onChange={update} /></div>
        </div>
        {protectedIdentity && <p className="form-text">Tu cuenta y la administradora principal deben conservar su correo y rol.</p>}
        {error && <p className="alert alert-danger mt-3" role="alert">{error}</p>}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/admin/usuarios')}>Cancelar</button>
          <button className="btn btn-primary" type="submit">{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear usuario'}</button>
        </div>
      </fieldset>
    </form>
  </>
}

export default function AdminUserForm() {
  const { id } = useParams()
  const location = useLocation()
  return id ? <AccountLoader id={id} editing={location.pathname.endsWith('/editar')} /> : <AccountEditor />
}
