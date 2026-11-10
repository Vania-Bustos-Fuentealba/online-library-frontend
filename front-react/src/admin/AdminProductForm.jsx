import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProducts, makeId, saveProducts } from './adminData'

const emptyProduct = { code: '', name: '', author: '', description: '', category: '', price: '', stock: '', criticalStock: '', image: '' }

function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const products = getProducts()
  const current = products.find((product) => product.id === id)
  const [form, setForm] = useState(current ?? emptyProduct)
  const [error, setError] = useState('')
  const isEditing = Boolean(id)

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function submit(event) {
    event.preventDefault()
    const price = Number(form.price)
    const stock = Number(form.stock)
    const criticalStock = form.criticalStock === '' ? 0 : Number(form.criticalStock)
    const duplicateCode = products.some((product) => product.id !== current?.id && product.code.toLowerCase() === form.code.trim().toLowerCase())
    let validImage = true
    if (form.image.trim() && !form.image.trim().startsWith('/')) {
      try {
        const imageUrl = new URL(form.image.trim())
        validImage = ['http:', 'https:'].includes(imageUrl.protocol)
      } catch { validImage = false }
    }
    if (!form.code.trim() || !form.name.trim() || !form.author.trim() || !form.category || form.price === '' || !Number.isFinite(price) || price < 0 || form.stock === '' || !Number.isInteger(stock) || stock < 0 || !Number.isInteger(criticalStock) || criticalStock < 0 || duplicateCode || !validImage) {
      setError(duplicateCode ? 'Ya existe un producto con ese código.' : 'Completa los campos y revisa precio, stock, stock crítico y URL de imagen.')
      return
    }
    const product = { ...form, id: current?.id ?? makeId(), code: form.code.trim(), name: form.name.trim(), author: form.author.trim(), description: form.description.trim(), image: form.image.trim(), price, stock, criticalStock }
    saveProducts(isEditing ? products.map((item) => item.id === id ? product : item) : [...products, product])
    navigate('/admin/productos')
  }

  if (isEditing && !current) return <div className="alert alert-warning">No se encontró el producto. <Link to="/admin/productos">Volver al listado</Link></div>

  return <>
    <div className="admin-heading"><p className="admin-eyebrow">Catálogo</p><h1>{isEditing ? 'Editar producto' : 'Nuevo producto'}</h1><p>Completa la información del libro.</p></div>
    <form className="admin-form" onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-md-6"><label className="form-label" htmlFor="code">Código</label><input className="form-control" id="code" name="code" maxLength="50" value={form.code} onChange={update} /></div>
        <div className="col-md-6"><label className="form-label" htmlFor="name">Nombre</label><input className="form-control" id="name" name="name" maxLength="100" value={form.name} onChange={update} /></div>
        <div className="col-md-6"><label className="form-label" htmlFor="author">Autor</label><input className="form-control" id="author" name="author" maxLength="100" value={form.author ?? ''} onChange={update} /></div>
        <div className="col-12"><label className="form-label" htmlFor="description">Descripción</label><textarea className="form-control" id="description" name="description" maxLength="500" rows="3" value={form.description ?? ''} onChange={update} /></div>
        <div className="col-md-6"><label className="form-label" htmlFor="category">Categoría</label><select className="form-select" id="category" name="category" value={form.category} onChange={update}><option value="">Selecciona una categoría</option>{['Ciencia ficción', 'Clásicos', 'Fantasía', 'Historia', 'Narrativa', 'Romance', 'Tecnología', 'Terror', 'Distopía'].map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="col-md-3"><label className="form-label" htmlFor="price">Precio (CLP)</label><input className="form-control" type="number" id="price" name="price" min="0" step="1" value={form.price} onChange={update} /></div>
        <div className="col-md-3"><label className="form-label" htmlFor="stock">Stock</label><input className="form-control" type="number" id="stock" name="stock" min="0" step="1" value={form.stock} onChange={update} /></div>
        <div className="col-md-3"><label className="form-label" htmlFor="criticalStock">Stock crítico</label><input className="form-control" type="number" id="criticalStock" name="criticalStock" min="0" step="1" value={form.criticalStock ?? ''} onChange={update} /></div>
        <div className="col-12"><label className="form-label" htmlFor="image">URL o ruta de imagen (opcional)</label><input className="form-control" type="text" id="image" name="image" value={form.image ?? ''} onChange={update} /><div className="form-text">Puedes usar una ruta como /books/portada.webp o una URL https://.</div></div>
      </div>
      {error && <p className="alert alert-danger mt-3" role="alert">{error}</p>}
      <div className="d-flex justify-content-end gap-2 mt-4"><Link className="btn btn-outline-secondary" to="/admin/productos">Cancelar</Link><button className="btn btn-primary" type="submit">{isEditing ? 'Guardar cambios' : 'Crear producto'}</button></div>
    </form>
  </>
}

export default AdminProductForm
