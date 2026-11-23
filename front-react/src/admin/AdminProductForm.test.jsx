import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import AdminProductForm from './AdminProductForm'
import AdminProductDetail from './AdminProductDetail'
import { mockApi, json, book } from '../test/apiHelpers'
afterEach(() => vi.unstubAllGlobals())
function Destination() { return <p>{useLocation().state?.success}</p> }
function show(path = '/admin/productos/nuevo') {
  render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/admin/productos/nuevo" element={<AdminProductForm />} />
    <Route path="/admin/productos/:id/editar" element={<AdminProductForm />} />
    <Route path="/admin/productos/:id" element={<AdminProductDetail />} />
    <Route path="/admin/productos" element={<Destination />} />
  </Routes></MemoryRouter>)
}
function fill(stock = '0', price = '12.5') {
  for (const [label, value] of [['Título', 'Libro nuevo'], ['Autor', 'Autora real'], ['Precio (CLP)', price], ['Stock', stock]])
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
}
describe('Formulario real de libros', () => {
  it('envía POST con decimales y stock cero', async () => {
    const fetch = mockApi(() => json(book, 201))
    show(); fill()
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))
    expect(await screen.findByText('Producto creado correctamente.')).toBeInTheDocument()
    expect(fetch.mock.calls[0][0]).toBe('/api/books')
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ title: 'Libro nuevo', author: 'Autora real', price: 12.5, stock: 0 })
  })
  it.each([['-1', '12'], ['1.5', '12'], ['2147483648', '12'], ['1', '0'], ['1', '-10'], ['', '12']])('rechaza stock %s y precio %s inválidos', async (stock, price) => {
    const fetch = mockApi(() => json(book))
    show(); fill(stock, price)
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })
  it('carga el libro y actualiza mediante PUT', async () => {
    const fetch = mockApi(() => json(book))
    show('/admin/productos/7/editar')
    expect(await screen.findByLabelText('Título')).toHaveValue(book.title)
    fill('8')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(await screen.findByText('Producto actualizado correctamente.')).toBeInTheDocument()
    expect(fetch.mock.calls[1][0]).toBe('/api/books/7')
    expect(fetch.mock.calls[1][1].method).toBe('PUT')
  })
  it('permite reintentar al fallar la carga, sin editar datos vacíos', async () => {
    let fail = true
    mockApi(() => fail ? json({}, 404) : json(book))
    show('/admin/productos/7/editar')
    expect(await screen.findByRole('alert')).toHaveTextContent('404')
    expect(screen.queryByRole('button', { name: 'Guardar cambios' })).not.toBeInTheDocument()
    fail = false
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByLabelText('Título')).toHaveValue(book.title)
  })
  it('bloquea un segundo envío mientras guarda y conserva datos si falla', async () => {
    let resolve
    const fetch = mockApi(() => new Promise((done) => { resolve = done }))
    show(); fill()
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))
    expect(screen.getByRole('button', { name: 'Guardando…' })).toBeDisabled()
    expect(fetch).toHaveBeenCalledTimes(1)
    resolve(json({}, 503))
    expect(await screen.findByRole('alert')).toHaveTextContent('503')
    expect(screen.getByLabelText('Título')).toHaveValue('Libro nuevo')
  })
  it('consulta detalle sin escribir', async () => {
    mockApi(() => json(book))
    show('/admin/productos/7')
    expect(await screen.findByText(book.title)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Editar producto' })).toHaveAttribute('href', '/admin/productos/7/editar')
  })
})
