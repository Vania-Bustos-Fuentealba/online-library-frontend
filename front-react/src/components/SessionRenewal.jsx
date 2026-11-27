// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useEffect } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { renovarSiNecesario } from '../services/api'

// Renueva mientras la aplicación está visible. Un token vencido exige un nuevo login.
// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default function SessionRenewal() {
  // Nota de lectura: Sincroniza el componente con una consulta o evento externo y permite limpiar al desmontarse.
  useEffect(() => {
    // Nota de lectura: Define comprobar, que se utiliza en las instrucciones siguientes.
    const comprobar = () => {
      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (document.visibilityState === 'visible') renovarSiNecesario().catch(() => {})
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
    // Nota de lectura: Define intervalo, que se utiliza en las instrucciones siguientes.
    const intervalo = window.setInterval(comprobar, 30000)
    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    window.addEventListener('focus', comprobar)
    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    document.addEventListener('visibilitychange', comprobar)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    comprobar()
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return () => {
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      window.clearInterval(intervalo)
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      window.removeEventListener('focus', comprobar)
      // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
      document.removeEventListener('visibilitychange', comprobar)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }, [])
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return null
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
