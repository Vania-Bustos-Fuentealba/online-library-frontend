// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCallback, useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useParams } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useAdminResource } from './useAdminResource'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { formatearPrecio } from '../utils/formato'

// ADMIN y SELLER consultan órdenes; el Gateway comprueba el permiso en cada petición.
// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default function AdminOrders({ base = '/admin' }) {
  // Nota de lectura: Obtiene el identificador definido en la URL.
  const { id } = useParams()
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [query, setQuery] = useState('')
  // Nota de lectura: Mantiene estable la función mientras no cambien sus dependencias.
  const cargar = useCallback(async () => {
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    const data = await solicitar(id ? `/pedidos/${encodeURIComponent(id)}` : '/pedidos')
    // Nota de lectura: Define rows, que se utiliza en las instrucciones siguientes.
    const rows = id ? [data] : data
    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!Array.isArray(rows) || rows.some(row => !row || row.id == null || !Number.isFinite(row.total))) throw new Error('El servidor devolvió órdenes inválidas.')
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return rows
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  }, [id])
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const { data, loading, error, retry } = useAdminResource(cargar)
  // Nota de lectura: Conserva los elementos que cumplen la condición; sirve para búsqueda o conteo.
  const rows = (data ?? []).filter(row => `${row.id} ${row.cliente} ${row.correo}`.toLowerCase().includes(query.trim().toLowerCase()))
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <div className="admin-heading"><h1>{id ? 'Detalle de orden' : 'Órdenes'}</h1><p>Consulta de pedidos registrados. Pendiente de pago no significa pagado.</p></div>
    {/* Nota de lectura: Anuncia carga o confirmación sin tratarla como error. */}
    {loading && <p role="status">Cargando órdenes…</p>}
    {/* Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla. */}
    {error && <div role="alert" className="alert alert-danger"><p>{error}</p><button className="btn btn-outline-danger" onClick={retry}>Reintentar</button></div>}
    {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
    {!id && <div className="admin-toolbar"><label className="visually-hidden" htmlFor="orderSearch">Buscar órdenes</label><input id="orderSearch" className="form-control" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por ID, cliente o correo" /></div>}
    {/* Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual. */}
    {!loading && !error && (id ? rows.map(order => <article key={order.id}>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <dl><dt>Número</dt><dd>{order.id}</dd><dt>Cliente</dt><dd>{order.cliente}</dd><dt>Correo</dt><dd>{order.correo}</dd>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <dt>Dirección</dt><dd>{order.direccion}, {order.comuna}</dd><dt>Estado</dt><dd>{order.estado}</dd>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <dt>Preferencia de pago</dt><dd>{order.metodoPago}</dd><dt>Total</dt><dd>{formatearPrecio(order.total)}</dd></dl>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="admin-table-wrap"><table className="table"><thead><tr><th>Libro</th><th>Cantidad</th><th>Subtotal</th></tr></thead><tbody>
        {/* Nota de lectura: Transforma cada elemento, por ejemplo de entidad a DTO o de dato a fila visual. */}
        {order.items.map(item => <tr key={item.libroId}><td>{item.nombre}</td><td>{item.cantidad}</td><td>{formatearPrecio(item.subtotal)}</td></tr>)}
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </tbody></table></div>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </article>) : <div className="admin-table-wrap"><table className="table table-hover"><thead><tr><th>Orden</th><th>Cliente</th><th>Estado</th><th>Total</th></tr></thead><tbody>
      {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
      {rows.map(order => <tr key={order.id}><td><Link to={`${base}/pedidos/${order.id}`}>Orden {order.id}</Link></td><td>{order.cliente}</td><td>{order.estado}</td><td>{formatearPrecio(order.total)}</td></tr>)}
      {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
      {!rows.length && <tr><td colSpan="4">No se encontraron órdenes.</td></tr>}
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </tbody></table></div>)}
    {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
    {id && <Link className="btn btn-outline-secondary mt-3" to={`${base}/pedidos`}>Volver a órdenes</Link>}
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </>
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
