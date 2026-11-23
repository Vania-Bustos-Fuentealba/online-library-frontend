import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { solicitar } from '../services/api'

const emptyProduct = {
  name: '',
  author: '',
  price: '',
  stock: '',
}

function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState({ ...emptyProduct })
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true

    setForm({ ...emptyProduct })
    setError('')
    setLoadError('')
    setLoading(Boolean(id))

    if (!id) {
      return () => {
        active = false
      }
    }

    async function loadProduct() {
      try {
        const book = await solicitar(
            `/books/${encodeURIComponent(id)}`
        )

        if (!book || book.id == null) {
          throw new Error('El servidor no devolvió un libro válido.')
        }

        if (active) {
          setForm({
            name: book.title ?? '',
            author: book.author ?? '',
            price: String(book.price ?? ''),
            stock: String(book.stock ?? ''),
          })
        }
      } catch (err) {
        if (active) {
          setLoadError(
              err.message || 'No se pudo cargar el libro.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      active = false
    }
  }, [id, reload])

  function update(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setError('')
  }

  async function submit(event) {
    event.preventDefault()

    if (loading || saving || loadError) return

    const title = form.name.trim()
    const author = form.author.trim()
    const price = Number(form.price)
    const stock = Number(form.stock)

    if (title.length < 2 || title.length > 150) {
      setError('El título debe tener entre 2 y 150 caracteres.')
      return
    }

    if (author.length < 2 || author.length > 100) {
      setError('El autor debe tener entre 2 y 100 caracteres.')
      return
    }

    if (
        form.price.trim() === '' ||
        !Number.isFinite(price) ||
        price <= 0
    ) {
      setError('El precio debe ser un número mayor que cero.')
      return
    }

    if (
        form.stock.trim() === '' ||
        !Number.isInteger(stock) ||
        stock < 0 ||
        stock > 2147483647
    ) {
      setError(
          'El stock debe ser un número entero entre 0 y 2147483647.'
      )
      return
    }

    setSaving(true)
    setError('')

    try {
      const route = isEditing
          ? `/books/${encodeURIComponent(id)}`
          : '/books'

      await solicitar(route, {
        method: isEditing ? 'PUT' : 'POST',
        body: {
          title,
          author,
          price,
          stock,
        },
      })

      navigate('/admin/productos')
    } catch (err) {
      setError(
          err.message || 'No se pudo guardar el libro.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
        <div className="alert alert-info" role="status">
          Cargando libro…
        </div>
    )
  }

  if (loadError) {
    return (
        <div className="alert alert-danger" role="alert">
          <p>{loadError}</p>

          <div className="d-flex gap-2">
            <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => setReload((value) => value + 1)}
            >
              Reintentar
            </button>

            <Link
                className="btn btn-outline-secondary"
                to="/admin/productos"
            >
              Volver al listado
            </Link>
          </div>
        </div>
    )
  }

  return (
      <>
        <div className="admin-heading">
          <p className="admin-eyebrow">Catálogo</p>

          <h1>
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h1>

          <p>Completa la información del libro.</p>
        </div>

        <form
            className="admin-form"
            onSubmit={submit}
            noValidate
            aria-busy={saving}
        >
          <fieldset disabled={saving}>
            <legend className="visually-hidden">
              Datos del libro
            </legend>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="name">
                  Título
                </label>

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
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="author">
                  Autor
                </label>

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
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="price">
                  Precio (CLP)
                </label>

                <input
                    className="form-control"
                    type="number"
                    id="price"
                    name="price"
                    min="1"
                    step="1"
                    value={form.price}
                    onChange={update}
                    required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="stock">
                  Stock
                </label>

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
              </div>
            </div>

            {error && (
                <div
                    className="alert alert-danger mt-3"
                    role="alert"
                >
                  {error}
                </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => navigate('/admin/productos')}
              >
                Cancelar
              </button>

              <button
                  className="btn btn-primary"
                  type="submit"
              >
                {saving
                    ? 'Guardando…'
                    : isEditing
                        ? 'Guardar cambios'
                        : 'Crear producto'}
              </button>
            </div>
          </fieldset>
        </form>
      </>
  )
}

export default AdminProductForm