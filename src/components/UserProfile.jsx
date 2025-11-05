// src/components/UserProfile.jsx

import React, { useState, useEffect } from 'react';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Carga los datos del usuario desde localStorage cuando el componente se monta
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        if (loggedUser) {
            setUser(loggedUser);
        }
    }, []);

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