import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../../src/App'

test('Renders App Header', () => {
    render(<App />)
    const headerElement = screen.getByText(/MLA Fitness App/i)
    expect(headerElement).toBeInTheDocument()
})
