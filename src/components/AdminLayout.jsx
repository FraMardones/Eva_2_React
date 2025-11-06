import React, { useState, useEffect, useContext } from 'react';
import { Outlet, NavLink, Link, Navigate } from 'react-router-dom';
import '../assets/css/admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartContext } from '../context/CartContext';

const AdminLayout = () => {
    
    // --- 1. TODOS LOS HOOKS VAN PRIMERO ---
    
    // Hook del Contexto
    const { isAuthenticated, usuario } = useContext(CartContext);
    
    // Hook del Menú
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Hook de Carga (para esperar al contexto)
    const [loading, setLoading] = useState(true);

    // Hook para el overlay del menú responsive (movido al inicio)
    useEffect(() => {
        document.body.classList.toggle('sidebar-open', menuOpen);
        return () => {
            document.body.classList.remove('sidebar-open');
        };
    }, [menuOpen]);

    // Hook para esperar que el contexto se hidrate desde localStorage
    useEffect(() => {
        // Cuando el estado de isAuthenticated del contexto (que se lee 
        // desde localStorage) cambia, dejamos de "cargar".
        setLoading(false);
    }, [isAuthenticated]); // Se ejecuta cuando isAuthenticated cambia

    
    // --- 2. LÓGICA DE REDIRECCIÓN (DESPUÉS DE LOS HOOKS) ---

    // Si aún estamos esperando que el contexto lea de localStorage...
    if (loading) {
        // No mostramos nada todavía para evitar el "parpadeo"
        return <div style={{textAlign: 'center', padding: '50px'}}>Verificando acceso...</div>;
    }

    // Ahora que ya cargó, si no está autenticado, redirige a /login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado PERO no es ADMIN (el backend envía 'ADMIN')
    if (usuario && usuario.role !== 'ADMIN') {
        // Lo sacamos al Home.
        return <Navigate to="/" replace />;
    }

    // Si pasó todas las verificaciones, es un Admin autenticado.
    // Mostramos el layout.
    return (
        <div className="admin-layout">
            <header>
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

            <div className="admin-layout-container"> 
                <aside className={`sidebar ${menuOpen ? 'active' : ''}`}>
                    <nav className="nav">
                        <ul className="list-unstyled">
                            <h5 className="mt-3">Gestión</h5>
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
                
                <main className="admin-main-content">
                    <Outlet /> {/* Aquí se renderizan las páginas de admin */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;