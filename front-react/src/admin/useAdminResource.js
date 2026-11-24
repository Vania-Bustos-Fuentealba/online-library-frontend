import { useEffect, useState } from 'react'

// Cada pantalla conserva carga, error y reintento; nunca reemplaza un fallo por datos demo.
export function useAdminResource(cargar) {
  const [result, setResult] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    // Ignora respuestas tardías cuando se abandona la pantalla o cambia el recurso.
    let active = true
    cargar()
      .then((data) => { if (active) setResult({ cargar, version, data, error: '' }) })
      .catch((err) => { if (active) setResult({ cargar, version, data: null, error: err.message || 'No se pudieron cargar los datos.' }) })
    return () => { active = false }
  }, [cargar, version])

  // Un resultado anterior nunca se muestra como si perteneciera a la nueva consulta.
  const loading = result?.cargar !== cargar || result?.version !== version
  return { data: loading ? null : result.data, loading, error: loading ? '' : result.error, retry: () => setVersion((value) => value + 1) }
}
