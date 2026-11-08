import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { validarEmail, validarPassword } from '../utils/validaciones'
import { autenticar, iniciarSesion } from '../data/usuarios'

function Login() {
  const location = useLocation()

  const [valores, setValores] = useState({ email: '', password: '' })
  const [intento, setIntento] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const validos = {
    email:
      valores.email.trim() !== '' &&
      valores.email.length <= 100 &&
      validarEmail(valores.email),
    password: validarPassword(valores.password)
  }

  // Solo muestra el estado visual si el usuario escribió algo o ya intentó enviar
  const claseCampo = (nombre) => {
    if (!intento && valores[nombre] === '') return ''
    return validos[nombre] ? 'is-valid' : 'is-invalid'
  }

  const handleChange = (evento) => {
    const { name, value } = evento.target
    setValores((anterior) => ({ ...anterior, [name]: value }))
    setError('')
  }

  const handleSubmit = (evento) => {
    evento.preventDefault()
    setIntento(true)
    setExito('')

    if (!validos.email || !validos.password) {
      return
    }

    const usuario = autenticar(valores.email, valores.password)

    if (!usuario) {
      setError('Correo o contraseña incorrectos.')
      return
    }

    iniciarSesion(usuario)
    setExito(`¡Bienvenido/a, ${usuario.nombre}!`)
    // Cuando exista la página de inicio: navigate('/') con useNavigate
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

          {exito && <div className="user-alert user-alert-success">{exito}</div>}
          {error && <div className="user-alert user-alert-error">{error}</div>}

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
                required
              />
              <div className="invalid-feedback">
                Ingresa un correo electrónico válido.
              </div>
              <div className="form-text">
                Se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com.
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
                minLength={4}
                maxLength={10}
                autoComplete="current-password"
                value={valores.password}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">
                La contraseña debe tener entre 4 y 10 caracteres.
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn user-btn">
                Iniciar sesión
              </button>
            </div>

            <p className="text-center mt-4 mb-0">
              ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login