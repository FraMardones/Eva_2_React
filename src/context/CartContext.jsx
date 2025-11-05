import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('carrito');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.code === product.code);
            if (existingItem) {
                return prevCart.map(item =>
                    item.code === product.code ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productCode, quantityToRemove = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.code === productCode);
            if (!existingItem) return prevCart;

            if (existingItem.quantity - quantityToRemove <= 0) {
                return prevCart.filter(item => item.code !== productCode);
            } else {
                return prevCart.map(item =>
                    item.code === productCode ? { ...item, quantity: item.quantity - quantityToRemove } : item
                );
            }
        });
    };
    
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};