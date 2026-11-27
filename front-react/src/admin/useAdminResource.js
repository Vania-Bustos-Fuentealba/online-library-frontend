// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useEffect, useState } from 'react'

// Cada pantalla conserva carga, error y reintento; nunca reemplaza un fallo por datos demo.
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function useAdminResource(cargar) {
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [result, setResult] = useState(null)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [version, setVersion] = useState(0)

  // Nota de lectura: Sincroniza el componente con una consulta o evento externo y permite limpiar al desmontarse.
  useEffect(() => {
    // Ignora respuestas tardías cuando se abandona la pantalla o cambia el recurso.
    // Nota de lectura: Define active, que se utiliza en las instrucciones siguientes.
    let active = true
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    cargar()
      // Nota de lectura: Define una función corta usada como callback, condición o transformación.
      .then((data) => { if (active) setResult({ cargar, version, data, error: '' }) })
      // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
      .catch((err) => { if (active) setResult({ cargar, version, data: null, error: err.message || 'No se pudieron cargar los datos.' }) })
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return () => { active = false }
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  }, [cargar, version])

  // Un resultado anterior nunca se muestra como si perteneciera a la nueva consulta.
  // Nota de lectura: Define loading, que se utiliza en las instrucciones siguientes.
  const loading = result?.cargar !== cargar || result?.version !== version
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return { data: loading ? null : result.data, loading, error: loading ? '' : result.error, retry: () => setVersion((value) => value + 1) }
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
