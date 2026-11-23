import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import AdminUserForm from './AdminUserForm'
import { mockApi, json, profile } from '../test/apiHelpers'
afterEach(() => vi.unstubAllGlobals())
function Destination() { return <p>{useLocation().state?.success}</p> }
function show(path = '/admin/usuarios/nuevo') {
  render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/admin/usuarios/nuevo" element={<AdminUserForm />} />
    <Route path="/admin/usuarios/:id/editar" element={<AdminUserForm />} />
    <Route path="/admin/usuarios" element={<Destination />} />
  </Routes></MemoryRouter>)
}
function fill() {
  for (const [label, value] of [['Nombre completo', 'Persona real'], ['Correo', 'persona@example.com'], ['Contraseña inicial', 'clave123'], ['Confirmar contraseña', 'clave123']])
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
}
describe('Alta y consulta de usuarios', () => {
  it('valida antes de llamar a la API', async () => {
    const fetch = mockApi(() => json(profile))
    show()
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    expect(screen.getByRole('alert')).toHaveTextContent('nombre')
    expect(fetch).not.toHaveBeenCalled()
  })
  it('registra una cuenta CLIENT con el contrato real, sin alterar la sesión admin', async () => {
    const fetch = mockApi(() => json(profile, 201))
    localStorage.setItem('token', 'sesion-admin')
    show(); fill()
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    expect(await screen.findByText('Cuenta creada correctamente.')).toBeInTheDocument()
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/users')
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ name: 'Persona real', email: profile.email, password: 'clave123', role: 'CLIENT' })
    expect(localStorage.getItem('token')).toBe('sesion-admin')
    expect(localStorage.getItem('usuarios')).toBeNull()
  })
  it('mantiene el formulario ante un correo duplicado', async () => {
    mockApi(() => json({ message: 'El correo ya está registrado' }, 409))
    show(); fill()
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('ya está registrado')
    expect(screen.getByLabelText('Correo')).toHaveValue(profile.email)
  })
  it('rechaza contraseñas que exceden el límite de bytes de BCrypt', async () => {
    const fetch = mockApi(() => json(profile, 201))
    show(); fill()
    for (const label of ['Contraseña inicial', 'Confirmar contraseña'])
      fireEvent.change(screen.getByLabelText(label), { target: { value: 'é'.repeat(37) } })
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    expect(screen.getByRole('alert')).toHaveTextContent('72 bytes')
    expect(fetch).not.toHaveBeenCalled()
  })
  it('carga una cuenta de Auth para editar con su identificador real', async () => {
    const fetch = mockApi(() => json(profile))
    show('/admin/usuarios/42/editar')
    expect(await screen.findByLabelText('Correo')).toHaveValue(profile.email)
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/users/42')
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  })
  it('actualiza el rol mediante PUT sin reenviar una contraseña vacía', async () => {
    const fetch = mockApi(() => json(profile))
    show('/admin/usuarios/42/editar')
    await screen.findByLabelText('Rol')
    await userEvent.selectOptions(screen.getByLabelText('Rol'), 'ADMIN')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(await screen.findByText('Cuenta actualizada correctamente.')).toBeInTheDocument()
    expect(fetch.mock.calls[1][0]).toBe('/api/auth/users/42')
    expect(fetch.mock.calls[1][1].method).toBe('PUT')
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ name: profile.name, email: profile.email, role: 'ADMIN' })
  })
  it('permite crear ADMIN solo mediante el endpoint administrativo', async () => {
    const fetch = mockApi(() => json({ ...profile, role: 'ADMIN' }, 201))
    show(); fill()
    await userEvent.selectOptions(screen.getByLabelText('Rol'), 'ADMIN')
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    expect(await screen.findByText('Cuenta creada correctamente.')).toBeInTheDocument()
    expect(JSON.parse(fetch.mock.calls[0][1].body).role).toBe('ADMIN')
  })
})
