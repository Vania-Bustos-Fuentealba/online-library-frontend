// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useRef, useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCarrito } from '../hooks/useCarrito'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { formatearPrecio } from '../utils/formato'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { obtenerSesion } from '../data/usuarios'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { crearPedido } from '../services/tiendaApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import {
  // Nota de lectura: Aporta el valor validarNombre a la declaración o llamada abierta.
  validarNombre,
  // Nota de lectura: Aporta el valor validarCorreo a la declaración o llamada abierta.
  validarCorreo,
  // Nota de lectura: Aporta el valor validarDireccion a la declaración o llamada abierta.
  validarDireccion,
  // Nota de lectura: Aporta el valor validarComuna a la declaración o llamada abierta.
  validarComuna,
  // Nota de lectura: Aporta el valor validarPago a la declaración o llamada abierta.
  validarPago,
  // Nota de lectura: Aporta el valor validarFormularioCompra a la declaración o llamada abierta.
  validarFormularioCompra,
// Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
} from '../utils/validacionesCompra'

// Nota de lectura: Define DATOS_INICIALES, que se utiliza en las instrucciones siguientes.
const DATOS_INICIALES = { nombre: '', correo: '', direccion: '', comuna: '', pago: '' }

// Nota de lectura: Define VALIDADORES, que se utiliza en las instrucciones siguientes.
const VALIDADORES = {
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  nombre: validarNombre,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  correo: validarCorreo,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  direccion: validarDireccion,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  comuna: validarComuna,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  pago: validarPago,
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function Checkout() {
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const { carrito, cupon, subtotal, descuento, envio, total, vaciarCarrito } = useCarrito()

  // Estados del formulario: valores, errores por campo y campos que el usuario ya tocó
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [datos, setDatos] = useState(DATOS_INICIALES)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [errores, setErrores] = useState({})
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [tocados, setTocados] = useState({})
  // Estado: resumen del pedido una vez confirmado
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [pedido, setPedido] = useState(null)
  // Estados de la comunicación con el backend
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [enviando, setEnviando] = useState(false)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [errorServidor, setErrorServidor] = useState('')
  // Nota de lectura: Define intento, que se utiliza en las instrucciones siguientes.
  const intento = useRef(null)

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function manejarCambio(evento) {
    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const { name, value } = evento.target
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    setDatos((actual) => ({ ...actual, [name]: value }))
    // Validación en tiempo real: se actualiza el error del campo mientras se escribe
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setErrores((actual) => ({ ...actual, [name]: VALIDADORES[name](value) }))
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function manejarSalida(evento) {
    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const { name } = evento.target
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    setTocados((actual) => ({ ...actual, [name]: true }))
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  async function manejarEnvio(evento) {
    // Nota de lectura: Evita el envío HTML tradicional para controlar la validación con React.
    evento.preventDefault()
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (enviando) return

    // Nota de lectura: Define erroresFinales, que se utiliza en las instrucciones siguientes.
    const erroresFinales = validarFormularioCompra(datos)
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setErrores(erroresFinales)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setTocados({ nombre: true, correo: true, direccion: true, comuna: true, pago: true })

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (Object.keys(erroresFinales).length > 0) return

    // Se envía el pedido al backend: él valida el stock, aplica el cupón y calcula el total
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    setEnviando(true)
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setErrorServidor('')

    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
      // Nota de lectura: Define solicitud, que se utiliza en las instrucciones siguientes.
      const solicitud = {
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        cliente: datos.nombre.trim(),
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        correo: datos.correo.trim(),
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        direccion: datos.direccion.trim(),
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        comuna: datos.comuna.trim(),
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        metodoPago: datos.pago,
        // Nota de lectura: Aporta el valor cupon a la declaración o llamada abierta.
        cupon,
        // Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual.
        items: carrito.map((item) => ({ libroId: item.id, cantidad: item.cantidad })),
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
      // Nota de lectura: Convierte el objeto JavaScript en texto JSON para enviarlo o persistirlo.
      const firma = JSON.stringify(solicitud)
      // Reintentar una respuesta perdida no debe registrar ni descontar dos veces.
      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (!intento.current || intento.current.firma !== firma) {
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        intento.current = { firma, clave: crypto.randomUUID() }
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
      // Nota de lectura: Define respuesta, que se utiliza en las instrucciones siguientes.
      const respuesta = await crearPedido(solicitud, intento.current.clave)

      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      setPedido({
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        numero: respuesta.id,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        cliente: respuesta.cliente,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        correo: respuesta.correo,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        total: respuesta.total,
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      })
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      vaciarCarrito()
    // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
    } catch (error) {
      // Nota de lectura: Actualiza el mensaje de error que verá la persona.
      setErrorServidor(error.message)
    // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
    } finally {
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      setEnviando(false)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Un campo se muestra con error solo después de que el usuario lo tocó
  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function claseCampo(nombre) {
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!tocados[nombre]) return 'form-control'
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return errores[nombre] ? 'form-control is-invalid' : 'form-control is-valid'
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (pedido) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return (
      // Nota de lectura: Anuncia carga o confirmación sin tratarla como error.
      <section className="checkout-confirmacion text-center" role="status">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <h1 className="h2">¡Pedido registrado!</h1>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="mb-1">Número de pedido: #{pedido.numero}</p>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="mb-1">Gracias por tu compra, {pedido.cliente}.</p>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="mb-1">Correo de contacto: {pedido.correo}.</p>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p>Pedido pendiente de pago. No se ha realizado ningún cobro.</p>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="fw-semibold">Total del pedido: {formatearPrecio(pedido.total)}</p>
        {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
        <Link to="/productos" className="btn btn-success">
          Seguir comprando
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </Link>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </section>
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!obtenerSesion()) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return <section className="py-5 text-center">
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <h1 className="h2">Inicia sesión para confirmar tu pedido</h1>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <p>Tu carrito se conserva mientras ingresas a tu cuenta.</p>
      {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
      <Link className="btn btn-success" to="/login" state={{ volverA: '/checkout' }}>Iniciar sesión</Link>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </section>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (carrito.length === 0) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return (
      // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
      <section className="text-center py-5">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <h1 className="h2">No hay productos para pagar</h1>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <p className="text-muted">Agrega libros al carrito antes de finalizar la compra.</p>
        {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
        <Link to="/productos" className="btn btn-success">
          Ver catálogo
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </Link>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </section>
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <section>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <h1 className="h2 mb-4">Finalizar compra</h1>

      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="row g-4">
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="col-12 col-lg-8">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <form className="checkout-formulario" onSubmit={manejarEnvio} noValidate>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <fieldset disabled={enviando}>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <legend className="h5 mb-4">Datos de despacho</legend>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="mb-3">
              {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
              <label htmlFor="nombre" className="form-label">
                Nombre completo
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </label>
              {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
              <input
                id="nombre"
                name="nombre"
                type="text"
                className={claseCampo('nombre')}
                value={datos.nombre}
                onChange={manejarCambio}
                onBlur={manejarSalida}
                placeholder="Ingresa tu nombre completo"
                autoComplete="name"
                maxLength={100}
              />
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="invalid-feedback">{errores.nombre}</div>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="mb-3">
              {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
              <label htmlFor="correo" className="form-label">
                Correo electrónico
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </label>
              {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
              <input
                id="correo"
                name="correo"
                type="email"
                className={claseCampo('correo')}
                value={datos.correo}
                onChange={manejarCambio}
                onBlur={manejarSalida}
                placeholder="ejemplo@gmail.com"
                autoComplete="email"
                maxLength={100}
              />
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="checkout-ayuda">Se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com.</div>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="invalid-feedback">{errores.correo}</div>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="row g-3 mb-3">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="col-12 col-md-7">
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label htmlFor="direccion" className="form-label">
                  Dirección
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>
                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  className={claseCampo('direccion')}
                  value={datos.direccion}
                  onChange={manejarCambio}
                  onBlur={manejarSalida}
                  placeholder="Calle y número"
                  autoComplete="street-address"
                  maxLength={300}
                />
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <div className="invalid-feedback">{errores.direccion}</div>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="col-12 col-md-5">
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label htmlFor="comuna" className="form-label">
                  Comuna
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>
                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
                <input
                  id="comuna"
                  name="comuna"
                  type="text"
                  className={claseCampo('comuna')}
                  value={datos.comuna}
                  onChange={manejarCambio}
                  onBlur={manejarSalida}
                  placeholder="Ingresa tu comuna"
                  autoComplete="address-level2"
                  maxLength={100}
                />
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <div className="invalid-feedback">{errores.comuna}</div>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <fieldset className="mb-4">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <legend className="h6">Método de pago</legend>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <p className="checkout-ayuda">Se registra tu preferencia. El pedido queda pendiente de pago; esta aplicación no realiza cobros.</p>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="form-check form-check-inline">
                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
                <input
                  id="pagoWebpay"
                  name="pago"
                  type="radio"
                  value="webpay"
                  className="form-check-input"
                  checked={datos.pago === 'webpay'}
                  onChange={manejarCambio}
                />
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label htmlFor="pagoWebpay" className="form-check-label">
                  WebPay
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="form-check form-check-inline">
                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
                <input
                  id="pagoTransferencia"
                  name="pago"
                  type="radio"
                  value="transferencia"
                  className="form-check-input"
                  checked={datos.pago === 'transferencia'}
                  onChange={manejarCambio}
                />
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label htmlFor="pagoTransferencia" className="form-check-label">
                  Transferencia bancaria
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>

              {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
              {tocados.pago && errores.pago && (
                // Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla.
                <div className="text-danger small mt-1" role="alert">
                  {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                  {errores.pago}
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>
              // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
              )}
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </fieldset>

            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {errorServidor && (
              // Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla.
              <div className="alert alert-danger" role="alert">
                {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                {errorServidor}
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )}

            {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
            <button type="submit" className="btn btn-success btn-lg" disabled={enviando}>
              {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
              {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </button>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </fieldset>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </form>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="col-12 col-lg-4">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <div className="resumen-carrito">
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <h2 className="h5 mb-3">Tu pedido</h2>

            {/* Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual. */}
            {carrito.map((item) => (
              // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
              <div className="resumen-fila" key={item.id}>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <span>
                  {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                  {item.nombre} × {item.cantidad}
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </span>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <span>{formatearPrecio(item.precio * item.cantidad)}</span>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            ))}

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="resumen-fila">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>Subtotal</span>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>{formatearPrecio(subtotal)}</span>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {descuento > 0 && (
              // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
              <div className="resumen-fila">
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <span>Descuento</span>
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                <span>- {formatearPrecio(descuento)}</span>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )}

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="resumen-fila">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>Envío</span>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>{envio === 0 ? 'Gratis' : formatearPrecio(envio)}</span>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="resumen-fila resumen-total">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>Total</span>
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <span>{formatearPrecio(total)}</span>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>
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
export default Checkout
