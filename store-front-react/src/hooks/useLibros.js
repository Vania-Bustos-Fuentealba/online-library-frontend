import { useEffect, useState } from 'react'
import { obtenerLibros, obtenerLibro } from '../services/api'

// Carga todos los libros desde la API cuando el componente aparece en pantalla
export function useLibros() {
  const [estado, setEstado] = useState({ libros: [], cargando: true, error: '' })

  useEffect(() => {
    let activo = true

    obtenerLibros()
      .then((libros) => {
        if (activo) setEstado({ libros, cargando: false, error: '' })
      })
      .catch((error) => {
        if (activo) setEstado({ libros: [], cargando: false, error: error.message })
      })

    // Si el componente se desmonta antes de recibir la respuesta, se ignora
    return () => {
      activo = false
    }
  }, [])

  return estado
}

// Carga un solo libro según su id
export function useLibro(id) {
  const [resultado, setResultado] = useState({ id: null, libro: null, noEncontrado: false, error: '' })

  useEffect(() => {
    let activo = true

    obtenerLibro(id)
      .then((libro) => {
        if (activo) setResultado({ id, libro, noEncontrado: false, error: '' })
      })
      .catch((error) => {
        if (!activo) return
        const noEncontrado = error.estado === 404
        setResultado({ id, libro: null, noEncontrado, error: noEncontrado ? '' : error.message })
      })

    return () => {
      activo = false
    }
  }, [id])

  // Mientras la respuesta no corresponda al id actual, se considera "cargando"
  const cargando = resultado.id !== id

  return {
    libro: cargando ? null : resultado.libro,
    cargando,
    noEncontrado: cargando ? false : resultado.noEncontrado,
    error: cargando ? '' : resultado.error,
  }
}