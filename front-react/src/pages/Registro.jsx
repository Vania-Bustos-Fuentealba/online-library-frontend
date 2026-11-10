import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CampoFormulario from '../components/CampoFormulario'
import { regiones } from '../data/regiones'
import { crearUsuario } from '../data/usuarios'
import {
  validarRun,
  validarEmail,
  validarPassword
} from '../utils/validaciones'

const VALORES_INICIALES = {
  run: '',
  nombre: '',
  apellidos: '',
  email: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
  password: '',
  confirmar: ''
}

function Registro() {
  const navigate = useNavigate()

  const [valores, setValores] = useState(VALORES_INICIALES)
  const [intento, setIntento] = useState(false)
  const [error, setError] = useState('')

  const validos = {
    run: validarRun(valores.run.trim()),
    nombre: valores.nombre.trim() !== '',
    apellidos: valores.apellidos.trim() !== '',
    email:
      valores.email.trim() !== '' &&
      valores.email.length <= 100 &&
      validarEmail(valores.email),
    fechaNacimiento: true, // es opcional
    region: valores.region !== '',
    comuna: valores.comuna !== '',
    direccion: valores.direccion.trim() !== '',
    password: validarPassword(valores.password),
    confirmar: valores.confirmar !== '' && valores.password === valores.confirmar
  }

  const formularioValido = Object.values(validos).every(Boolean)

  const comunas = valores.region ? regiones[valores.region] : []

  // Solo muestra el estado visual si el campo tiene algo o ya se intentó enviar
  const claseCampo = (nombre) => {
    if (nombre === 'fechaNacimiento') {
      return valores.fechaNacimiento === '' ? '' : 'is-valid'
    }
    if (!intento && valores[nombre] === '') return ''
    return validos[nombre] ? 'is-valid' : 'is-invalid'
  }

  const handleChange = (evento) => {
    const { name, value } = evento.target

    setValores((anterior) => {
      const nuevos = { ...anterior, [name]: value }
      // Al cambiar de región, la comuna anterior deja de ser válida
      if (name === 'region') nuevos.comuna = ''
      return nuevos
    })

    setError('')
  }

  const handleSubmit = (evento) => {
    evento.preventDefault()
    setIntento(true)

    if (!formularioValido) return

    try {
      crearUsuario({
        run: valores.run.trim(),
        nombre: valores.nombre.trim(),
        apellidos: valores.apellidos.trim(),
        email: valores.email.trim(),
        fechaNacimiento: valores.fechaNacimiento,
        region: valores.region,
        comuna: valores.comuna,
        direccion: valores.direccion.trim(),
        password: valores.password
      })

      navigate('/login', { state: { registrado: true } })
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <section className="user-section">
      <div className="container">
        <div className="text-center mb-4">
          <h1 className="user-section-title">Crear una cuenta</h1>
          <p className="user-section-description">
            Regístrate en Online Library para acceder a nuestra plataforma.
          </p>
        </div>

        <div className="user-form-card">
          {error && <div className="user-alert user-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <CampoFormulario
              id="registerRun"
              label="RUN"
              mensajeError="Ingresa un RUN válido, sin puntos ni guion."
              ayuda="Ingresa tu RUN sin puntos ni guion."
            >
              <input
                type="text"
                className={`form-control ${claseCampo('run')}`}
                id="registerRun"
                name="run"
                minLength={7}
                maxLength={9}
                placeholder="Ej: 19011022K"
                autoComplete="off"
                value={valores.run}
                onChange={handleChange}
                required
              />
            </CampoFormulario>

            <CampoFormulario
              id="registerName"
              label="Nombre"
              mensajeError="Ingresa tu nombre."
            >
              <input
                type="text"
                className={`form-control ${claseCampo('nombre')}`}
                id="registerName"
                name="nombre"
                maxLength={50}
                autoComplete="name"
                value={valores.nombre}
                onChange={handleChange}
                required
              />
            </CampoFormulario>

            <CampoFormulario
              id="registerLastName"
              label="Apellidos"
              mensajeError="Ingresa tus apellidos."
            >
              <input
                type="text"
                className={`form-control ${claseCampo('apellidos')}`}
                id="registerLastName"
                name="apellidos"
                maxLength={100}
                autoComplete="family-name"
                value={valores.apellidos}
                onChange={handleChange}
                required
              />
            </CampoFormulario>

            <CampoFormulario
              id="registerEmail"
              label="Correo electrónico"
              mensajeError="Ingresa un correo electrónico válido."
              ayuda="Se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com."
            >
              <input
                type="email"
                className={`form-control ${claseCampo('email')}`}
                id="registerEmail"
                name="email"
                maxLength={100}
                placeholder="ejemplo@gmail.com"
                autoComplete="email"
                value={valores.email}
                onChange={handleChange}
                required
              />
            </CampoFormulario>

            <CampoFormulario
              id="registerBirthDate"
              label="Fecha de nacimiento"
              mensajeError="Ingresa una fecha válida."
            >
              <input
                type="date"
                className={`form-control ${claseCampo('fechaNacimiento')}`}
                id="registerBirthDate"
                name="fechaNacimiento"
                autoComplete="bday"
                value={valores.fechaNacimiento}
                onChange={handleChange}
              />
            </CampoFormulario>

            <CampoFormulario
              id="registerRegion"
              label="Región"
              mensajeError="Selecciona una región."
            >
              <select
                className={`form-select ${claseCampo('region')}`}
                id="registerRegion"
                name="region"
                value={valores.region}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una región</option>
                {Object.keys(regiones).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </CampoFormulario>

            <CampoFormulario
              id="registerCommune"
              label="Comuna"
              mensajeError="Selecciona una comuna."
            >
              <select
                className={`form-select ${claseCampo('comuna')}`}
                id="registerCommune"
                name="comuna"
                value={valores.comuna}
                onChange={handleChange}
                disabled={valores.region === ''}
                required
              >
                <option value="">
                  {valores.region === ''
                    ? 'Selecciona primero una región'
                    : 'Selecciona una comuna'}
                </option>
                {comunas.map((comuna) => (
                  <option key={comuna} value={comuna}>
                    {comuna}
                  </option>
                ))}
              </select>
            </CampoFormulario>

            <CampoFormulario
              id="registerAddress"
              label="Dirección"
              mensajeError="Ingresa tu dirección."
            >
              <input
                type="text"
                className={`form-control ${claseCampo('direccion')}`}
                id="registerAddress"
                name="direccion"
                maxLength={300}
                autoComplete="street-address"
                value={valores.direccion}
                onChange={handleChange}
                required
              />
            </CampoFormulario>

            <CampoFormulario
              id="registerPassword"
              label="Contraseña"
              mensajeError="La contraseña debe tener entre 4 y 10 caracteres."
            >
              <input
                type="password"
                className={`form-control ${claseCampo('password')}`}
                id="registerPassword"
                name="password"
                minLength={4}
                maxLength={10}
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
                minLength={4}
                maxLength={10}
                autoComplete="new-password"
                value={valores.confirmar}
                onChange={handleChange}
                required
              />
            </CampoFormulario>

            <div className="d-grid mt-4">
              <button type="submit" className="btn user-btn">
                Crear cuenta
              </button>
            </div>

            <p className="text-center mt-4 mb-0">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Registro