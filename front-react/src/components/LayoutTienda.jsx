import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function LayoutTienda() {
  return (
    <>
      <Header />
      <main className="store-main container py-4">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default LayoutTienda