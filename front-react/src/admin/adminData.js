// Nota de lectura: Define PRODUCT_KEY, que se utiliza en las instrucciones siguientes.
const PRODUCT_KEY = 'online-library-admin-products'

// Nota de lectura: Define initialProducts, que se utiliza en las instrucciones siguientes.
const initialProducts = [
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  { id: '1', code: 'LIB001', name: 'Alas de sangre', author: 'Rebecca Yarros', category: 'Fantasía', price: 19990, stock: 12, criticalStock: 5, description: 'Violet Sorrengail esperaba una vida tranquila entre libros, pero la general la obliga a ingresar al cuadrante de jinetes de dragones.', image: '/books/Alas_de_sangre.webp' },
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  { id: '2', code: 'LIB002', name: 'Crimen y castigo', author: 'Fiódor Dostoievski', category: 'Clásicos', price: 11990, stock: 8, criticalStock: 5, description: 'Un estudiante empobrecido de San Petersburgo comete un asesinato y se enfrenta a la culpa como su verdadero castigo.', image: '/books/crimen_y_castigo.webp' },
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  { id: '3', code: 'LIB003', name: 'El buzón de las impuras', author: 'Francisca Solar', category: 'Narrativa', price: 14990, stock: 5, criticalStock: 5, description: 'Una novela sobre mujeres que se escriben en secreto y convierten la palabra escrita en refugio y rebeldía.', image: '/books/El_Buzon_De_Las_Impuras.webp' },
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  { id: '4', code: 'LIB004', name: 'Mientras Yubooh duerme', author: 'Paulinaapc', category: 'Narrativa', price: 12990, stock: 0, criticalStock: 3, description: 'Una historia ilustrada de misterio y amistad.', image: '/books/Mientras_Yubooh_Duerme.webp' },
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  { id: '5', code: 'LIB005', name: 'Una corte de rosas y espinas', author: 'Sarah J. Maas', category: 'Fantasía', price: 16990, stock: 20, criticalStock: 5, description: 'Feyre es llevada a las tierras de las hadas, donde descubre una maldición que amenaza a dos mundos.', image: '/books/acotar-1.jpg' },
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
]

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function read(key, fallback) {
  // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
  try {
    // Nota de lectura: Lee el valor persistido bajo esa clave en este navegador.
    const value = localStorage.getItem(key)
    // Nota de lectura: Interpreta JSON como datos; una respuesta inválida produce un error.
    return value ? JSON.parse(value) : fallback
  // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
  } catch {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return fallback
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function write(key, value) {
  // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
  localStorage.setItem(key, JSON.stringify(value))
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
export const getProducts = () => read(PRODUCT_KEY, initialProducts)
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
export const saveProducts = (items) => write(PRODUCT_KEY, items)
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function makeId() {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
