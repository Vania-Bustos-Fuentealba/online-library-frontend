function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="text-center py-5" role="status">
      <div className="spinner-border" style={{ color: 'var(--morado)' }} aria-hidden="true"></div>
      <p className="mt-3 text-muted">{texto}</p>
    </div>
  )
}

export default Cargando