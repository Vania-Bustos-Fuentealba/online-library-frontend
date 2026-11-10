import { useEffect, useState } from 'react'
import { CarritoContext } from './carritoContext'
import {
  agregarItem,
  quitarItem,
  cambiarCantidad,
  buscarCupon,
  calcularSubtotal,
  calcularDescuento,
  calcularEnvio,
  calcularTotal,
  contarUnidades,
} from '../utils/carrito'

const CLAVE_STORAGE = 'carrito-tienda'
const CLAVE_CUPON = 'cupon-tienda'

function leerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

function leerCuponGuardado() {
  return localStorage.getItem(CLAVE_CUPON) || ''
}

function CarritoProvider({ children }) {
  // Estados: el carrito y el cupón aplicado, ambos leídos de localStorage al iniciar
  const [carrito, setCarrito] = useState(leerCarritoGuardado)
  const [cupon, setCupon] = useState(leerCuponGuardado)

  // Cada vez que cambian, se guardan en localStorage
  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(carrito))
  }, [carrito])

  useEffect(() => {
    localStorage.setItem(CLAVE_CUPON, cupon)
  }, [cupon])

  const descuento = calcularDescuento(carrito, cupon)

  const valor = {
    carrito,
    cupon,
    agregarAlCarrito: (libro, cantidad = 1) =>
      setCarrito((actual) => agregarItem(actual, libro, cantidad)),
    quitarDelCarrito: (id) => setCarrito((actual) => quitarItem(actual, id)),
    cambiarCantidadItem: (id, cantidad) =>
      setCarrito((actual) => cambiarCantidad(actual, id, cantidad)),
    // Devuelve el resultado ({ valido, mensaje }) para que la página lo muestre
    aplicarCupon: (texto) => {
      const resultado = buscarCupon(texto)
      if (resultado.valido) setCupon(resultado.codigo)
      return resultado
    },
    quitarCupon: () => setCupon(''),
    vaciarCarrito: () => {
      setCarrito([])
      setCupon('')
    },
    unidades: contarUnidades(carrito),
    subtotal: calcularSubtotal(carrito),
    descuento,
    envio: calcularEnvio(carrito, descuento),
    total: calcularTotal(carrito, cupon),
  }

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}

export default CarritoProvider