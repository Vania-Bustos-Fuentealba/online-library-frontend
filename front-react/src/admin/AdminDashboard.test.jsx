import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import { mockApi, json, book, profile } from '../test/apiHelpers'
afterEach(() => vi.unstubAllGlobals())

describe('Resumen desde API', () => {
  it('cuenta libros y perfiles reales y aplica el umbral inclusivo de stock', async () => {
    localStorage.setItem('usuarios', JSON.stringify(Array(20).fill({})))
    mockApi((url) => json(url.endsWith('/books') ? [book, { ...book, id: 8, stock: 6 }, { ...book, id: 9, stock: 0 }] : [profile]))
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>)
    await screen.findByText('3')
    const region = screen.getByRole('region', { name: 'Indicadores' })
    expect(within(region).getByText('1')).toBeInTheDocument()
    expect(within(region).getByText('2')).toBeInTheDocument()
    expect(screen.queryByText('20')).not.toBeInTheDocument()
  })
  it('un fallo parcial no aparece como cero y permite reintentar', async () => {
    let fail = true
    mockApi((url) => url.endsWith('/users') && fail ? json({}, 503) : json(url.endsWith('/books') ? [book] : [profile]))
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>)
    expect(await screen.findByRole('alert')).toHaveTextContent('503')
    expect(screen.queryByText('0')).not.toBeInTheDocument()
    fail = false
    await userEvent.click(screen.getByRole('button', { name: /Reintentar usuarios/ }))
    expect(await screen.findAllByText('1')).toHaveLength(3)
  })
})
