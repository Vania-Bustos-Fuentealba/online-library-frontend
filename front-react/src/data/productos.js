// Catálogo de libros. Las imágenes viven en public/img/
const productos = [
  {
    id: 1,
    codigo: 'LIB001',
    nombre: 'Alas de sangre',
    autor: 'Rebecca Yarros',
    descripcion:
      'Primer libro de la saga Empíreo: Violet Sorrengail es reclutada para convertirse en jinete de dragón en el brutal Cuadrante de Basgiath.',
    categoria: 'Fantasía romántica',
    precio: 19990,
    stock: 10,
    stockCritico: 5,
    imagen: '/books/Alas_de_sangre.webp',
  },
  {
    id: 2,
    codigo: 'LIB002',
    nombre: 'Crimen y castigo',
    autor: 'Fiódor Dostoievski',
    descripcion:
      'Clásico de la literatura rusa que sigue a Raskólnikov, un joven atormentado por la culpa tras cometer un asesinato.',
    categoria: 'Clásicos',
    precio: 14990,
    stock: 8,
    stockCritico: 5,
    imagen: '/books/crimen_y_castigo.webp',
  },
  {
    id: 3,
    codigo: 'LIB003',
    nombre: 'El Buzón de las Impuras',
    autor: 'Francisca Solar',
    descripcion:
      'Novela histórica chilena ambientada en 1863, inspirada en el incendio de la Iglesia de la Compañía en Santiago.',
    categoria: 'Ficción histórica',
    precio: 17990,
    stock: 6,
    stockCritico: 5,
    imagen: '/books/El_Buzon_De_Las_Impuras.webp',
  },
  {
    id: 4,
    codigo: 'LIB004',
    nombre: 'Mientras Yubooh Duerme',
    autor: 'Paulina Palacios',
    descripcion:
      'Novela romántica chilena, parte de una popular saga surgida originalmente como historia por entregas.',
    categoria: 'Romance',
    precio: 15990,
    stock: 4,
    stockCritico: 5,
    imagen: '/books/Mientras_Yubooh_Duerme.webp',
  },
  {
    id: 5,
    codigo: 'LIB005',
    nombre: 'Una corte de rosas y espinas',
    autor: 'Sarah J. Maas',
    descripcion:
      'Primer libro de la saga ACOTAR: Feyre es arrastrada a un reino mágico tras matar a un lobo que resulta ser una criatura feérica.',
    categoria: 'Fantasía',
    precio: 18990,
    stock: 0,
    stockCritico: 5,
    imagen: '/books/acotar-1.jpg',
  },
]

export default productos