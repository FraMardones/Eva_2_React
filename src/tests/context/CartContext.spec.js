import React, { useContext } from 'react';
import { render, act, screen } from '@testing-library/react';
import '@testing-library/jasmine-dom';
import { CartProvider, CartContext } from '../../context/CartContext'; // Ajustada

const TestComponent = () => {
  const { cart, addToCart } = useContext(CartContext);
  const productoTest = { code: "TEST001", name: "Test Product", price: 1000 };

  return (
    <div>
      <span data-testid="cart-count">{cart.length}</span>
      <button onClick={() => addToCart(productoTest)}>Agregar</button>
      <pre data-testid="cart-content">{JSON.stringify(cart)}</pre>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
     localStorage.clear(); // Limpia antes de cada prueba
  });

  it('debería añadir un producto al carrito y al localStorage', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(localStorage.getItem('carrito')).toBe('[]'); // Verifica estado inicial localStorage

    act(() => {
      screen.getByText('Agregar').click();
    });

    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId('cart-content').textContent).toContain('TEST001');
    expect(localStorage.getItem('carrito')).toContain('TEST001'); // Verifica localStorage después
  });

  // Puedes añadir más pruebas aquí para removeFromCart, clearCart, etc.
});