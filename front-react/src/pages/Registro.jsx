// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useNavigate } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import ProfileFields from '../components/ProfileFields'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { perfilVacio, validarPerfil, datosPerfil, errorPassword } from '../utils/perfil'

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default function Registro() {
  // Nota de lectura: Obtiene la función para cambiar de pantalla desde código.
  const navigate = useNavigate()
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [form, setForm] = useState({ ...perfilVacio, password: '', confirm: '' })
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [errors, setErrors] = useState({})
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [error, setError] = useState('')
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [saving, setSaving] = useState(false)
  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function update(event) {
    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const { name, value } = event.target
    // Nota de lectura: Actualiza los valores visibles del formulario.
    setForm(current => ({ ...current, [name]: value, ...(name === 'region' ? { commune: '' } : {}) }))
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setError('')
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setErrors({})
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  async function submit(event) {
    // Nota de lectura: Evita el envío HTML tradicional para controlar la validación con React.
    event.preventDefault()
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (saving) return
    // Nota de lectura: Define found, que se utiliza en las instrucciones siguientes.
    const found = validarPerfil(form)
    // Nota de lectura: Define passwordError, que se utiliza en las instrucciones siguientes.
    const passwordError = errorPassword(form.password, form.confirm, true)
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setErrors(found); setError(passwordError)
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (Object.keys(found).length || passwordError) return
    // Nota de lectura: Marca la operación en curso para impedir envíos o borrados duplicados.
    setSaving(true)
    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
      // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
      await solicitar('/auth/register', { method: 'POST', autenticar: false, body: { ...datosPerfil(form), password: form.password } })
      // Nota de lectura: Cambia de pantalla; state transporta un mensaje y replace evita volver al formulario enviado.
      navigate('/login', { replace: true, state: { registrado: true } })
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    } catch (err) { setError(err.message || 'No se pudo crear la cuenta.') }
    // Nota de lectura: Marca la operación en curso para impedir envíos o borrados duplicados.
    finally { setSaving(false) }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <section className="user-section"><div className="container">
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <h1 className="user-section-title text-center">Crear una cuenta</h1>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <form className="user-form-card" onSubmit={submit} noValidate>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <fieldset disabled={saving}><legend className="visually-hidden">Datos de registro</legend>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="row g-3"><ProfileFields form={form} onChange={update} errors={errors} />
          {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
          <div className="col-md-6"><label htmlFor="registerPassword" className="form-label">Contraseña</label>
            {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
            <input id="registerPassword" name="password" type="password" className="form-control" value={form.password} onChange={update} autoComplete="new-password" maxLength={10} />
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <p className="form-text">Entre 4 y 10 caracteres.</p></div>
          {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
          <div className="col-md-6"><label htmlFor="registerConfirm" className="form-label">Confirmar contraseña</label>
            {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
            <input id="registerConfirm" name="confirm" type="password" className="form-control" value={form.confirm} onChange={update} autoComplete="new-password" maxLength={10} /></div>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
        {/* Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla. */}
        {error && <p role="alert" className="alert alert-danger mt-3">{error}</p>}
        {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
        <button className="btn user-btn mt-3" type="submit">{saving ? 'Creando cuenta…' : 'Crear cuenta'}</button>
      {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
      </fieldset><p className="mt-3">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </form></div></section>
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
