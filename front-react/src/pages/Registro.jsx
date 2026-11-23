import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CampoFormulario from '../components/CampoFormulario'
import { solicitar } from '../services/api'

function Registro() {
  const navigate = useNavigate()

  const [valores, setValores] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: '',
  })

  const [intento, setIntento] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const validos = {
    nombre:
        valores.nombre.trim().length >= 2 &&
        valores.nombre.trim().length <= 100,
    email:
        valores.email.trim().length <= 100 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim()),
    password:
        valores.password.length >= 6 &&
        valores.password.length <= 100,
    confirmar:
        valores.confirmar !== '' &&
        valores.confirmar === valores.password,
  }

  function claseCampo(nombre) {
    if (!intento && valores[nombre] === '') return ''
    return validos[nombre] ? 'is-valid' : 'is-invalid'
  }

  function handleChange(evento) {
    const { name, value } = evento.target

    setValores((anteriores) => ({
      ...anteriores,
      [name]: value,
    }))

    setError('')
  }

  async function handleSubmit(evento) {
    evento.preventDefault()

    if (cargando) return

    setIntento(true)
    setError('')

    if (!Object.values(validos).every(Boolean)) return

    setCargando(true)

    try {
      await solicitar('/auth/register', {
        method: 'POST',
        autenticar: false,
        body: {
          name: valores.nombre.trim(),
          email: valores.email.trim().toLowerCase(),
          password: valores.password,
        },
      })

      navigate('/login', {
        replace: true,
        state: { registrado: true },
      })
    } catch (err) {
      setError(err.message || 'No se pudo crear la cuenta.')
    } finally {
      setCargando(false)
    }
  }

  return (
      <section className="user-section">
        <div className="container">
          <div className="text-center mb-4">
            <h1 className="user-section-title">
              Crear una cuenta
            </h1>
            <p className="user-section-description">
              Regístrate en Online Library.
            </p>
          </div>

          <div className="user-form-card">
            {error && (
                <div
                    className="user-alert user-alert-error"
                    role="alert"
                >
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <fieldset disabled={cargando}>
                <legend className="visually-hidden">
                  Datos de registro
                </legend>

                <CampoFormulario
                    id="registerName"
                    label="Nombre completo"
                    mensajeError="Ingresa entre 2 y 100 caracteres."
                >
                  <input
                      type="text"
                      className={`form-control ${claseCampo('nombre')}`}
                      id="registerName"
                      name="nombre"
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                      value={valores.nombre}
                      onChange={handleChange}
                      required
                  />
                </CampoFormulario>

                <CampoFormulario
                    id="registerEmail"
                    label="Correo electrónico"
                    mensajeError="Ingresa un correo electrónico válido."
                >
                  <input
                      type="email"
                      className={`form-control ${claseCampo('email')}`}
                      id="registerEmail"
                      name="email"
                      maxLength={100}
                      autoComplete="email"
                      value={valores.email}
                      onChange={handleChange}
                      required
                  />
                </CampoFormulario>

                <CampoFormulario
                    id="registerPassword"
                    label="Contraseña"
                    mensajeError="La contraseña debe tener entre 6 y 100 caracteres."
                >
                  <input
                      type="password"
                      className={`form-control ${claseCampo('password')}`}
                      id="registerPassword"
                      name="password"
                      minLength={6}
                      maxLength={100}
                      autoComplete="new-password"
                      value={valores.password}
                      onChange={handleChange}
                      required
                  />
                </CampoFormulario>

                <CampoFormulario
                    id="registerPasswordConfirm"
                    label="Confirmar contraseña"
                    mensajeError="Las contraseñas deben coincidir."
                >
                  <input
                      type="password"
                      className={`form-control ${claseCampo('confirmar')}`}
                      id="registerPasswordConfirm"
                      name="confirmar"
                      minLength={6}
                      maxLength={100}
                      autoComplete="new-password"
                      value={valores.confirmar}
                      onChange={handleChange}
                      required
                  />
                </CampoFormulario>

                <div className="d-grid mt-4">
                  <button type="submit" className="btn user-btn">
                    {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
                  </button>
                </div>
              </fieldset>

              <p className="text-center mt-4 mb-0">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login">Inicia sesión</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
  )
}

export default Registro
