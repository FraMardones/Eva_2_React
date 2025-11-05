import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jasmine-dom';
import LoginPage from '../../pages/LoginPage'; // Ajustada

describe('Componente LoginPage - Formulario de Registro', () => {

  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
  };

  beforeEach(() => {
    renderWithRouter(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /Regístrate aquí/i }));
  });

  it('debería mostrar un error si el formato del email es inválido', async () => { // Marcado como async
    const emailInput = screen.getByPlaceholderText(/Correo electrónico/i);
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });

    fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
    fireEvent.click(submitButton);

    // Usar findByText para esperar si la validación es asíncrona o tarda un momento en aparecer
    const errorElement = await screen.findByText(/El correo debe ser @duoc\.cl, @profesor\.duoc\.cl o @gmail\.com\./i);
    expect(errorElement).toBeInTheDocument();
  });

  it('NO debería mostrar error de email si el formato es válido (@duoc.cl)', () => {
    const emailInput = screen.getByPlaceholderText(/Correo electrónico/i);
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });

    fireEvent.change(emailInput, { target: { value: 'usuario@duoc.cl' } });
    // Simular llenar otros campos requeridos para que la validación pase (si es necesario)
    fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '12345678k' } });
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'NombreValido' } });
    fireEvent.change(screen.getByPlaceholderText('Apellidos'), { target: { value: 'ApellidoValido' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password123' } });
    // Seleccionar región y comuna (importante si son requeridas)
    fireEvent.change(screen.getByRole('combobox', { name: '' }), { target: { value: 'Metropolitana de Santiago' } }); // Ajusta el selector si tiene label
    // Espera a que las comunas carguen si es asíncrono, luego selecciona una
    // fireEvent.change(screen.getByRole('combobox', { name: '' }), { target: { value: 'Santiago' } });

    fireEvent.click(submitButton);

    expect(screen.queryByText(/El correo debe ser @duoc\.cl, @profesor\.duoc\.cl o @gmail\.com\./i)).not.toBeInTheDocument();
  });
});