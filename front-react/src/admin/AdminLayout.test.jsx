import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { solicitar } from '../services/api'
import { session, mockApi, json } from '../test/apiHelpers'
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })
function show() {
  render(<MemoryRouter initialEntries={['/admin/usuarios']}><Routes>
    <Route path="/admin" element={<AdminLayout />}><Route path="usuarios" element={<p>Panel protegido</p>} /></Route>
    <Route path="/login" element={<p>Login requerido</p>} />
    <Route path="/productos" element={<p>Tienda</p>} />
  </Routes></MemoryRouter>)
}
describe('Acceso administrativo y ciclo de sesión', () => {
  it('protege URL directas sin sesión', () => { show(); expect(screen.getByText('Login requerido')).toBeInTheDocument() })
  it('rechaza una sesión local falsa sin JWT', () => {
    localStorage.setItem('sesion', JSON.stringify({ rol: 'admin' }))
    show(); expect(screen.getByText('Login requerido')).toBeInTheDocument()
  })
  it('redirige CLIENT a la tienda', () => {
    session('CLIENT'); show(); expect(screen.getByText('Tienda')).toBeInTheDocument()
  })
  it('permite ADMIN, marca navegación y cierra sesión', async () => {
    session(); show()
    expect(screen.getByText('Panel protegido')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Usuarios' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByText('Login requerido')).toBeInTheDocument()
    expect(localStorage.getItem('token')).toBeNull()
  })
  it('vence automáticamente sin recargar', () => {
    vi.useFakeTimers()
    session('ADMIN', { exp: Math.floor(Date.now() / 1000) + 2 })
    show()
    act(() => vi.advanceTimersByTime(2100))
    expect(screen.getByText('Login requerido')).toBeInTheDocument()
  })
  it('escucha el cierre de otra pestaña', () => {
    session(); show()
    act(() => { localStorage.removeItem('token'); window.dispatchEvent(new StorageEvent('storage', { key: 'token' })) })
    expect(screen.getByText('Login requerido')).toBeInTheDocument()
  })
  it('sale inmediatamente tras un 401', async () => {
    session(); show(); mockApi(() => json({}, 401))
    await act(async () => { await solicitar('/users').catch(() => {}) })
    expect(screen.getByText('Login requerido')).toBeInTheDocument()
  })
})
