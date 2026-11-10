import { useState } from 'react'
import CampoFormulario from '../components/CampoFormulario'
import { crearMensaje } from '../data/mensajes'
import { validarEmail } from '../utils/validaciones'

const VALORES_INICIALES = { nombre: '', email: '', comentario: '' }

function Contacto() {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [intento, setIntento] = useState(false)
  const [exito, setExito] = useState(false)

  const nombre = valores.nombre.trim()
  const comentario = valores.comentario.trim()

  const validos = {
    nombre: nombre.length >= 2 && nombre.length <= 100,
    email:
      valores.email.trim() !== '' &&
      valores.email.length <= 100 &&
      validarEmail(valores.email),
    comentario: comentario.length >= 10 && comentario.length <= 500
  }

  const formularioValido = Object.values(validos).every(Boolean)

  // Solo muestra el estado visual si el campo tiene algo o ya se intentó enviar
  const claseCampo = (campo) => {
    if (!intento && valores[campo] === '') return ''
    return validos[campo] ? 'is-valid' : 'is-invalid'
  }

  const handleChange = (evento) => {
    const { name, value } = evento.target
    setValores((anterior) => ({ ...anterior, [name]: value }))
    setExito(false)
  }

  const handleSubmit = (evento) => {
    evento.preventDefault()
    setIntento(true)

    if (!formularioValido) return

    crearMensaje(valores)

    setValores(VALORES_INICIALES)
    setIntento(false)
    setExito(true)
  }

  return (
    <section className="user-section">
      <div className="container">
        <div className="text-center mb-4">
          <h1 className="user-section-title">Contáctanos</h1>
          <p className="user-section-description">
            Si tienes alguna consulta, comentario o sugerencia,
            puedes comunicarte con nosotros mediante el siguiente formulario.
          </p>
        </div>

        <div className="user-form-card">
          {exito && (
            <div className="user-alert user-alert-success">
              Mensaje enviado correctamente.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <CampoFormulario
              id="contactName"
              label="Nombre completo"
              mensajeError="Ingresa tu nombre completo."
            >
              <input
                type="text"
                className={`form-control ${claseCampo('nombre')}`}
                id="contactName"
                name="nombre"
                maxLength={100}
                placeholder="Ingresa tu nombre completo"
                value={valores.nombre}
                onChange={handleChange}
              />
            </CampoFormulario>

            <CampoFormulario
              id="contactEmail"
              label="Correo electrónico"
              mensajeError="Ingresa un correo válido."
            >
              <input
                type="email"
                className={`form-control ${claseCampo('email')}`}
                id="contactEmail"
                name="email"
                maxLength={100}
                placeholder="ejemplo@duoc.cl"
                value={valores.email}
                onChange={handleChange}
              />
            </CampoFormulario>

            <CampoFormulario
              id="contactMessage"
              label="Comentario"
              mensajeError="El comentario debe tener entre 10 y 500 caracteres."
            >
              <textarea
                className={`form-control ${claseCampo('comentario')}`}
                id="contactMessage"
                name="comentario"
                maxLength={500}
                placeholder="Escribe tu comentario..."
                rows={6}
                value={valores.comentario}
                onChange={handleChange}
              />
            </CampoFormulario>

            <div className="text-center mt-4">
              <button type="submit" className="btn user-btn">
                Enviar mensaje
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contacto