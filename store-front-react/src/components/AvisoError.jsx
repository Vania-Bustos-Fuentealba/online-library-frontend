function AvisoError({ mensaje }) {
  return (
    <div className="alert alert-danger" role="alert">
      {mensaje}
    </div>
  )
}

export default AvisoError