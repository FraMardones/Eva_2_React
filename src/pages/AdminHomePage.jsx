import React from 'react';
import { Link } from 'react-router-dom';

const AdminHomePage = () => {
    return (
        <div>
            <h3 className="mb-4">Bienvenido Administrador 👋</h3>
            <p>Desde aquí puedes gestionar <strong>productos</strong> y <strong>usuarios</strong>.</p>
            <div className="row">
                <div className="col-md-6">
                    <div className="card text-center shadow-sm mb-4">
                        <div className="card-body">
                            <span className="material-icons" style={{ fontSize: '48px', color: '#0d6efd' }}>inventory_2</span>
                            <h5 className="card-title mt-2">Productos</h5>
                            <p className="card-text">Agrega, edita o elimina productos del catálogo.</p>
                            <Link to="/admin/productos" className="btn btn-primary">Ir a Productos</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card text-center shadow-sm mb-4">
                        <div className="card-body">
                            <span className="material-icons" style={{ fontSize: '48px', color: '#198754' }}>people</span>
                            <h5 className="card-title mt-2">Usuarios</h5>
                            <p className="card-text">Ver la lista de usuarios registrados en la tienda.</p>
                            <Link to="/admin/usuarios" className="btn btn-success">Ir a Usuarios</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;