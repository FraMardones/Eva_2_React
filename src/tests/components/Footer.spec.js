import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jasmine-dom';
import Footer from '../../components/Footer'; // Ajustada

describe('Componente Footer', () => {
  it('debería mostrar el título "Level-Up Gamer"', () => {
    render(<Footer />);
    expect(screen.getByRole('heading', { name: /Level-Up Gamer/i, level: 3 })).toBeInTheDocument();
  });

  it('debería contener información de contacto', () => {
    render(<Footer />);
    expect(screen.getByText(/info@levelupgamer\.cl/i)).toBeInTheDocument();
    expect(screen.getByText(/\+56 9 1234 5678/i)).toBeInTheDocument();
    expect(screen.getByText(/Santiago, Chile/i)).toBeInTheDocument();
  });
});