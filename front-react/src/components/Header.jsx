// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useEffect, useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import {
  // Nota de lectura: Aporta el valor Link a la declaración o llamada abierta.
  Link,
  // Nota de lectura: Aporta el valor NavLink a la declaración o llamada abierta.
  NavLink,
  // Nota de lectura: Consulta la ruta y el estado que otra pantalla envió al navegar.
  useLocation,
  // Nota de lectura: Obtiene la función para cambiar de pantalla desde código.
  useNavigate,
// Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
} from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCarrito } from '../hooks/useCarrito'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cerrarSesion, obtenerSesion } from '../data/usuarios'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function Header() {
  // Nota de lectura: Obtiene la función para cambiar de pantalla desde código.
  const navigate = useNavigate()
  // Nota de lectura: Consulta la ruta y el estado que otra pantalla envió al navegar.
  const { pathname } = useLocation()
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const { unidades } = useCarrito()

  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [sesion, setSesion] = useState(obtenerSesion)

  // Nota de lectura: Define claseLink, que se utiliza en las instrucciones siguientes.
  const claseLink = ({ isActive }) =>
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      isActive ? 'nav-link active' : 'nav-link'

  // Nota de lectura: Sincroniza el componente con una consulta o evento externo y permite limpiar al desmontarse.
  useEffect(() => {
    // Nota de lectura: Define temporizador, que se utiliza en las instrucciones siguientes.
    let temporizador

    // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
    function actualizarSesion() {
      // Nota de lectura: Cancela el temporizador anterior para no ejecutar una acción duplicada.
      window.clearTimeout(temporizador)

      // Nota de lectura: Define actual, que se utiliza en las instrucciones siguientes.
      const actual = obtenerSesion()
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      setSesion(actual)

      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (actual) {
        // Nota de lectura: Define restante, que se utiliza en las instrucciones siguientes.
        const restante = actual.expiresAt - Date.now()

        // Nota de lectura: Programa una comprobación o un límite de espera para más adelante.
        temporizador = window.setTimeout(
            // Nota de lectura: Aporta el valor actualizarSesion a la declaración o llamada abierta.
            actualizarSesion,
            // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
            Math.min(Math.max(restante, 1), 2147483647)
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
    function manejarStorage(evento) {
      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (
          // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
          evento.key === 'token' ||
          // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
          evento.key === 'sesion' ||
          // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
          evento.key === null
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      ) {
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        actualizarSesion()
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
    function manejarVisibilidad() {
      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (document.visibilityState === 'visible') {
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        actualizarSesion()
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    window.addEventListener('sesion-cambiada', actualizarSesion)
    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    window.addEventListener('storage', manejarStorage)
    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    window.addEventListener('focus', actualizarSesion)
    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    document.addEventListener(
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'visibilitychange',
        // Nota de lectura: Aporta el valor manejarVisibilidad a la declaración o llamada abierta.
        manejarVisibilidad
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    actualizarSesion()

    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return () => {
      // Nota de lectura: Cancela el temporizador anterior para no ejecutar una acción duplicada.
      window.clearTimeout(temporizador)
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      window.removeEventListener(
          // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
          'sesion-cambiada',
          // Nota de lectura: Aporta el valor actualizarSesion a la declaración o llamada abierta.
          actualizarSesion
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      )
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      window.removeEventListener('storage', manejarStorage)
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      window.removeEventListener('focus', actualizarSesion)
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      document.removeEventListener(
          // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
          'visibilitychange',
          // Nota de lectura: Aporta el valor manejarVisibilidad a la declaración o llamada abierta.
          manejarVisibilidad
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      )
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  }, [pathname])

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function salir() {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    cerrarSesion()
    // Nota de lectura: Cambia de pantalla; state transporta un mensaje y replace evita volver al formulario enviado.
    navigate('/login', { replace: true })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
      // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
      <header className="user-header">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <nav className="navbar navbar-expand-lg">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <div className="container">
            {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
            <Link className="navbar-brand" to="/">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>📚</span> Online Library
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </Link>

            {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#userNavbar"
                aria-controls="userNavbar"
                aria-expanded="false"
                aria-label="Abrir navegación"
            >
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span className="navbar-toggler-icon"></span>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </button>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div
                className="collapse navbar-collapse"
                id="userNavbar"
            >
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <ul className="navbar-nav ms-auto align-items-lg-center">
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <li className="nav-item">
                  {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                  <NavLink className={claseLink} to="/" end>
                    Inicio
                  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                  </NavLink>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </li>

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <li className="nav-item">
                  {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                  <NavLink className={claseLink} to="/productos">
                    Productos
                  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                  </NavLink>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </li>

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <li className="nav-item">
                  {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                  <NavLink className={claseLink} to="/nosotros">
                    Nosotros
                  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                  </NavLink>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </li>

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <li className="nav-item">
                  {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                  <NavLink className={claseLink} to="/blog">
                    Blog
                  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                  </NavLink>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </li>

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <li className="nav-item">
                  {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                  <NavLink className={claseLink} to="/contacto">
                    Contacto
                  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                  </NavLink>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </li>

                {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
                {sesion ? (
                    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                    <>
                      {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
                      {sesion.rol === 'admin' && (
                          // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                          <li className="nav-item">
                            {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                            <NavLink
                                className={claseLink}
                                to="/admin"
                            >
                              Administración
                            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                            </NavLink>
                          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                          </li>
                      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                      )}

                      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                      <li className="nav-item">
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <span
                        className="navbar-text small px-lg-2 d-inline-block text-truncate"
                        style={{ maxWidth: '200px' }}
                        title={sesion.email}
                    >
                      {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                      {sesion.nombre || sesion.email}
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </span>
                      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                      </li>

                      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                      <li className="nav-item">
                        {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
                        <button
                            className="nav-link"
                            type="button"
                            onClick={salir}
                        >
                          Cerrar sesión
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        </button>
                      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                      </li>
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </>
                // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                ) : (
                    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                    <>
                      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                      <li className="nav-item">
                        {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                        <NavLink className={claseLink} to="/login">
                          Iniciar sesión
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        </NavLink>
                      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                      </li>

                      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                      <li className="nav-item">
                        {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                        <NavLink
                            className={claseLink}
                            to="/registro"
                        >
                          Registrarse
                        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                        </NavLink>
                      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                      </li>
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    </>
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                )}

                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <li className="nav-item">
                  {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
                  <NavLink
                      className="nav-link store-cart-link"
                      to="/carrito"
                  >
                    🛒 Carrito
                    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                    <span className="store-cart-badge">
                    {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                    {unidades}
                  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                  </span>
                  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                  </NavLink>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </li>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </ul>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </nav>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </header>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default Header