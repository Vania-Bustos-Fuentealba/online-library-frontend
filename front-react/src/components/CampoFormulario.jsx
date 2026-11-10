function CampoFormulario({ id, label, mensajeError, ayuda, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>

      {children}

      <div className="invalid-feedback">{mensajeError}</div>

      {ayuda && <div className="form-text">{ayuda}</div>}
    </div>
  )
}

export default CampoFormulario