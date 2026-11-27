// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Layout from './components/Layout'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import LayoutTienda from './components/LayoutTienda'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Inicio from './pages/Inicio'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Productos from './pages/Productos'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import DetalleProducto from './pages/DetalleProducto'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Carrito from './pages/Carrito'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Checkout from './pages/Checkout'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Nosotros from './pages/Nosotros'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Blog from './pages/Blog'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import DetalleBlog from './pages/DetalleBlog'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Login from './pages/Login'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Registro from './pages/Registro'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Contacto from './pages/Contacto'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminLayout from './admin/AdminLayout'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminDashboard from './admin/AdminDashboard'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminProducts from './admin/AdminProducts'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminProductForm from './admin/AdminProductForm'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminProductDetail from './admin/AdminProductDetail'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminUsers from './admin/AdminUsers'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminUserForm from './admin/AdminUserForm'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminOrders from './admin/AdminOrders'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import SessionRenewal from './components/SessionRenewal'

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function App() {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <BrowserRouter>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <SessionRenewal />
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <Routes>
        {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
        <Route element={<LayoutTienda />}>
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/" element={<Inicio />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/productos" element={<Productos />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/productos/:id" element={<DetalleProducto />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/carrito" element={<Carrito />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/checkout" element={<Checkout />} />
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </Route>

        {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
        <Route element={<Layout />}>
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/nosotros" element={<Nosotros />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/blog" element={<Blog />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/blog/:id" element={<DetalleBlog />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/login" element={<Login />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/registro" element={<Registro />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="/contacto" element={<Contacto />} />
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </Route>

        {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route index element={<AdminDashboard />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="productos" element={<AdminProducts />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="productos/nuevo" element={<AdminProductForm />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="productos/:id" element={<AdminProductDetail />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="productos/:id/editar" element={<AdminProductForm />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="pedidos" element={<AdminOrders />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="pedidos/:id" element={<AdminOrders />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="usuarios" element={<AdminUsers />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="usuarios/nuevo" element={<AdminUserForm />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="usuarios/:id" element={<AdminUserForm />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="usuarios/:id/editar" element={<AdminUserForm />} />
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </Route>
        {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
        <Route path="/vendedor" element={<AdminLayout seller />}>
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route index element={<AdminProducts readOnly base="/vendedor" />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="productos" element={<AdminProducts readOnly base="/vendedor" />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="productos/:id" element={<AdminProductDetail readOnly base="/vendedor" />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="pedidos" element={<AdminOrders base="/vendedor" />} />
          {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
          <Route path="pedidos/:id" element={<AdminOrders base="/vendedor" />} />
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </Route>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </Routes>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </BrowserRouter>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default App
