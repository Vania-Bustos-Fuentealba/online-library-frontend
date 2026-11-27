// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { StrictMode } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { createRoot } from 'react-dom/client'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import 'bootstrap/dist/css/bootstrap.min.css'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import './index.css'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import './styles/store.css'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import './styles/user.css'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import App from './App.jsx'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import CarritoProvider from './context/CarritoProvider.jsx'

// Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
createRoot(document.getElementById('root')).render(
  // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
  <StrictMode>
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    <CarritoProvider>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <App />
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </CarritoProvider>
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </StrictMode>,
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
)