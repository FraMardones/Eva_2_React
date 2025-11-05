import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jasmine-dom';
import UserProfile from '../../components/UserProfile'; // Ajustada

describe('Componente UserProfile', () => {
  const mockUser = {
    nombre: 'Tester',
    level: 5,
    points: 1500,
    myReferralCode: 'TEST1234'
  };

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(mockUser));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería mostrar el nombre, nivel y puntos del usuario', () => {
    render(<UserProfile />);
    expect(screen.getByText(`¡Bienvenido de nuevo, ${mockUser.nombre}!`)).toBeInTheDocument();
    expect(screen.getByText(`Nivel ${mockUser.level}`)).toBeInTheDocument();
    expect(screen.getByText(`Puntos LevelUp: ${mockUser.points}`)).toBeInTheDocument();
  });

  it('debería mostrar el código de referido del usuario', () => {
    render(<UserProfile />);
    expect(screen.getByText(new RegExp(mockUser.myReferralCode))).toBeInTheDocument();
  });

  it('no debería renderizar nada si no hay usuario en localStorage', () => {
    localStorage.clear();
    const { container } = render(<UserProfile />);
    expect(container.firstChild).toBeNull();
  });
});