import React, { useState, useEffect } from 'react';

const AdminUsuariosPage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // En una app real, aquí harías un fetch a tu base de datos de usuarios
        // Como usamos localStorage, solo podemos ver al usuario actual
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        if (loggedUser) {
            setUser(loggedUser);
        }
    }, []);

    return (
        <div className="container py-3">
            <h3 className="mb-4">Administrar Usuarios</h3>
            <p>Debido a que este proyecto usa localStorage, solo podemos ver al usuario actual.</p>
            <div className="table-responsive" style={{backgroundColor: 'white'}}>
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user ? (
                            <tr>
                                <td>{user.nombre} {user.apellidos}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.points}</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="4">No se encontró información del usuario.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsuariosPage;