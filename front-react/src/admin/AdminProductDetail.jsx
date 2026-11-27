// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCallback } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useParams } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { validarLibro, tieneStockBajo } from './adminApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useAdminResource } from './useAdminResource'

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default function AdminProductDetail() {
  // Nota de lectura: Obtiene el identificador definido en la URL.
  const { id } = useParams()
  // Se consulta el identificador de la URL, incluso al recargar directamente la página.
  // Nota de lectura: Mantiene estable la función mientras no cambien sus dependencias.
  const cargar = useCallback(async () => validarLibro(await solicitar(`/books/${encodeURIComponent(id)}`)), [id])
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const { data: book, loading, error, retry } = useAdminResource(cargar)
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <div className="admin-heading"><h1>Detalle de producto</h1></div>
    {/* Nota de lectura: Anuncia carga o confirmación sin tratarla como error. */}
    {loading && <p role="status">Cargando libro…</p>}
    {/* Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla. */}
    {error && <div role="alert" className="alert alert-danger"><p>{error}</p><button className="btn btn-outline-danger" onClick={retry}>Reintentar</button></div>}
    {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
    {book && <div className="admin-form"><dl>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <dt>Título</dt><dd>{book.title}</dd><dt>Autor</dt><dd>{book.author}</dd>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <dt>Precio</dt><dd>${book.price.toLocaleString('es-CL')}</dd>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <dt>Stock</dt><dd>{book.stock} {tieneStockBajo(book) ? '(Stock bajo)' : ''}</dd>
    {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
    </dl><Link className="btn btn-primary" to={`/admin/productos/${encodeURIComponent(id)}/editar`}>Editar producto</Link></div>}
    {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
    <Link className="btn btn-outline-secondary mt-3" to="/admin/productos">Volver al listado</Link>
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </>
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
