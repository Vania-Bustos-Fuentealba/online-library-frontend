import { describe, it, expect } from 'vitest'
import {
  COSTO_ENVIO,
  agregarItem,
  quitarItem,
  cambiarCantidad,
  calcularSubtotal,
  buscarCupon,
  calcularDescuento,
  calcularEnvio,
  calcularTotal,
  contarUnidades
} from './carrito'

const libroA = { id: 1, nombre: 'Alas de sangre', autor: 'Rebecca Yarros', precio: 19990, imagen: '/books/a.webp', stock: 3 }
const libroB = { id: 2, nombre: 'Crimen y castigo', autor: 'Dostoievski', precio: 14990, imagen: '/books/b.webp', stock: 8 }

describe('agregarItem', () => {
  it('agrega un libro nuevo con la cantidad indicada sin modificar el carrito original', () => {
    const original = []
    const resultado = agregarItem(original, libroA, 2)

    expect(resultado).toHaveLength(1)
    expect(resultado[0]).toMatchObject({ id: 1, nombre: 'Alas de sangre', precio: 19990, cantidad: 2 })
    expect(original).toEqual([])
  })

  it('suma la cantidad si el libro ya está en el carrito y respeta el stock', () => {
    const carrito = agregarItem([], libroA, 2)
    const resultado = agregarItem(carrito, libroA, 5)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].cantidad).toBe(3) // stock máximo del libro
  })

  it('limita la cantidad inicial al stock disponible', () => {
    expect(agregarItem([], libroA, 10)[0].cantidad).toBe(3)
  })
})

describe('quitarItem y cambiarCantidad', () => {
  const carrito = [
    { ...libroA, cantidad: 1 },
    { ...libroB, cantidad: 2 }
  ]

  it('quita solo el libro indicado', () => {
    const resultado = quitarItem(carrito, 1)
    expect(resultado.map((i) => i.id)).toEqual([2])
  })

  it('elimina el libro si la nueva cantidad es 0 o negativa', () => {
    expect(cambiarCantidad(carrito, 2, 0).map((i) => i.id)).toEqual([1])
    expect(cambiarCantidad(carrito, 2, -1).map((i) => i.id)).toEqual([1])
  })

  it('actualiza la cantidad sin superar el stock', () => {
    expect(cambiarCantidad(carrito, 2, 5).find((i) => i.id === 2).cantidad).toBe(5)
    expect(cambiarCantidad(carrito, 2, 99).find((i) => i.id === 2).cantidad).toBe(8)
  })
})

describe('totales del carrito', () => {
  const carrito = [
    { ...libroA, cantidad: 1 }, // 19.990
    { ...libroB, cantidad: 2 } // 29.980
  ]

  it('calcula subtotal y cantidad de unidades', () => {
    expect(calcularSubtotal(carrito)).toBe(49970)
    expect(contarUnidades(carrito)).toBe(3)
    expect(calcularSubtotal([])).toBe(0)
  })

  it('calcula el descuento del cupón sobre el subtotal', () => {
    expect(calcularDescuento(carrito, 'DUOC10')).toBe(4997)
    expect(calcularDescuento(carrito, 'LIBROS5')).toBe(2499)
    expect(calcularDescuento(carrito, 'INEXISTENTE')).toBe(0)
    expect(calcularDescuento(carrito)).toBe(0)
  })

  it('cobra envío bajo $30.000 y lo hace gratis desde ese monto o con el carrito vacío', () => {
    expect(calcularEnvio([{ ...libroB, cantidad: 1 }])).toBe(COSTO_ENVIO)
    expect(calcularEnvio(carrito)).toBe(0)
    expect(calcularEnvio([])).toBe(0)
  })

  it('evalúa el envío gratis después de aplicar el descuento', () => {
    const bajoElMonto = [{ ...libroB, cantidad: 2 }] // 29.980, bajo $30.000
    expect(calcularEnvio(bajoElMonto)).toBe(COSTO_ENVIO)
    const conCupon = [{ ...libroA, cantidad: 2 }] // 39.980; con 10% queda 35.982
    expect(calcularEnvio(conCupon, calcularDescuento(conCupon, 'DUOC10'))).toBe(0)
  })

  it('calcula el total con descuento y envío', () => {
    // 49.970 - 4.997 = 44.973 (envío gratis)
    expect(calcularTotal(carrito, 'DUOC10')).toBe(44973)
    // 14.990 + 3.990 de envío
    expect(calcularTotal([{ ...libroB, cantidad: 1 }])).toBe(18980)
  })
})

describe('buscarCupon', () => {
  it('rechaza un código vacío', () => {
    expect(buscarCupon('   ')).toEqual({ valido: false, codigo: '', mensaje: 'Escribe un código de cupón.' })
  })

  it('rechaza un cupón que no existe', () => {
    const resultado = buscarCupon('FALSO99')
    expect(resultado.valido).toBe(false)
    expect(resultado.mensaje).toBe('El cupón ingresado no es válido.')
  })

  it('acepta un cupón válido sin importar mayúsculas ni espacios', () => {
    const resultado = buscarCupon('  duoc10 ')
    expect(resultado.valido).toBe(true)
    expect(resultado.codigo).toBe('DUOC10')
    expect(resultado.mensaje).toBe('Cupón DUOC10 aplicado: 10% de descuento.')
  })
})