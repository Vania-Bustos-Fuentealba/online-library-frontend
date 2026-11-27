// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useEffect, useState } from 'react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { Link, useNavigate, useParams } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { validarLibro } from './adminApi'

// Nota de lectura: Define emptyProduct, que se utiliza en las instrucciones siguientes.
const emptyProduct = {
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  name: '',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  author: '',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  price: '',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  stock: '',
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function ProductEditor({ id }) {
  // Nota de lectura: Obtiene la función para cambiar de pantalla desde código.
  const navigate = useNavigate()
  // Nota de lectura: Define isEditing, que se utiliza en las instrucciones siguientes.
  const isEditing = Boolean(id)

  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [form, setForm] = useState({ ...emptyProduct })
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [loading, setLoading] = useState(isEditing)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [saving, setSaving] = useState(false)
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [loadError, setLoadError] = useState('')
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [error, setError] = useState('')
  // Nota de lectura: Declara un estado de React y la función que lo actualiza; al cambiar vuelve a renderizar la pantalla.
  const [reload, setReload] = useState(0)

  // Nota de lectura: Sincroniza el componente con una consulta o evento externo y permite limpiar al desmontarse.
  useEffect(() => {
    // Nota de lectura: Define active, que se utiliza en las instrucciones siguientes.
    let active = true

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (!id) {
      // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
      return () => {
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        active = false
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
    async function loadProduct() {
      // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
      try {
        // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
        const book = await solicitar(
            // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
            `/books/${encodeURIComponent(id)}`
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        )

        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        validarLibro(book)

        // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
        if (active) {
          // Nota de lectura: Actualiza los valores visibles del formulario.
          setForm({
            // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
            name: book.title ?? '',
            // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
            author: book.author ?? '',
            // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
            price: String(book.price ?? ''),
            // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
            stock: String(book.stock ?? ''),
          // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
          })
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }
      // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
      } catch (err) {
        // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
        if (active) {
          // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
          setLoadError(
              // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
              err.message || 'No se pudo cargar el libro.'
          // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
          )
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }
      // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
      } finally {
        // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
        if (active) {
          // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
          setLoading(false)
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        }
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    loadProduct()

    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return () => {
      // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
      active = false
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  }, [id, reload])

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  function update(event) {
    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const { name, value } = event.target

    // Nota de lectura: Actualiza los valores visibles del formulario.
    setForm((current) => ({
      // Nota de lectura: Aporta el valor ...current a la declaración o llamada abierta.
      ...current,
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      [name]: value,
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }))

    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setError('')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
  async function submit(event) {
    // Nota de lectura: Evita el envío HTML tradicional para controlar la validación con React.
    event.preventDefault()

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (loading || saving || loadError) return

    // Validaciones compatibles con BookRequestDTO: precio positivo y stock entero.
    // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
    const title = form.name.trim()
    // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
    const author = form.author.trim()
    // Nota de lectura: Define price, que se utiliza en las instrucciones siguientes.
    const price = Number(form.price)
    // Nota de lectura: Define stock, que se utiliza en las instrucciones siguientes.
    const stock = Number(form.stock)

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (title.length < 2 || title.length > 150) {
      // Nota de lectura: Actualiza el mensaje de error que verá la persona.
      setError('El título debe tener entre 2 y 150 caracteres.')
      // Nota de lectura: Aporta el valor return a la declaración o llamada abierta.
      return
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (author.length < 2 || author.length > 100) {
      // Nota de lectura: Actualiza el mensaje de error que verá la persona.
      setError('El autor debe tener entre 2 y 100 caracteres.')
      // Nota de lectura: Aporta el valor return a la declaración o llamada abierta.
      return
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        form.price.trim() === '' ||
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        !Number.isFinite(price) ||
        // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
        price <= 0
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    ) {
      // Nota de lectura: Actualiza el mensaje de error que verá la persona.
      setError('El precio debe ser un número mayor que cero.')
      // Nota de lectura: Aporta el valor return a la declaración o llamada abierta.
      return
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (
        // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
        form.stock.trim() === '' ||
        // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
        !Number.isInteger(stock) ||
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        stock < 0 ||
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        stock > 2147483647
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    ) {
      // Nota de lectura: Actualiza el mensaje de error que verá la persona.
      setError(
          // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
          'El stock debe ser un número entero entre 0 y 2147483647.'
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      )
      // Nota de lectura: Aporta el valor return a la declaración o llamada abierta.
      return
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }

    // Nota de lectura: Marca la operación en curso para impedir envíos o borrados duplicados.
    setSaving(true)
    // Nota de lectura: Actualiza el mensaje de error que verá la persona.
    setError('')

    // Nota de lectura: Agrupa operaciones que pueden fallar para poder gestionar sus errores.
    try {
      // Nota de lectura: Define route, que se utiliza en las instrucciones siguientes.
      const route = isEditing
          // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
          ? `/books/${encodeURIComponent(id)}`
          // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
          : '/books'

      // Un único envío guarda los campos reales del libro mediante el Gateway.
      // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
      await solicitar(route, {
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        method: isEditing ? 'PUT' : 'POST',
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        body: {
          // Nota de lectura: Aporta el valor title a la declaración o llamada abierta.
          title,
          // Nota de lectura: Aporta el valor author a la declaración o llamada abierta.
          author,
          // Nota de lectura: Aporta el valor price a la declaración o llamada abierta.
          price,
          // Nota de lectura: Aporta el valor stock a la declaración o llamada abierta.
          stock,
        // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
        },
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      })

      // Nota de lectura: Cambia de pantalla; state transporta un mensaje y replace evita volver al formulario enviado.
      navigate('/admin/productos', { replace: true, state: { success: isEditing ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.' } })
    // Nota de lectura: Captura el error y elige una respuesta controlada en lugar de mostrar éxito.
    } catch (err) {
      // Nota de lectura: Actualiza el mensaje de error que verá la persona.
      setError(
          // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
          err.message || 'No se pudo guardar el libro.'
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      )
    // Nota de lectura: Ejecuta limpieza tanto si hubo éxito como si hubo error.
    } finally {
      // Nota de lectura: Marca la operación en curso para impedir envíos o borrados duplicados.
      setSaving(false)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (loading) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return (
        // Nota de lectura: Anuncia carga o confirmación sin tratarla como error.
        <div className="alert alert-info" role="status">
          Cargando libro…
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (loadError) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return (
        // Nota de lectura: Presenta el error con semántica accesible para lectores de pantalla.
        <div className="alert alert-danger" role="alert">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <p>{loadError}</p>

          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <div className="d-flex gap-2">
            {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
            <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                  setLoadError('')
                  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
                  setLoading(true)
                  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
                  setReload((value) => value + 1)
                // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
                }}
            >
              Reintentar
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </button>

            {/* Nota de lectura: Enlace de React Router hacia la pantalla indicada, sin recargar toda la aplicación. */}
            <Link
                className="btn btn-outline-secondary"
                to="/admin/productos"
            >
              Volver al listado
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </Link>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </div>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
      // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
      <>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <div className="admin-heading">
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <p className="admin-eyebrow">Catálogo</p>

          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <h1>
            {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </h1>

          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <p>Completa la información del libro.</p>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </div>

        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        <form
            className="admin-form"
            onSubmit={submit}
            noValidate
            aria-busy={saving}
        >
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          <fieldset disabled={saving}>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <legend className="visually-hidden">
              Datos del libro
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </legend>

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="row g-3">
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="col-md-6">
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label className="form-label" htmlFor="name">
                  Título
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>

                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
                <input
                    className="form-control"
                    id="name"
                    name="name"
                    minLength={2}
                    maxLength={150}
                    value={form.name}
                    onChange={update}
                    required
                />
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="col-md-6">
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label className="form-label" htmlFor="author">
                  Autor
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>

                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
                <input
                    className="form-control"
                    id="author"
                    name="author"
                    minLength={2}
                    maxLength={100}
                    value={form.author}
                    onChange={update}
                    required
                />
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="col-md-6">
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label className="form-label" htmlFor="price">
                  Precio (CLP)
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>

                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
                <input
                    className="form-control"
                    type="number"
                    id="price"
                    name="price"
                    min="0.01"
                    step="any"
                    value={form.price}
                    onChange={update}
                    required
                />
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>

              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              <div className="col-md-6">
                {/* Nota de lectura: Etiqueta un campo; htmlFor se relaciona con su id. */}
                <label className="form-label" htmlFor="stock">
                  Stock
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </label>

                {/* Nota de lectura: Control del formulario enlazado al estado; onChange recoge lo que escribe o selecciona la persona. */}
                <input
                    className="form-control"
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    max="2147483647"
                    step="1"
                    value={form.stock}
                    onChange={update}
                    required
                />
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </div>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>

            {/* Nota de lectura: Invoca la operación indicada con los argumentos de este bloque. */}
            {error && (
                // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
                <div
                    className="alert alert-danger mt-3"
                    role="alert"
                >
                  {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                  {error}
                {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
                </div>
            // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
            )}

            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
              <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => navigate('/admin/productos')}
              >
                Cancelar
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </button>

              {/* Nota de lectura: Botón de acción; onClick/onSubmit define la operación y disabled evita acciones no disponibles. */}
              <button
                  className="btn btn-primary"
                  type="submit"
              >
                {/* Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior. */}
                {saving
                    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
                    ? 'Guardando…'
                    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
                    : isEditing
                        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
                        ? 'Guardar cambios'
                        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
                        : 'Crear producto'}
              {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
              </button>
            {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
            </div>
          {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
          </fieldset>
        {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
        </form>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      </>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default function AdminProductForm() {
  // Nota de lectura: Obtiene el identificador definido en la URL.
  const { id } = useParams()
  // Cambiar de libro crea un formulario limpio, sin mostrar datos del anterior.
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return <ProductEditor key={id ?? 'nuevo'} id={id} />
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
