import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { solicitar } from '../services/api'
import { validarLibro, tieneStockBajo } from './adminApi'
import { useAdminResource } from './useAdminResource'

export default function AdminProductDetail() {
  const { id } = useParams()
  // Se consulta el identificador de la URL, incluso al recargar directamente la página.
  const cargar = useCallback(async () => validarLibro(await solicitar(`/books/${encodeURIComponent(id)}`)), [id])
  const { data: book, loading, error, retry } = useAdminResource(cargar)
  return <>
    <div className="admin-heading"><h1>Detalle de producto</h1></div>
    {loading && <p role="status">Cargando libro…</p>}
    {error && <div role="alert" className="alert alert-danger"><p>{error}</p><button className="btn btn-outline-danger" onClick={retry}>Reintentar</button></div>}
    {book && <div className="admin-form"><dl>
      <dt>Título</dt><dd>{book.title}</dd><dt>Autor</dt><dd>{book.author}</dd>
      <dt>Precio</dt><dd>${book.price.toLocaleString('es-CL')}</dd>
      <dt>Stock</dt><dd>{book.stock} {tieneStockBajo(book) ? '(Stock bajo)' : ''}</dd>
    </dl><Link className="btn btn-primary" to={`/admin/productos/${encodeURIComponent(id)}/editar`}>Editar producto</Link></div>}
    <Link className="btn btn-outline-secondary mt-3" to="/admin/productos">Volver al listado</Link>
  </>
}
