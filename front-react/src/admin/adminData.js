const PRODUCT_KEY = 'online-library-admin-products'

const initialProducts = [
  { id: '1', code: 'LIB001', name: 'Alas de sangre', author: 'Rebecca Yarros', category: 'Fantasía', price: 19990, stock: 12, criticalStock: 5, description: 'Violet Sorrengail esperaba una vida tranquila entre libros, pero la general la obliga a ingresar al cuadrante de jinetes de dragones.', image: '/books/Alas_de_sangre.webp' },
  { id: '2', code: 'LIB002', name: 'Crimen y castigo', author: 'Fiódor Dostoievski', category: 'Clásicos', price: 11990, stock: 8, criticalStock: 5, description: 'Un estudiante empobrecido de San Petersburgo comete un asesinato y se enfrenta a la culpa como su verdadero castigo.', image: '/books/crimen_y_castigo.webp' },
  { id: '3', code: 'LIB003', name: 'El buzón de las impuras', author: 'Francisca Solar', category: 'Narrativa', price: 14990, stock: 5, criticalStock: 5, description: 'Una novela sobre mujeres que se escriben en secreto y convierten la palabra escrita en refugio y rebeldía.', image: '/books/El_Buzon_De_Las_Impuras.webp' },
  { id: '4', code: 'LIB004', name: 'Mientras Yubooh duerme', author: 'Paulinaapc', category: 'Narrativa', price: 12990, stock: 0, criticalStock: 3, description: 'Una historia ilustrada de misterio y amistad.', image: '/books/Mientras_Yubooh_Duerme.webp' },
  { id: '5', code: 'LIB005', name: 'Una corte de rosas y espinas', author: 'Sarah J. Maas', category: 'Fantasía', price: 16990, stock: 20, criticalStock: 5, description: 'Feyre es llevada a las tierras de las hadas, donde descubre una maldición que amenaza a dos mundos.', image: '/books/acotar-1.jpg' },
]

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getProducts = () => read(PRODUCT_KEY, initialProducts)
export const saveProducts = (items) => write(PRODUCT_KEY, items)
export function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
