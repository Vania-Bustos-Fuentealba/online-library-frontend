import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminProductForm from './AdminProductForm'
import { getProducts } from './adminData'

function renderCreateForm() {
  return render(
    <MemoryRouter initialEntries={['/admin/productos/nuevo']}>
      <Routes>
        <Route path="/admin/productos/nuevo" element={<AdminProductForm />} />
        <Route path="/admin/productos" element={<p>Listado de productos</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Formulario de productos', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('valida los campos obligatorios antes de guardar', async () => {
    const user = userEvent.setup()
    renderCreateForm()

    await user.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Completa los campos')
    expect(getProducts()).toHaveLength(5)
  })

  it('crea un libro válido y lo persiste en localStorage', async () => {
    const user = userEvent.setup()
    renderCreateForm()

    await user.type(screen.getByLabelText('Código'), 'LIB006')
    await user.type(screen.getByLabelText('Nombre'), 'Libro de prueba')
    await user.type(screen.getByLabelText('Autor'), 'Autora de prueba')
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Narrativa')
    await user.type(screen.getByLabelText('Precio (CLP)'), '10000')
    await user.type(screen.getByLabelText('Stock'), '4')
    await user.type(screen.getByLabelText('Stock crítico'), '1')
    await user.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(await screen.findByText('Listado de productos')).toBeInTheDocument()
    expect(getProducts()).toContainEqual(expect.objectContaining({ code: 'LIB006', name: 'Libro de prueba', author: 'Autora de prueba', price: 10000, stock: 4 }))
  })

  it('rechaza un código de libro que ya existe', async () => {
    const user = userEvent.setup()
    renderCreateForm()

    await user.type(screen.getByLabelText('Código'), 'LIB001')
    await user.type(screen.getByLabelText('Nombre'), 'Otro libro')
    await user.type(screen.getByLabelText('Autor'), 'Autora de prueba')
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Narrativa')
    await user.type(screen.getByLabelText('Precio (CLP)'), '10000')
    await user.type(screen.getByLabelText('Stock'), '4')
    await user.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ya existe un producto con ese código')
    expect(getProducts()).toHaveLength(5)
  })
})
