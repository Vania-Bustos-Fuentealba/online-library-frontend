// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { regiones } from '../data/regiones'

// Registro y administración usan el mismo formulario y las mismas reglas.
// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default function ProfileFields({ form, onChange, errors = {}, lockedEmail = false }) {
  // Nota de lectura: Define input, que se utiliza en las instrucciones siguientes.
  const input = (name, label, maxLength, type = 'text', required = true) => <div className="col-md-6" key={name}>
    {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
    <label className="form-label" htmlFor={'profile-' + name}>{label}</label>
    {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
    <input className={'form-control' + (errors[name] ? ' is-invalid' : '')} id={'profile-' + name}
      name={name} type={type} maxLength={maxLength} value={form[name] ?? ''} onChange={onChange}
      disabled={name === 'email' && lockedEmail} required={required} aria-describedby={errors[name] ? name + '-error' : undefined} />
    {/* Nota de lectura: Asigna o compara el valor de esta parte de la expresión. */}
    {errors[name] && <div className="invalid-feedback" id={name + '-error'}>{errors[name]}</div>}
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </div>
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <>
    {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
    {input('run', 'RUN (sin puntos ni guion)', 9)}
    {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
    {input('name', 'Nombre', 50)}
    {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
    {input('lastName', 'Apellidos', 100)}
    {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
    {input('email', 'Correo electrónico', 100, 'email')}
    {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
    {input('birthDate', 'Fecha de nacimiento (opcional)', undefined, 'date', false)}
    {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
    <div className="col-md-6"><label htmlFor="profile-region" className="form-label">Región</label>
      {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
      <select id="profile-region" name="region" className={'form-select' + (errors.region ? ' is-invalid' : '')} value={form.region} onChange={onChange} required>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <option value="">Selecciona una región</option>{Object.keys(regiones).map(region => <option key={region}>{region}</option>)}
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </select>{errors.region && <div className="invalid-feedback">{errors.region}</div>}
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </div>
    {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
    <div className="col-md-6"><label htmlFor="profile-commune" className="form-label">Comuna</label>
      {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
      <select id="profile-commune" name="commune" className={'form-select' + (errors.commune ? ' is-invalid' : '')} value={form.commune} onChange={onChange} disabled={!form.region} required>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <option value="">Selecciona una comuna</option>{(regiones[form.region] ?? []).map(commune => <option key={commune}>{commune}</option>)}
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </select>{errors.commune && <div className="invalid-feedback">{errors.commune}</div>}
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </div>
    {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
    {input('address', 'Dirección', 300)}
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </>
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
