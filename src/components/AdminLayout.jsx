import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import '../assets/css/admin.css'; // Importa los estilos del admin
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap para las tablas y botones

const AdminLayout = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        if (!loggedUser || loggedUser.role !== 'admin') {
            // Si no es admin, lo saca del panel
            window.location.href = process.env.PUBLIC_URL + '/login';
        } else {
            setUser(loggedUser);
        }
    }, []);

    // Aplica una clase al body para el overlay del menú responsive
    useEffect(() => {
        document.body.classList.toggle('sidebar-open', menuOpen);
        // Limpia la clase al desmontar el componente
        return () => {
            document.body.classList.remove('sidebar-open');
        };
    }, [menuOpen]);

    if (!user) {
        return <p>Verificando acceso...</p>; // Muestra algo mientras redirige
    }

    return (
        <div className="admin-layout"> {/* Wrapper principal */}
            <header> {/* Header del admin.css */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div 
                        className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span></span><span></span><span></span>
                    </div>
                    <h2 style={{ margin: '0 0 0 15px', color: 'white' }}>Panel de Admin</h2>
                </div>
                <Link to="/" className="btn btn-outline-light btn-sm">Volver a la Tienda</Link>
            </header>

            {/* Contenedor para sidebar y contenido */}
            <div className="admin-layout-container"> 
                <aside className={`sidebar ${menuOpen ? 'active' : ''}`}>
                    <nav className="nav">
                        <ul className="list-unstyled"> {/* La clase 'flex-column' de bootstrap se elimina para usar la nuestra */}
                            <h5 className="mt-3">Gestión</h5>
                            {/* Cierra el menú al hacer clic en un enlace */}
                            <li onClick={() => setMenuOpen(false)}>
                                <NavLink to="/admin" className="nav-link" end>
                                    <span className="material-icons">dashboard</span> Dashboard
                                </NavLink>
                            </li>
                            <li onClick={() => setMenuOpen(false)}>
                                <NavLink to="/admin/productos" className="nav-link">
                                    <span className="material-icons">inventory_2</span> Productos
                                </NavLink>
                            </li>
                            <li onClick={() => setMenuOpen(false)}>
                                <NavLink to="/admin/usuarios" className="nav-link">
                                    <span className="material-icons">people</span> Usuarios
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </aside>
                
                {/* Contenido principal (sin fondo blanco) */}
                <main className="admin-main-content">
                    <Outlet /> {/* Aquí se renderizan las páginas de admin */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;