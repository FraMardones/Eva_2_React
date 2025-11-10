import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

    // --- CÓDIGO DEL CARRITO ---
    // CAMBIO 1: Volvemos a inicializar el carrito desde localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('carrito');
        if (savedCart) {
            try {
                return JSON.parse(savedCart);
            } catch (error) {
                console.error("Error al parsear carrito de localStorage", error);
                return [];
            }
        }
        return [];
    });

    // CAMBIO 2: Este useEffect se ejecuta solo una vez (al cargar)
    // Ya no es necesario porque el useState de arriba se encarga de la carga inicial.
    /*
    useEffect(() => {
        const savedCart = localStorage.getItem('carrito');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error("Error al parsear carrito de localStorage", error);
                setCart([]);
            }
        }
    }, []);
    */

    // CAMBIO 3: Volvemos a activar el useEffect que GUARDA el carrito
    // cada vez que el estado 'cart' cambia.
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

    // --- INICIO DE LA LÓGICA DE AUTENTICACIÓN AÑADIDA ---
    // (Esta parte se mantiene igual)

    // 1. Inicializamos el estado de autenticación desde localStorage
    const [usuario, setUsuario] = useState(() => {
        try {
            const usuarioGuardado = localStorage.getItem('usuario');
            return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
        } catch (error) {
            console.error("Error al parsear usuario de localStorage", error);
            return null;
        }
    });
    
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

    /**
     * Función de Login actualizada.
     * Recibe el objeto { token, usuario } del backend.
     */
    const login = (authData) => {
        if (authData && authData.token && authData.usuario) {
            // 1. Actualizamos el estado de React
            setUsuario(authData.usuario);
            setToken(authData.token);
            setIsAuthenticated(true);

            // 2. Guardamos la sesión en localStorage
            localStorage.setItem('usuario', JSON.stringify(authData.usuario));
            localStorage.setItem('token', authData.token);

             // 3. Disparamos un evento para que UserProfile.jsx se actualice
            window.dispatchEvent(new Event("userUpdate"));

            console.log("Usuario logueado y token guardado.");
        } else {
            console.error("Error: La respuesta de login no tiene el formato esperado.", authData);
        }
    };

    /**
     * Función de Logout actualizada.
     * Limpia el estado y el localStorage.
     */
    const logout = () => {
        // 1. Limpiamos el estado de React
        setUsuario(null);
        setToken(null);
        setIsAuthenticated(false);

        // 2. Limpiamos la sesión de localStorage
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        
        console.log("Usuario deslogueado y token borrado.");
    };
    
    const contextValue = {
        // Carrito
        cart,
        addToCart,
        removeFromCart,
        clearCart,

        // Autenticación
        usuario,
        token,
        isAuthenticated,
        login,
        logout
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};