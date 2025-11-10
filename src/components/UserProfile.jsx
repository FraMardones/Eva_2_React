import React, { useState, useEffect } from 'react';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
        // Cambiamos "user" por "usuario" para que coincida con el CartContext
        const loggedUser = JSON.parse(localStorage.getItem("usuario")); 
        
        if (loggedUser) {
            setUser(loggedUser);
        }
    }, []); // Se ejecuta solo una vez

    // --- ¡MEJORA AÑADIDA! ---
    // Escuchamos por cambios en localStorage para actualizar los puntos en tiempo real
    // (cuando se ganan o canjean en el carrito)
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem("usuario"));
            if (updatedUser) {
                setUser(updatedUser);
            }
        };

        // 'storage' es un evento que se dispara cuando localStorage cambia en otra pestaña
        // 'userUpdate' es un evento personalizado que podemos disparar nosotros mismos
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('userUpdate', handleStorageChange); // Escuchamos nuestro evento

        // Limpiamos los listeners al desmontar
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userUpdate', handleStorageChange);
        };
    }, []); // Se suscribe una sola vez

    // Si no hay ningún usuario conectado, este componente no muestra nada.
    if (!user) {
        return null;
    }

    return (
        <section className="container my-4 p-4 rounded" style={{ background: 'rgba(30, 144, 255, 0.1)', border: '1px solid #1E90FF' }}>
            <h3>¡Bienvenido de nuevo, {user.nombre}!</h3>
            <div className="d-flex align-items-center gap-3">
                <div className="fw-bold p-2 px-3 rounded" style={{ background: 'linear-gradient(45deg, #39FF14, #1E90FF)', color: '#000' }}>
                    Nivel {user.level || 1}
                </div>
                <div style={{ color: '#39FF14' }}>
                    Puntos LevelUp: {user.points || 0}
                </div>
            </div>
            {user.myReferralCode && (
                <p className="mt-3 p-2 rounded" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px dashed #39FF14' }}>
                    Comparte tu código de referido para ganar puntos: <strong>{user.myReferralCode}</strong>
                </p>
            )}
        </section>
    );
};

export default UserProfile;