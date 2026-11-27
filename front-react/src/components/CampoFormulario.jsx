// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function CampoFormulario({ id, label, mensajeError, ayuda, children }) {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <div className="mb-3">
      {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
      <label htmlFor={id} className="form-label">
        {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
        {label}
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </label>

      {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
      {children}

      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <div className="invalid-feedback">{mensajeError}</div>

      {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
      {ayuda && <div className="form-text">{ayuda}</div>}
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </div>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default CampoFormulario