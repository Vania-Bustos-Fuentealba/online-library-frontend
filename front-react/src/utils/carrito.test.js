// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import {
  // Nota de lectura: Aporta el valor COSTO_ENVIO a la declaración o llamada abierta.
  COSTO_ENVIO,
  // Nota de lectura: Aporta el valor agregarItem a la declaración o llamada abierta.
  agregarItem,
  // Nota de lectura: Aporta el valor quitarItem a la declaración o llamada abierta.
  quitarItem,
  // Nota de lectura: Aporta el valor cambiarCantidad a la declaración o llamada abierta.
  cambiarCantidad,
  // Nota de lectura: Aporta el valor calcularSubtotal a la declaración o llamada abierta.
  calcularSubtotal,
  // Nota de lectura: Aporta el valor buscarCupon a la declaración o llamada abierta.
  buscarCupon,
  // Nota de lectura: Aporta el valor calcularDescuento a la declaración o llamada abierta.
  calcularDescuento,
  // Nota de lectura: Aporta el valor calcularEnvio a la declaración o llamada abierta.
  calcularEnvio,
  // Nota de lectura: Aporta el valor calcularTotal a la declaración o llamada abierta.
  calcularTotal,
  // Nota de lectura: Aporta el valor contarUnidades a la declaración o llamada abierta.
  contarUnidades
// Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
} from './carrito'

// Nota de lectura: Define libroA, que se utiliza en las instrucciones siguientes.
const libroA = { id: 1, nombre: 'Alas de sangre', autor: 'Rebecca Yarros', precio: 19990, imagen: '/books/a.webp', stock: 3 }
// Nota de lectura: Define libroB, que se utiliza en las instrucciones siguientes.
const libroB = { id: 2, nombre: 'Crimen y castigo', autor: 'Dostoievski', precio: 14990, imagen: '/books/b.webp', stock: 8 }

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('agregarItem', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('agrega un libro nuevo con la cantidad indicada sin modificar el carrito original', () => {
    // Nota de lectura: Define original, que se utiliza en las instrucciones siguientes.
    const original = []
    // Nota de lectura: Define resultado, que se utiliza en las instrucciones siguientes.
    const resultado = agregarItem(original, libroA, 2)

    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(resultado).toHaveLength(1)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(resultado[0]).toMatchObject({ id: 1, nombre: 'Alas de sangre', precio: 19990, cantidad: 2 })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(original).toEqual([])
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('suma la cantidad si el libro ya está en el carrito y respeta el stock', () => {
    // Nota de lectura: Define carrito, que se utiliza en las instrucciones siguientes.
    const carrito = agregarItem([], libroA, 2)
    // Nota de lectura: Define resultado, que se utiliza en las instrucciones siguientes.
    const resultado = agregarItem(carrito, libroA, 5)

    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(resultado).toHaveLength(1)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(resultado[0].cantidad).toBe(3) // stock máximo del libro
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('limita la cantidad inicial al stock disponible', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(agregarItem([], libroA, 10)[0].cantidad).toBe(3)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('quitarItem y cambiarCantidad', () => {
  // Nota de lectura: Define carrito, que se utiliza en las instrucciones siguientes.
  const carrito = [
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    { ...libroA, cantidad: 1 },
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    { ...libroB, cantidad: 2 }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  ]

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('quita solo el libro indicado', () => {
    // Nota de lectura: Define resultado, que se utiliza en las instrucciones siguientes.
    const resultado = quitarItem(carrito, 1)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(resultado.map((i) => i.id)).toEqual([2])
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('elimina el libro si la nueva cantidad es 0 o negativa', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(cambiarCantidad(carrito, 2, 0).map((i) => i.id)).toEqual([1])
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(cambiarCantidad(carrito, 2, -1).map((i) => i.id)).toEqual([1])
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('actualiza la cantidad sin superar el stock', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(cambiarCantidad(carrito, 2, 5).find((i) => i.id === 2).cantidad).toBe(5)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(cambiarCantidad(carrito, 2, 99).find((i) => i.id === 2).cantidad).toBe(8)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('totales del carrito', () => {
  // Nota de lectura: Define carrito, que se utiliza en las instrucciones siguientes.
  const carrito = [
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    { ...libroA, cantidad: 1 }, // 19.990
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    { ...libroB, cantidad: 2 } // 29.980
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  ]

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('calcula subtotal y cantidad de unidades', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularSubtotal(carrito)).toBe(49970)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(contarUnidades(carrito)).toBe(3)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularSubtotal([])).toBe(0)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('calcula el descuento del cupón sobre el subtotal', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularDescuento(carrito, 'DUOC10')).toBe(4997)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularDescuento(carrito, 'LIBROS5')).toBe(2499)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularDescuento(carrito, 'INEXISTENTE')).toBe(0)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularDescuento(carrito)).toBe(0)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('cobra envío bajo $30.000 y lo hace gratis desde ese monto o con el carrito vacío', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularEnvio([{ ...libroB, cantidad: 1 }])).toBe(COSTO_ENVIO)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularEnvio(carrito)).toBe(0)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularEnvio([])).toBe(0)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('evalúa el envío gratis después de aplicar el descuento', () => {
    // Nota de lectura: Define bajoElMonto, que se utiliza en las instrucciones siguientes.
    const bajoElMonto = [{ ...libroB, cantidad: 2 }] // 29.980, bajo $30.000
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularEnvio(bajoElMonto)).toBe(COSTO_ENVIO)
    // Nota de lectura: Define conCupon, que se utiliza en las instrucciones siguientes.
    const conCupon = [{ ...libroA, cantidad: 2 }] // 39.980; con 10% queda 35.982
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularEnvio(conCupon, calcularDescuento(conCupon, 'DUOC10'))).toBe(0)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('calcula el total con descuento y envío', () => {
    // 49.970 - 4.997 = 44.973 (envío gratis)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularTotal(carrito, 'DUOC10')).toBe(44973)
    // 14.990 + 3.990 de envío
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(calcularTotal([{ ...libroB, cantidad: 1 }])).toBe(18980)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('buscarCupon', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('rechaza un código vacío', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(buscarCupon('   ')).toEqual({ valido: false, codigo: '', mensaje: 'Escribe un código de cupón.' })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('rechaza un cupón que no existe', () => {
    // Nota de lectura: Define resultado, que se utiliza en las instrucciones siguientes.
    const resultado = buscarCupon('FALSO99')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(resultado.valido).toBe(false)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(resultado.mensaje).toBe('El cupón ingresado no es válido.')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('acepta un cupón válido sin importar mayúsculas ni espacios', () => {
    // Nota de lectura: Define resultado, que se utiliza en las instrucciones siguientes.
    const resultado = buscarCupon('  duoc10 ')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(resultado.valido).toBe(true)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(resultado.codigo).toBe('DUOC10')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(resultado.mensaje).toBe('Cupón DUOC10 aplicado: 10% de descuento.')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})