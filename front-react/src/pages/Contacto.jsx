// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import CampoFormulario from '../components/CampoFormulario'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { enviarMensajeContacto } from '../services/contenidoApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { validarEmail } from '../utils/validaciones'

// Nota de lectura: Define VALORES_INICIALES, que se utiliza en las instrucciones siguientes.
const VALORES_INICIALES = { nombre: '', email: '', comentario: '' }

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function Contacto() {
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [valores, setValores] = useState(VALORES_INICIALES)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [intento, setIntento] = useState(false)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [exito, setExito] = useState(false)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [error, setError] = useState('')
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [cargando, setCargando] = useState(false)

  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  const nombre = valores.nombre.trim()
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  const comentario = valores.comentario.trim()

  // Nota de lectura: Define validos, que se utiliza en las instrucciones siguientes.
  const validos = {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    nombre: nombre.length >= 2 && nombre.length <= 100,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    email:
      // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
      valores.email.trim() !== '' &&
      // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
      valores.email.length <= 100 &&
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      validarEmail(valores.email),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    comentario: comentario.length >= 10 && comentario.length <= 500
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define formularioValido, que se utiliza en las instrucciones siguientes.
  const formularioValido = Object.values(validos).every(Boolean)

  // Solo muestra el estado visual si el campo tiene algo o ya se intentó enviar
  // Nota de lectura: Define claseCampo, que se utiliza en las instrucciones siguientes.
  const claseCampo = (campo) => {
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!intento && valores[campo] === '') return ''
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return validos[campo] ? 'is-valid' : 'is-invalid'
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define handleChange, que se utiliza en las instrucciones siguientes.
  const handleChange = (evento) => {
    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const { name, value } = evento.target
    // Nota de lectura: Actualiza los valores visibles del formulario.
    setValores((anterior) => ({ ...anterior, [name]: value }))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setExito(false)
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setError('')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define handleSubmit, que se utiliza en las instrucciones siguientes.
  const handleSubmit = async (evento) => {
    // Nota de lectura: Evita el envío HTML tradicional para controlar la validación con React.
    evento.preventDefault()

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (cargando) return

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setIntento(true)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setExito(false)
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setError('')

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!formularioValido) return

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setCargando(true)

    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      await enviarMensajeContacto(valores)

      // Nota de lectura: Actualiza los valores visibles del formulario.
      setValores(VALORES_INICIALES)
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      setIntento(false)
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      setExito(true)
    // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
    } catch (err) {
      // Se conserva lo escrito para que la persona pueda reintentar
      // Nota de lectura: Actualiza el mensaje de error que verá la persona.
      setError(err.message || 'No se pudo enviar el mensaje.')
    // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
    } finally {
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      setCargando(false)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <section className="user-section">
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="container">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="text-center mb-4">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <h1 className="user-section-title">Contáctanos</h1>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <p className="user-section-description">
            Si tienes alguna consulta, comentario o sugerencia,
            puedes comunicarte con nosotros mediante el siguiente formulario.
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </p>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="user-form-card">
          {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
          {exito && (
            // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
            <div className="user-alert user-alert-success">
              Mensaje enviado correctamente.
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>
          // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
          )}

          {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
          {error && (
            // Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla.
            <div className="user-alert user-alert-error" role="alert">
              {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
              {error}
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>
          // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
          )}

          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <fieldset disabled={cargando}>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <legend className="visually-hidden">Datos de contacto</legend>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <CampoFormulario
                id="contactName"
                label="Nombre completo"
                mensajeError="Ingresa tu nombre completo."
              >
                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
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
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </CampoFormulario>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <CampoFormulario
                id="contactEmail"
                label="Correo electrónico"
                mensajeError="Ingresa un correo válido."
              >
                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
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
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </CampoFormulario>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <CampoFormulario
                id="contactMessage"
                label="Comentario"
                mensajeError="El comentario debe tener entre 10 y 500 caracteres."
              >
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
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
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </CampoFormulario>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="text-center mt-4">
                {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
                <button type="submit" className="btn user-btn">
                  {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                  {cargando ? 'Enviando…' : 'Enviar mensaje'}
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </button>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </fieldset>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </form>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </div>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </section>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default Contacto