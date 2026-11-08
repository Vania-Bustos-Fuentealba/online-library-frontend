import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminUserForm from './AdminUserForm'
import { obtenerUsuarios } from '../data/usuarios'

function renderUserForm(path = '/admin/usuarios/nuevo') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/usuarios/nuevo" element={<AdminUserForm />} />
        <Route path="/admin/usuarios/:id/editar" element={<AdminUserForm />} />
        <Route path="/admin/usuarios" element={<p>Listado de usuarios</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Formulario de usuarios', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('crea una cuenta válida en el almacenamiento compartido con el registro', async () => {
    localStorage.setItem('usuarios', '[]')
    const user = userEvent.setup()
    renderUserForm()

    await user.type(screen.getByLabelText('RUN'), '123456785')
    await user.type(screen.getByLabelText('Correo'), 'nueva@duoc.cl')
    await user.type(screen.getByLabelText('Nombre'), 'Nueva')
    await user.type(screen.getByLabelText('Apellidos'), 'Cuenta')
    await user.selectOptions(screen.getByLabelText('Región'), 'Metropolitana de Santiago')
    await user.selectOptions(screen.getByLabelText('Comuna'), 'Santiago')
    await user.type(screen.getByLabelText('Dirección'), 'Av. Ejemplo 123')
    await user.type(screen.getByLabelText('Contraseña inicial'), 'clave123')
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(await screen.findByText('Listado de usuarios')).toBeInTheDocument()
    expect(obtenerUsuarios()).toContainEqual(expect.objectContaining({ run: '123456785', email: 'nueva@duoc.cl', nombre: 'Nueva', rol: 'cliente' }))
  })

  it('rechaza un RUN o correo duplicado', async () => {
    const user = userEvent.setup()
    renderUserForm()

    await user.type(screen.getByLabelText('RUN'), '123456785')
    await user.type(screen.getByLabelText('Correo'), 'nuevo@duoc.cl')
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ya existe una cuenta con ese RUN o correo')
    expect(obtenerUsuarios()).toHaveLength(2)
  })

  it('actualiza los datos de una cuenta existente', async () => {
    const user = userEvent.setup()
    renderUserForm('/admin/usuarios/1/editar')

    const nameInput = screen.getByLabelText('Nombre')
    await user.clear(nameInput)
    await user.type(nameInput, 'Administradora')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByText('Listado de usuarios')).toBeInTheDocument()
    expect(obtenerUsuarios()[0].nombre).toBe('Administradora')
  })

  it('informa cuando el identificador solicitado no existe', () => {
    renderUserForm('/admin/usuarios/100/editar')

    expect(screen.getByText(/No se encontró el usuario/)).toBeInTheDocument()
  })
})
