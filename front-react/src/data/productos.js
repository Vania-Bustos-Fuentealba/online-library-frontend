// Catálogo de libros. Las imágenes viven en public/img/
// Nota de lectura: Define productos, que se utiliza en las instrucciones siguientes.
const productos = [
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    id: 1,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    codigo: 'LIB001',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    nombre: 'Alas de sangre',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    autor: 'Rebecca Yarros',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    descripcion:
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      'Primer libro de la saga Empíreo: Violet Sorrengail es reclutada para convertirse en jinete de dragón en el brutal Cuadrante de Basgiath.',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    categoria: 'Fantasía romántica',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    precio: 19990,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stock: 10,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stockCritico: 5,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    imagen: '/books/Alas_de_sangre.webp',
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  },
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    id: 2,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    codigo: 'LIB002',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    nombre: 'Crimen y castigo',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    autor: 'Fiódor Dostoievski',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    descripcion:
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      'Clásico de la literatura rusa que sigue a Raskólnikov, un joven atormentado por la culpa tras cometer un asesinato.',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    categoria: 'Clásicos',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    precio: 14990,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stock: 8,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stockCritico: 5,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    imagen: '/books/crimen_y_castigo.webp',
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  },
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    id: 3,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    codigo: 'LIB003',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    nombre: 'El Buzón de las Impuras',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    autor: 'Francisca Solar',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    descripcion:
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      'Novela histórica chilena ambientada en 1863, inspirada en el incendio de la Iglesia de la Compañía en Santiago.',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    categoria: 'Ficción histórica',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    precio: 17990,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stock: 6,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stockCritico: 5,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    imagen: '/books/El_Buzon_De_Las_Impuras.webp',
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  },
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    id: 4,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    codigo: 'LIB004',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    nombre: 'Mientras Yubooh Duerme',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    autor: 'Paulina Palacios',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    descripcion:
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      'Novela romántica chilena, parte de una popular saga surgida originalmente como historia por entregas.',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    categoria: 'Romance',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    precio: 15990,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stock: 4,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stockCritico: 5,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    imagen: '/books/Mientras_Yubooh_Duerme.webp',
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  },
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    id: 5,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    codigo: 'LIB005',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    nombre: 'Una corte de rosas y espinas',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    autor: 'Sarah J. Maas',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    descripcion:
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      'Primer libro de la saga ACOTAR: Feyre es arrastrada a un reino mágico tras matar a un lobo que resulta ser una criatura feérica.',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    categoria: 'Fantasía',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    precio: 18990,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stock: 0,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    stockCritico: 5,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    imagen: '/books/acotar-1.jpg',
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  },
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
]

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default productos