import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import '../assets/css/carrito.css';
import axios from 'axios'; 

// (La misma que usamos en DetalleProductoPage)
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return process.env.PUBLIC_URL + '/img/default.png'; 
    }
    if (imagePath.startsWith('data:image/')) {
        return imagePath;
    }
    return process.env.PUBLIC_URL + imagePath;
};


const CarritoPage = () => {
    // Obtenemos 'user', 'token' Y 'login' del Context.
    const { 
        cart = [], 
        addToCart, 
        removeFromCart, 
        clearCart, 
        user,  
        token, 
        login  
    } = useContext(CartContext); 
    
    const [discountApplied, setDiscountApplied] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountPercentage = 0.10; // 10%
    const total = discountApplied ? subtotal * (1 - discountPercentage) : subtotal;

    // FUNCIÓN CANJEAR PUNTOS (handleRedeemPoints) - CONECTADA A LA API
    const handleRedeemPoints = async () => {
        const pointsNeeded = 500; 

        if (!user || !token) {
            alert("Debes iniciar sesión para canjear puntos.");
            return;
        }
        if (user.points < pointsNeeded) {
            alert(`Necesitas ${pointsNeeded} puntos para canjear. Tienes ${user.points}.`);
            return;
        }
        if (discountApplied) {
            alert("Ya has aplicado un descuento.");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/usuarios/me/sumar-puntos',
                (pointsNeeded * -1), // Enviamos -500
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        // --- ¡CAMBIO CLAVE AQUÍ! ---
                        'Content-Type': 'text/plain' 
                    } 
                }
            );

            login(response.data, token); // Actualizamos el usuario global
            setDiscountApplied(true);
            alert(`¡${pointsNeeded} puntos canjeados! Descuento del ${discountPercentage * 100}% aplicado.`);

        } catch (err) {
            console.error("Error al canjear puntos:", err);
            alert("Hubo un error al conectar con el servidor para canjear tus puntos.");
        }
    };

    // FUNCIÓN PAGAR (handlePay) - CONECTADA A LA API
    const handlePay = async () => {
        if (cart.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }
        
        let pointsEarned = 0;
        let alertMessage = '¡Gracias por tu compra!';

        if (user && token) {
            pointsEarned = Math.floor(total / 1000); // 1 punto por cada $1000
            
            if (pointsEarned > 0) {
                try {
                    const response = await axios.post(
                        'http://localhost:8080/api/usuarios/me/sumar-puntos',
                        pointsEarned, // Enviamos los puntos ganados (ej: 50)
                        {
                            headers: { 
                                'Authorization': `Bearer ${token}`,
                                // --- ¡CAMBIO CLAVE AQUÍ! ---
                                'Content-Type': 'text/plain'
                            }
                        }
                    );
                    
                    login(response.data, token); // Actualizamos el usuario global
                    alertMessage = `¡Gracias por tu compra! Has ganado ${pointsEarned} puntos.`;
                
                } catch (err) {
                    console.error("Error al sumar puntos:", err);
                    alertMessage = "¡Gracias por tu compra! (No se pudieron sumar tus puntos)";
                }
            } else {
                 alertMessage = "¡Gracias por tu compra! (Total muy bajo para ganar puntos)";
            }

        } else {
            alertMessage = '¡Gracias por tu compra!';
        }
        
        alert(alertMessage);
        clearCart();
        setDiscountApplied(false); 
    };

    // --- RENDERIZADO (Sin cambios) ---
    return (
        <main className="container py-5">
            <h1 className="mb-4 text-center">🛒 Carrito de Compras</h1>
            <div className="row g-4">
                <div className="col-12 col-lg-8" id="lista-carrito">
                    
                    {(!cart || cart.length === 0) ? ( 
                        <p className='text-center'>Tu carrito está vacío.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.code} className="carrito-item">
                                <div className="d-flex align-items-center flex-grow-1">
                                    <img 
                                        src={getImageUrl(item.image)} 
                                        alt={item.name} 
                                        className="carrito-img" 
                                    />
                                    <div>
                                        <h6>{item.name}</h6>
                                        <p>Subtotal: ${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => removeFromCart(item.code, 1)}>➖</button>
                                    <span className="cantidad">{item.quantity}</span>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => addToCart(item)}>➕</button>
                                    <button className="btn btn-sm btn-danger ms-3" onClick={() => removeFromCart(item.code, item.quantity)}>🗑️</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <aside className="col-12 col-lg-4">
                    <div className="card p-3 sticky-top">
                        <h4>Resumen</h4>
                        <hr />
                        <p>Subtotal: ${subtotal.toLocaleString('es-CL')}</p>
                        {discountApplied && (
                            <p className="text-success">Descuento ({discountPercentage * 100}%): -${(subtotal * discountPercentage).toLocaleString('es-CL')}</p>
                        )}
                        <p className="fw-bold fs-5">Total: <strong>${total.toLocaleString('es-CL')}</strong></p>

                        {user && user.points >= 500 && !discountApplied && (
                            <button className="btn btn-info w-100 mb-2" onClick={handleRedeemPoints}>
                                Canjear 500 Puntos por {discountPercentage * 100}% Dcto.
                            </button>
                        )}

                        <button className="btn btn-danger w-100 mb-2" onClick={clearCart}>Vaciar carrito</button>
                        <button className="btn btn-success w-100" onClick={handlePay}>Pagar</button>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default CarritoPage;