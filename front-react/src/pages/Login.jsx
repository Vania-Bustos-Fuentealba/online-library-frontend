import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { iniciarSesion } from '../data/usuarios'
import { solicitar } from '../services/api'

function Login() {
  const location = useLocation()
  const navigate = useNavigate()

  const [valores, setValores] = useState({ email: '', password: '' })
  const [intento, setIntento] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const validos = {
    email:
        valores.email.trim().length <= 100 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim()),
    password:
        valores.password.length > 0 &&
        valores.password.length <= 100,
  }

  const claseCampo = (nombre) => {
    if (!intento && valores[nombre] === '') return ''
    return validos[nombre] ? 'is-valid' : 'is-invalid'
  }

  const handleChange = (evento) => {
    const { name, value } = evento.target
    setValores((anterior) => ({ ...anterior, [name]: value }))
    setError('')
  }

  const handleSubmit = async (evento) => {
    evento.preventDefault()

    if (cargando) return

    setIntento(true)
    setError('')

    if (!validos.email || !validos.password) {
      return
    }

    setCargando(true)

    try {
      const datos = await solicitar('/auth/login', {
        method: 'POST',
        body: {
          email: valores.email.trim().toLowerCase(),
          password: valores.password,
        },
      })

      if (!datos?.token) {
        throw new Error('El servidor no devolvió un token de acceso.')
      }

      if (!['ADMIN', 'CLIENT'].includes(datos.role)) {
        throw new Error('El servidor devolvió un rol no reconocido.')
      }

      const usuario = {
        email: datos.email,
        rol: datos.role === 'ADMIN' ? 'admin' : 'cliente',
      }

      localStorage.setItem('token', datos.token)
      iniciarSesion(usuario)

      navigate(
          usuario.rol === 'admin' ? '/admin' : '/productos',
          { replace: true }
      )
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setCargando(false)
    }
  }

  return (
      <section className="user-section">
        <div className="container">
          <div className="text-center mb-4">
            <h1 className="user-section-title">Iniciar sesión</h1>
            <p className="user-section-description">
              Ingresa a tu cuenta de Online Library.
            </p>
          </div>

          <div className="user-form-card">
            {location.state?.registrado && (
                <div className="user-alert user-alert-success">
                  Cuenta creada correctamente. Ya puedes iniciar sesión.
                </div>
            )}

            {error && (
                <div className="user-alert user-alert-error" role="alert">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label">
                  Correo electrónico
                </label>
                <input
                    type="email"
                    className={`form-control ${claseCampo('email')}`}
                    id="loginEmail"
                    name="email"
                    maxLength={100}
                    placeholder="ejemplo@gmail.com"
                    autoComplete="email"
                    value={valores.email}
                    onChange={handleChange}
                    disabled={cargando}
                    required
                />
                <div className="invalid-feedback">
                  Ingresa un correo electrónico válido.
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="loginPassword" className="form-label">
                  Contraseña
                </label>
                <input
                    type="password"
                    className={`form-control ${claseCampo('password')}`}
                    id="loginPassword"
                    name="password"
                    maxLength={100}
                    autoComplete="current-password"
                    value={valores.password}
                    onChange={handleChange}
                    disabled={cargando}
                    required
                />
                <div className="invalid-feedback">
                  Ingresa tu contraseña.
                </div>
              </div>

              <div className="d-grid">
                <button
                    type="submit"
                    className="btn user-btn"
                    disabled={cargando}
                >
                  {cargando ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
              </div>

              <p className="text-center mt-4 mb-0">
                ¿No tienes una cuenta?{' '}
                <Link to="/registro">Regístrate aquí</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
  )
}

export default Login
