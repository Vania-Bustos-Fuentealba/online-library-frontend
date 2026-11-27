// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { agregarItem, cambiarCantidad, validarCarritoGuardado } from './carrito'
// Nota de lectura: Define libro, que se utiliza en las instrucciones siguientes.
const libro = { id: 1, nombre: 'Libro', precio: 1000, stock: 4, cantidad: 2 }
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('carrito integrado', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('descarta almacenamiento corrupto, duplicados y cantidades imposibles', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(validarCarritoGuardado({ cantidad: 2 })).toEqual([])
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(validarCarritoGuardado([null, libro, libro, { ...libro, id: 2, cantidad: -1 }])).toEqual([libro])
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('actualiza precio y stock al agregar nuevamente un libro real', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(agregarItem([libro], { ...libro, precio: 2000, stock: 2 })[0]).toMatchObject({ precio: 2000, stock: 2, cantidad: 2 })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('rechaza cantidad fraccionaria y libros agotados', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(agregarItem([], { ...libro, stock: 0 })).toEqual([])
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(cambiarCantidad([libro], 1, 1.5)).toEqual([libro])
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
