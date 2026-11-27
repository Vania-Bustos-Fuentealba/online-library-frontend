// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useEffect, useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { CarritoContext } from './carritoContext'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import {
  // Nota de lectura: Aporta el valor agregarItem a la declaración o llamada abierta.
  agregarItem,
  // Nota de lectura: Aporta el valor quitarItem a la declaración o llamada abierta.
  quitarItem,
  // Nota de lectura: Aporta el valor cambiarCantidad a la declaración o llamada abierta.
  cambiarCantidad,
  // Nota de lectura: Aporta el valor buscarCupon a la declaración o llamada abierta.
  buscarCupon,
  // Nota de lectura: Aporta el valor calcularSubtotal a la declaración o llamada abierta.
  calcularSubtotal,
  // Nota de lectura: Aporta el valor calcularDescuento a la declaración o llamada abierta.
  calcularDescuento,
  // Nota de lectura: Aporta el valor calcularEnvio a la declaración o llamada abierta.
  calcularEnvio,
  // Nota de lectura: Aporta el valor calcularTotal a la declaración o llamada abierta.
  calcularTotal,
  // Nota de lectura: Aporta el valor contarUnidades a la declaración o llamada abierta.
  contarUnidades,
  // Nota de lectura: Aporta el valor validarCarritoGuardado a la declaración o llamada abierta.
  validarCarritoGuardado,
// Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
} from '../utils/carrito'

// Los IDs del antiguo catálogo simulado no identifican los libros de MySQL.
// Conservamos sus claves anteriores sin mezclarlas con los pedidos reales.
// Nota de lectura: Define CLAVE_STORAGE, que se utiliza en las instrucciones siguientes.
const CLAVE_STORAGE = 'carrito-api-v1'
// Nota de lectura: Define CLAVE_CUPON, que se utiliza en las instrucciones siguientes.
const CLAVE_CUPON = 'cupon-api-v1'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function leerCarritoGuardado() {
  // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
  try {
    // Nota de lectura: Lee el valor persistido bajo esa clave en este navegador.
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    // Nota de lectura: Interpreta JSON como datos; una respuesta inválida produce un error.
    return guardado ? validarCarritoGuardado(JSON.parse(guardado)) : []
  // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
  } catch {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return []
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function leerCuponGuardado() {
  // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
  try {
    // Nota de lectura: Lee el valor persistido bajo esa clave en este navegador.
    const resultado = buscarCupon(localStorage.getItem(CLAVE_CUPON) || '')
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return resultado.valido ? resultado.codigo : ''
  // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
  } catch { return '' }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function CarritoProvider({ children }) {
  // Estados: el carrito y el cupón aplicado, ambos leídos de localStorage al iniciar
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [carrito, setCarrito] = useState(leerCarritoGuardado)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [cupon, setCupon] = useState(leerCuponGuardado)

  // Cada vez que cambian, se guardan en localStorage
  // Nota de lectura: Sincroniza el componente con una consulta o evento externo y permite limpiar al desmontarse.
  useEffect(() => {
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    try { localStorage.setItem(CLAVE_STORAGE, JSON.stringify(carrito)) } catch { /* El carrito sigue funcionando en memoria si el navegador bloquea almacenamiento. */ }
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  }, [carrito])

  // Nota de lectura: Sincroniza el componente con una consulta o evento externo y permite limpiar al desmontarse.
  useEffect(() => {
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    try { localStorage.setItem(CLAVE_CUPON, cupon) } catch { /* El cupón se conserva en memoria. */ }
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  }, [cupon])

  // Nota de lectura: Define descuento, que se utiliza en las instrucciones siguientes.
  const descuento = calcularDescuento(carrito, cupon)

  // Nota de lectura: Define valor, que se utiliza en las instrucciones siguientes.
  const valor = {
    // Nota de lectura: Aporta el valor carrito a la declaración o llamada abierta.
    carrito,
    // Nota de lectura: Aporta el valor cupon a la declaración o llamada abierta.
    cupon,
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    agregarAlCarrito: (libro, cantidad = 1) =>
      // Nota de lectura: Define una función corta usada como callback, condición o transformación.
      setCarrito((actual) => agregarItem(actual, libro, cantidad)),
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    quitarDelCarrito: (id) => setCarrito((actual) => quitarItem(actual, id)),
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    cambiarCantidadItem: (id, cantidad) =>
      // Nota de lectura: Define una función corta usada como callback, condición o transformación.
      setCarrito((actual) => cambiarCantidad(actual, id, cantidad)),
    // Devuelve el resultado ({ valido, mensaje }) para que la página lo muestre
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    aplicarCupon: (texto) => {
      // Nota de lectura: Define resultado, que se utiliza en las instrucciones siguientes.
      const resultado = buscarCupon(texto)
      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (resultado.valido) setCupon(resultado.codigo)
      // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
      return resultado
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    },
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    quitarCupon: () => setCupon(''),
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    vaciarCarrito: () => {
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      setCarrito([])
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      setCupon('')
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    },
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    unidades: contarUnidades(carrito),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    subtotal: calcularSubtotal(carrito),
    // Nota de lectura: Aporta el valor descuento a la declaración o llamada abierta.
    descuento,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    envio: calcularEnvio(carrito, descuento),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    total: calcularTotal(carrito, cupon),
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default CarritoProvider
