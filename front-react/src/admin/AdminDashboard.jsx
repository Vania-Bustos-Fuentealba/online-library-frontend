// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cargarLibros, cargarUsuarios, STOCK_BAJO, tieneStockBajo } from './adminApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useAdminResource } from './useAdminResource'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function Indicador({ titulo, recurso, valor }) {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <article>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <span>{titulo}</span>
    {/* Nota de lectura: Anuncia carga o confirmación sin tratarla como error. */}
    {recurso.loading ? <p role="status">Cargando…</p> : recurso.error ?
      // Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla.
      <div role="alert"><p>{recurso.error}</p><button className="btn btn-outline-danger" onClick={recurso.retry}>Reintentar {titulo.toLowerCase()}</button></div> :
      // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
      <strong>{valor(recurso.data)}</strong>}
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </article>
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function AdminDashboard() {
  // Consultas independientes: un fallo de usuarios no oculta los libros disponibles.
  // Nota de lectura: Define books, que se utiliza en las instrucciones siguientes.
  const books = useAdminResource(cargarLibros)
  // Nota de lectura: Define users, que se utiliza en las instrucciones siguientes.
  const users = useAdminResource(cargarUsuarios)
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <div className="admin-heading"><p className="admin-eyebrow">Panel de control</p><h1>Resumen</h1><p>Administra el catálogo y las cuentas de la biblioteca.</p></div>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <section className="admin-stats" aria-label="Indicadores">
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <Indicador titulo="Productos" recurso={books} valor={(items) => items.length} />
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <Indicador titulo="Usuarios" recurso={users} valor={(items) => items.length} />
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <Indicador titulo="Stock bajo" recurso={books} valor={(items) => items.filter(tieneStockBajo).length} />
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </section>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <p>Stock bajo: {STOCK_BAJO} unidades o menos, según las existencias del catálogo.</p>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <section className="admin-shortcuts">
      {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
      <article><h2>Catálogo</h2><p>Agrega libros, actualiza sus datos y revisa el stock disponible.</p><Link className="btn btn-primary" to="/admin/productos">Gestionar productos</Link></article>
      {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
      <article><h2>Usuarios</h2><p>Consulta las cuentas y administra sus datos y roles.</p><Link className="btn btn-primary" to="/admin/usuarios">Gestionar usuarios</Link></article>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </section>
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </>
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default AdminDashboard
