import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jasmine-dom';
import Header from '../../components/Header'; // Ajustada

describe('Componente Header', () => {
  it('debería renderizar el logo correctamente', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const logo = screen.getByAltText('Logo Level-Up');
    expect(logo).toBeInTheDocument();
    // Podrías necesitar ajustar esta aserción si PUBLIC_URL no está definido en Karma
    // expect(logo.src).toContain('Logo_Level-U.webp');
  });

  it('debería mostrar los enlaces de navegación principales', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Blogs')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });
});