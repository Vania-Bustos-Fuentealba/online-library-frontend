let blogs = [
  {
    id: 1,
    titulo: 'El poder de la lectura',
    resumen:
      'Leer puede ser una excelente forma de aprender, descubrir nuevas ideas y conocer diferentes perspectivas a través de las historias.',
    imagen:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Libros abiertos sobre una mesa',
    contenido: [
      'La lectura es una actividad que permite adquirir nuevos conocimientos, descubrir diferentes perspectivas y desarrollar la imaginación. A través de los libros podemos conocer historias, culturas y experiencias diferentes a las nuestras.',
      'Además de ser una forma de entretenimiento, leer puede ayudar a mejorar la comprensión de textos y ampliar el vocabulario. También permite dedicar un momento del día a la concentración y al aprendizaje.',
      'En Online Library buscamos facilitar el acceso a contenidos interesantes para que cada usuario pueda descubrir nuevos libros y encontrar temas que sean de su interés.'
    ]
  },
  {
    id: 2,
    titulo: 'Curiosidades sobre los libros',
    resumen:
      'Los libros han acompañado a la humanidad durante siglos y continúan siendo una de las principales formas de transmitir conocimiento y cultura.',
    imagen:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    alt: 'Colección de libros',
    contenido: [
      'Los libros han acompañado a la humanidad durante siglos. Desde los manuscritos copiados a mano hasta los libros electrónicos actuales, han sido una de las principales formas de transmitir conocimiento y cultura.',
      'Hoy conviven distintos formatos: libros impresos, digitales y audiolibros. Cada persona puede elegir el que mejor se adapte a su ritmo y a su forma de leer.'
    ]
  },
  {
    id: 3,
    titulo: 'Cómo elegir tu próxima lectura',
    resumen:
      'Género, autor, extensión y recomendaciones son algunos factores que pueden ayudarte a encontrar un libro que se adapte a tus intereses.',
    imagen:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Estantería llena de libros',
    contenido: [
      'Elegir un libro puede ser difícil cuando hay tantas opciones. Una buena forma de partir es pensar en el género que más te gusta, ya sea fantasía, clásicos o narrativa.',
      'También puedes considerar la extensión del libro, el autor o las recomendaciones de otras personas. Leer las primeras páginas ayuda a saber si la historia te atrapa.'
    ]
  },
  {
    id: 4,
    titulo: 'Crear un hábito de lectura',
    resumen:
      'Reservar unos minutos al día para leer puede ayudarte a incorporar la lectura como una actividad habitual.',
    imagen:
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80',
    alt: 'Libro y taza sobre una mesa',
    contenido: [
      'Crear un hábito de lectura no requiere comenzar leyendo durante varias horas. Una buena alternativa es dedicar algunos minutos al día y aumentar progresivamente el tiempo según la disponibilidad de cada persona.',
      'Elegir un libro relacionado con nuestros intereses también puede hacer que la lectura sea una experiencia más entretenida. Novelas, cuentos, tecnología, historia o aprendizaje son algunas de las alternativas que podemos explorar.',
      'Lo importante es encontrar un momento cómodo para leer y mantener la constancia. Con el tiempo, esos pequeños momentos pueden convertirse en un hábito que permita descubrir nuevos conocimientos y disfrutar de diferentes historias.'
    ]
  }
]

// READ: todos
export function obtenerBlogs() {
  return blogs.map((blog) => ({ ...blog }))
}

// READ: uno por id (devuelve null si no existe)
export function obtenerBlogPorId(id) {
  const blog = blogs.find((b) => b.id === Number(id))
  return blog ? { ...blog } : null
}

// CREATE
export function crearBlog(datos) {
  const nuevoId = blogs.length ? Math.max(...blogs.map((b) => b.id)) + 1 : 1
  const nuevo = { ...datos, id: nuevoId }
  blogs.push(nuevo)
  return { ...nuevo }
}

// UPDATE (devuelve el blog actualizado o null)
export function actualizarBlog(id, cambios) {
  const indice = blogs.findIndex((b) => b.id === Number(id))
  if (indice === -1) return null
  blogs[indice] = { ...blogs[indice], ...cambios, id: blogs[indice].id }
  return { ...blogs[indice] }
}

// DELETE (devuelve true si borró algo)
export function eliminarBlog(id) {
  const antes = blogs.length
  blogs = blogs.filter((b) => b.id !== Number(id))
  return blogs.length < antes
}