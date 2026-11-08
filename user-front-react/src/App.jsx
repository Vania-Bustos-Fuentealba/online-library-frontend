import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Nosotros from './pages/Nosotros'
import Blog from './pages/Blog'
import DetalleBlog from './pages/DetalleBlog'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Contacto from './pages/Contacto'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<DetalleBlog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/contacto" element={<Contacto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App