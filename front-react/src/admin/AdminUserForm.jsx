import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { actualizarUsuario, crearUsuario, obtenerUsuarios, obtenerUsuarioPorId } from '../data/usuarios'
import { regiones } from '../data/regiones'
import { validarEmail, validarRun } from '../utils/validaciones'

const emptyUser = { run: '', nombre: '', apellidos: '', email: '', fechaNacimiento: '', region: '', comuna: '', direccion: '', rol: 'cliente', password: '' }

function AdminUserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const current = id ? obtenerUsuarioPorId(id) : null
  const [form, setForm] = useState(current ?? emptyUser)
  const [error, setError] = useState('')
  const isEditing = Boolean(id)

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function submit(event) {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    const run = form.run.trim().toUpperCase().replace(/\s/g, '')
    const duplicate = obtenerUsuarios().some((user) => user.id !== current?.id && (user.run === run || user.email.toLowerCase() === email))
    if (!validarRun(run) || !form.nombre.trim() || !form.apellidos.trim() || !validarEmail(email) || !form.region || !form.comuna || !form.direccion.trim() || (!isEditing && form.password.length < 4) || duplicate) {
      setError(duplicate ? 'Ya existe una cuenta con ese RUN o correo.' : 'Revisa los datos: el RUN, correo, región y comuna deben ser válidos; los campos obligatorios no pueden quedar vacíos.')
      return
    }
    const changes = { ...form, run, nombre: form.nombre.trim(), apellidos: form.apellidos.trim(), email, direccion: form.direccion.trim() }
    try {
      if (isEditing) actualizarUsuario(id, changes)
      else crearUsuario(changes)
    } catch (saveError) {
      setError(saveError.message)
      return
    }
    navigate('/admin/usuarios')
  }

  if (isEditing && !current) return <div className="alert alert-warning">No se encontró el usuario. <Link to="/admin/usuarios">Volver al listado</Link></div>

  return <>
    <div className="admin-heading"><p className="admin-eyebrow">Cuentas</p><h1>{isEditing ? 'Editar usuario' : 'Nuevo usuario'}</h1><p>Completa los datos de la cuenta.</p></div>
    <form className="admin-form" onSubmit={submit} noValidate><div className="row g-3">
      <div className="col-md-6"><label className="form-label" htmlFor="run">RUN</label><input className="form-control" id="run" name="run" maxLength="12" value={form.run} onChange={update} /></div>
      <div className="col-md-6"><label className="form-label" htmlFor="email">Correo</label><input className="form-control" type="email" id="email" name="email" maxLength="100" value={form.email} onChange={update} /></div>
      <div className="col-md-6"><label className="form-label" htmlFor="nombre">Nombre</label><input className="form-control" id="nombre" name="nombre" maxLength="50" value={form.nombre} onChange={update} /></div>
      <div className="col-md-6"><label className="form-label" htmlFor="apellidos">Apellidos</label><input className="form-control" id="apellidos" name="apellidos" maxLength="100" value={form.apellidos} onChange={update} /></div>
      <div className="col-md-6"><label className="form-label" htmlFor="fechaNacimiento">Fecha de nacimiento</label><input className="form-control" type="date" id="fechaNacimiento" name="fechaNacimiento" value={form.fechaNacimiento} onChange={update} /></div>
      <div className="col-md-6"><label className="form-label" htmlFor="rol">Tipo de usuario</label><select className="form-select" id="rol" name="rol" value={form.rol} onChange={update}>{[['cliente', 'Cliente'], ['vendedor', 'Vendedor'], ['admin', 'Administrador']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <div className="col-md-6"><label className="form-label" htmlFor="region">Región</label><select className="form-select" id="region" name="region" value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value, comuna: '' })}><option value="">Selecciona una región</option>{Object.keys(regiones).map((region) => <option key={region}>{region}</option>)}</select></div>
      <div className="col-md-6"><label className="form-label" htmlFor="comuna">Comuna</label><select className="form-select" id="comuna" name="comuna" value={form.comuna} onChange={update} disabled={!form.region}><option value="">Selecciona una comuna</option>{(regiones[form.region] ?? []).map((comuna) => <option key={comuna}>{comuna}</option>)}</select></div>
      <div className="col-12"><label className="form-label" htmlFor="direccion">Dirección</label><input className="form-control" id="direccion" name="direccion" maxLength="300" value={form.direccion} onChange={update} /></div>
      {!isEditing && <div className="col-md-6"><label className="form-label" htmlFor="password">Contraseña inicial</label><input className="form-control" type="password" id="password" name="password" minLength="4" maxLength="10" value={form.password} onChange={update} /><div className="form-text">Entre 4 y 10 caracteres.</div></div>}
    </div>
    {error && <p className="alert alert-danger mt-3" role="alert">{error}</p>}
    <div className="d-flex justify-content-end gap-2 mt-4"><Link className="btn btn-outline-secondary" to="/admin/usuarios">Cancelar</Link><button className="btn btn-primary" type="submit">{isEditing ? 'Guardar cambios' : 'Crear usuario'}</button></div>
    </form>
  </>
}

export default AdminUserForm
