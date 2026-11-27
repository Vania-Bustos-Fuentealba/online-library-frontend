// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useNavigate } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import CampoFormulario from '../components/CampoFormulario'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function Registro() {
  // Nota de lectura: Obtiene la función para cambiar de pantalla desde código.
  const navigate = useNavigate()

  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [valores, setValores] = useState({
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    nombre: '',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    email: '',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    password: '',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    confirmar: '',
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [intento, setIntento] = useState(false)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [error, setError] = useState('')
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [cargando, setCargando] = useState(false)

  // Nota de lectura: Define validos, que se utiliza en las instrucciones siguientes.
  const validos = {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    nombre:
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        valores.nombre.trim().length >= 2 &&
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        valores.nombre.trim().length <= 100,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    email:
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        valores.email.trim().length <= 100 &&
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim()),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    password:
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        valores.password.length >= 6 &&
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        valores.password.length <= 100,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    confirmar:
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        valores.confirmar !== '' &&
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        valores.confirmar === valores.password,
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function claseCampo(nombre) {
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!intento && valores[nombre] === '') return ''
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return validos[nombre] ? 'is-valid' : 'is-invalid'
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function handleChange(evento) {
    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const { name, value } = evento.target

    // Nota de lectura: Actualiza los valores visibles del formulario.
    setValores((anteriores) => ({
      // Nota de lectura: Aporta el valor ...anteriores a la declaración o llamada abierta.
      ...anteriores,
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      [name]: value,
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }))

    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setError('')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  async function handleSubmit(evento) {
    // Nota de lectura: Evita el envío HTML tradicional para controlar la validación con React.
    evento.preventDefault()

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (cargando) return

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setIntento(true)
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setError('')

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!Object.values(validos).every(Boolean)) return

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setCargando(true)

    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
      // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
      await solicitar('/auth/register', {
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        method: 'POST',
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        autenticar: false,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        body: {
          // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
          name: valores.nombre.trim(),
          // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
          email: valores.email.trim().toLowerCase(),
          // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
          password: valores.password,
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        },
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      })

      // Nota de lectura: Cambia de pantalla; state transporta un mensaje y replace evita volver al formulario enviado.
      navigate('/login', {
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        replace: true,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        state: { registrado: true },
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      })
    // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
    } catch (err) {
      // Nota de lectura: Actualiza el mensaje de error que verá la persona.
      setError(err.message || 'No se pudo crear la cuenta.')
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
            <h1 className="user-section-title">
              Crear una cuenta
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </h1>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <p className="user-section-description">
              Regístrate en Online Library.
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </p>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>

          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <div className="user-form-card">
            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {error && (
                // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                <div
                    className="user-alert user-alert-error"
                    role="alert"
                >
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
                <legend className="visually-hidden">
                  Datos de registro
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </legend>

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <CampoFormulario
                    id="registerName"
                    label="Nombre completo"
                    mensajeError="Ingresa entre 2 y 100 caracteres."
                >
                  {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
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
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </CampoFormulario>

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <CampoFormulario
                    id="registerEmail"
                    label="Correo electrónico"
                    mensajeError="Ingresa un correo electrónico válido."
                >
                  {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
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
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </CampoFormulario>

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <CampoFormulario
                    id="registerPassword"
                    label="Contraseña"
                    mensajeError="La contraseña debe tener entre 6 y 100 caracteres."
                >
                  {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
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
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </CampoFormulario>

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <CampoFormulario
                    id="registerPasswordConfirm"
                    label="Confirmar contraseña"
                    mensajeError="Las contraseñas deben coincidir."
                >
                  {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
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
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </CampoFormulario>

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <div className="d-grid mt-4">
                  {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
                  <button type="submit" className="btn user-btn">
                    {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                    {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
                  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                  </button>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </fieldset>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <p className="text-center mt-4 mb-0">
                ¿Ya tienes una cuenta?{' '}
                {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                <Link to="/login">Inicia sesión</Link>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </p>
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
export default Registro
