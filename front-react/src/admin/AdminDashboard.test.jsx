import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'

describe('Resumen administrativo', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('resume productos, usuarios y alertas de stock bajo', () => {
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>)

    const indicators = within(screen.getByLabelText('Indicadores'))
    expect(indicators.getByText('Productos').nextElementSibling).toHaveTextContent('5')
    expect(indicators.getByText('Usuarios').nextElementSibling).toHaveTextContent('2')
    expect(indicators.getByText('Stock bajo').nextElementSibling).toHaveTextContent('2')
  })
})
