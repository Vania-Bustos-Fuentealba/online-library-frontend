// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, afterEach, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen, fireEvent } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminUserForm from './AdminUserForm'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { mockApi, json, profile, profileDetails, fillProfile } from '../test/apiHelpers'
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => vi.unstubAllGlobals())
// Nota de lectura: Consulta la ruta y el estado que otra pantalla envió al navegar.
function Destination() { return <p>{useLocation().state?.success}</p> }
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function show(path = '/admin/usuarios/nuevo') {
  // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
  render(<MemoryRouter initialEntries={[path]}><Routes>
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/admin/usuarios/nuevo" element={<AdminUserForm />} />
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/admin/usuarios/:id/editar" element={<AdminUserForm />} />
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/admin/usuarios" element={<Destination />} />
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </Routes></MemoryRouter>)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function fill() {
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  fillProfile(screen, fireEvent)
  // Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
  for (const [label, value] of [['Contraseña inicial', 'clave123'], ['Confirmar contraseña', 'clave123']])
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Alta y consulta de usuarios', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('valida antes de llamar a la API', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(profile))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText('Nombre')).toHaveClass('is-invalid')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).not.toHaveBeenCalled()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('registra una cuenta CLIENT con el contrato real, sin alterar la sesión admin', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(profile, 201))
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    localStorage.setItem('token', 'sesion-admin')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); fill()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText('Cuenta creada correctamente.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/users')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ ...profileDetails, name: 'Persona real', email: profile.email, password: 'clave123', role: 'CLIENT' })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('token')).toBe('sesion-admin')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('usuarios')).toBeNull()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('mantiene el formulario ante un correo duplicado', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json({ message: 'El correo ya está registrado' }, 409))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); fill()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent('ya está registrado')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue(profile.email)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('rechaza contraseñas fuera de la longitud exigida por la ERS', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(profile, 201))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); fill()
    // Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
    for (const label of ['Contraseña inicial', 'Confirmar contraseña'])
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      fireEvent.change(screen.getByLabelText(label), { target: { value: 'é'.repeat(37) } })
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('alert')).toHaveTextContent('entre 4 y 10')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).not.toHaveBeenCalled()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('carga una cuenta de Auth para editar con su identificador real', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(profile))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show('/admin/usuarios/42/editar')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByLabelText('Correo electrónico')).toHaveValue(profile.email)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/users/42')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('actualiza el rol mediante PUT sin reenviar una contraseña vacía', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(profile))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show('/admin/usuarios/42/editar')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await screen.findByLabelText('Rol')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.selectOptions(screen.getByLabelText('Rol'), 'ADMIN')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText('Cuenta actualizada correctamente.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[1][0]).toBe('/api/auth/users/42')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[1][1].method).toBe('PUT')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ ...profileDetails, name: profile.name, email: profile.email, role: 'ADMIN' })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('permite crear ADMIN solo mediante el endpoint administrativo', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json({ ...profile, role: 'ADMIN' }, 201))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); fill()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.selectOptions(screen.getByLabelText('Rol'), 'ADMIN')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText('Cuenta creada correctamente.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(JSON.parse(fetch.mock.calls[0][1].body).role).toBe('ADMIN')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
