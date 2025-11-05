import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import '../assets/css/carrito.css';

const CarritoPage = () => {
    // Mantengo los nombres que usaste: cart, addToCart, removeFromCart, clearCart
    const { cart = [], addToCart, removeFromCart, clearCart } = useContext(CartContext); // Añadido valor por defecto = [] para seguridad

    // ✅ ESTADOS PARA MANEJAR EL USUARIO Y EL DESCUENTO (sin cambios)
    const [user, setUser] = useState(null);
    const [discountApplied, setDiscountApplied] = useState(false);

    // ✅ CARGAMOS LOS DATOS DEL USUARIO AL ABRIR LA PÁGINA (sin cambios)
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        if (loggedUser) {
            setUser(loggedUser);
        }
    }, []);

    // Calcula totales (sin cambios)
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountPercentage = 0.10; // 10%
    const total = discountApplied ? subtotal * (1 - discountPercentage) : subtotal;

    // ✅ FUNCIÓN PARA CANJEAR PUNTOS (sin cambios)
    const handleRedeemPoints = () => {
        const pointsNeeded = 500; // Puntos necesarios
        if (user && user.points >= pointsNeeded && !discountApplied) {
            const updatedUser = { ...user, points: user.points - pointsNeeded };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser); // Actualiza el estado local
            setDiscountApplied(true);
            alert(`¡${pointsNeeded} puntos canjeados! Descuento del ${discountPercentage * 100}% aplicado.`);
        } else if (discountApplied) {
            alert("Ya has aplicado un descuento.");
        } else {
            alert(`Necesitas ${pointsNeeded} puntos para canjear.`);
        }
    };

    // ✅ FUNCIÓN DE PAGO ACTUALIZADA PARA DAR PUNTOS (sin cambios)
    const handlePay = () => {
        if (cart.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }
        if (user) {
            const pointsEarned = Math.floor(total / 1000); // 1 punto por cada $1000
            const updatedUser = { ...user, points: (user.points || 0) + pointsEarned };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            alert(`¡Gracias por tu compra! Has ganado ${pointsEarned} puntos.`);
        } else {
            alert('¡Gracias por tu compra!');
        }
        clearCart();
        setDiscountApplied(false); // Resetea el descuento
    };

    return (
        <main className="container py-5">
            <h1 className="mb-4 text-center">🛒 Carrito de Compras</h1>
            <div className="row g-4">
                <div className="col-12 col-lg-8" id="lista-carrito">
                    {/* Usamos tu comprobación original */}
                    {(!cart || cart.length === 0) ? ( 
                        <p className='text-center'>Tu carrito está vacío.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.code} className="carrito-item">
                                <div className="d-flex align-items-center flex-grow-1">
                                    {/* ----- ¡LA CORRECCIÓN ESTÁ AQUÍ! ----- */}
                                    <img 
                                        src={process.env.PUBLIC_URL + item.image} 
                                        alt={item.name} 
                                        className="carrito-img" 
                                    />
                                    {/* ----- FIN DE LA CORRECCIÓN ----- */}
                                    <div>
                                        <h6>{item.name}</h6>
                                        <p>Subtotal: ${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    {/* Mantenemos tus botones originales */}
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
                        {/* Mantenemos tu resumen original */}
                        <h4>Resumen</h4>
                        <hr />
                        <p>Subtotal: ${subtotal.toLocaleString('es-CL')}</p>
                        {discountApplied && (
                            <p className="text-success">Descuento ({discountPercentage * 100}%): -${(subtotal * discountPercentage).toLocaleString('es-CL')}</p>
                        )}
                        <p className="fw-bold fs-5">Total: <strong>${total.toLocaleString('es-CL')}</strong></p>

                        {/* ✅ BOTÓN PARA CANJEAR PUNTOS (sin cambios) */}
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