// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useLocation, useNavigate } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { iniciarSesion } from '../data/usuarios'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function Login() {
  // Nota de lectura: Consulta la ruta y el estado que otra pantalla envió al navegar.
  const location = useLocation()
  // Nota de lectura: Obtiene la función para cambiar de pantalla desde código.
  const navigate = useNavigate()

  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [valores, setValores] = useState({ email: '', password: '' })
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [intento, setIntento] = useState(false)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [error, setError] = useState('')
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [cargando, setCargando] = useState(false)

  // Nota de lectura: Define validos, que se utiliza en las instrucciones siguientes.
  const validos = {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    email:
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        valores.email.trim().length <= 100 &&
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim()),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    password:
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        valores.password.length > 0 &&
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        valores.password.length <= 100,
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define claseCampo, que se utiliza en las instrucciones siguientes.
  const claseCampo = (nombre) => {
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!intento && valores[nombre] === '') return ''
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return validos[nombre] ? 'is-valid' : 'is-invalid'
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define handleChange, que se utiliza en las instrucciones siguientes.
  const handleChange = (evento) => {
    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const { name, value } = evento.target
    // Nota de lectura: Actualiza los valores visibles del formulario.
    setValores((anterior) => ({ ...anterior, [name]: value }))
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
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setError('')

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!validos.email || !validos.password) {
      // Nota de lectura: Aporta el valor return a la declaración o llamada abierta.
      return
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setCargando(true)

    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
      // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
      const datos = await solicitar('/auth/login', {
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        method: 'POST',
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        autenticar: false,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        body: {
          // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
          email: valores.email.trim().toLowerCase(),
          // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
          password: valores.password,
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        },
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      })

      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (!datos?.token) {
        // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
        throw new Error('El servidor no devolvió un token de acceso.')
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }

      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (!['ADMIN', 'CLIENT'].includes(datos.role)) {
        // Nota de lectura: Interrumpe la operación y comunica el error al manejador correspondiente.
        throw new Error('El servidor devolvió un rol no reconocido.')
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }

      // Nota de lectura: Define usuario, que se utiliza en las instrucciones siguientes.
      const usuario = {
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        email: datos.email,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        rol: datos.role === 'ADMIN' ? 'admin' : 'cliente',
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }

      // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
      localStorage.setItem('token', datos.token)
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      iniciarSesion(usuario)

      // Nota de lectura: Cambia de pantalla; state transporta un mensaje y replace evita volver al formulario enviado.
      navigate(
          // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
          location.state?.volverA === '/checkout' ? '/checkout' : (usuario.rol === 'admin' ? '/admin' : '/productos'),
          // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
          { replace: true }
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      )
    // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
    } catch (err) {
      // Nota de lectura: Actualiza el mensaje de error que verá la persona.
      setError(err.message || 'No se pudo iniciar sesión.')
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
            <h1 className="user-section-title">Iniciar sesión</h1>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <p className="user-section-description">
              Ingresa a tu cuenta de Online Library.
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </p>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>

          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <div className="user-form-card">
            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {location.state?.registrado && (
                // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                <div className="user-alert user-alert-success">
                  Cuenta creada correctamente. Ya puedes iniciar sesión.
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
              <div className="mb-3">
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label htmlFor="loginEmail" className="form-label">
                  Correo electrónico
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>
                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
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
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <div className="invalid-feedback">
                  Ingresa un correo electrónico válido.
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="mb-4">
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label htmlFor="loginPassword" className="form-label">
                  Contraseña
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>
                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
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
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <div className="invalid-feedback">
                  Ingresa tu contraseña.
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="d-grid">
                {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
                <button
                    type="submit"
                    className="btn user-btn"
                    disabled={cargando}
                >
                  {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                  {cargando ? 'Ingresando...' : 'Iniciar sesión'}
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </button>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <p className="text-center mt-4 mb-0">
                ¿No tienes una cuenta?{' '}
                {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                <Link to="/registro">Regístrate aquí</Link>
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
export default Login
