import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api'; // <-- ¡CAMBIO 1: Importamos la api central!
import { CartContext } from '../context/CartContext';
import '../assets/css/detalle-producto.css'; //

// --- Función Helper para la Imagen (de tu versión nueva) ---
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return process.env.PUBLIC_URL + '/img/default.png'; 
    }
    if (imagePath.startsWith('data:image/')) {
        return imagePath;
    }
    return process.env.PUBLIC_URL + imagePath;
};

// --- ESTA ES LA LÓGICA NUEVA Y CORRECTA ---
const DetalleProductoPage = () => {
    const { code } = useParams(); // Corregido: usa 'code'
    const { addToCart } = useContext(CartContext);
    
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                setLoading(true);
                setError(null); 
                
                // <-- ¡CAMBIO 2: Usamos 'api' y la URL corta!
                const response = await api.get(`/api/productos/${code}`);
                setProducto(response.data);

            } catch (err) {
                console.error("Error al cargar el producto:", err);
                if (err.response && err.response.status === 404) {
                    setError("Error 404: Producto no encontrado.");
                } else {
                    setError("No se pudo cargar el producto. Revisa la conexión con el servidor (API).");
                }
            } finally {
                setLoading(false);
            }
        };

        if (code) { // Corregido: revisa 'code'
            fetchProducto();
        }
    }, [code]); // Corregido: depende de 'code'

    // --- MANEJO DE ESTADOS (sin cambios) ---
    if (loading) {
        return <h2 className="text-center py-5">Cargando producto...</h2>;
    }

    if (error) {
        return (
            <div className="container py-5 text-center">
                <h2 style={{ color: 'red' }}>{error}</h2>
                <Link to="/productos" className="btn btn-primary">Volver a Productos</Link>
            </div>
        );
    }
    
    if (!producto) {
         return (
            <div className="container py-5 text-center">
                <h2>Producto no encontrado</h2>
                <Link to="/productos" className="btn btn-primary">Volver a Productos</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(producto);
        alert(`${producto.name} ha sido agregado al carrito.`);
    };

    // --- ESTA ES LA ESTRUCTURA JSX ORIGINAL (LA QUE SE VE BIEN) ---
    //
    return (
        <main className="container py-5">
            <div id="detalle-producto">
                <div className="card-detalle row">
                    <div className="col-md-6 img-container">
                        {/* Usamos la nueva función getImageUrl */}
                        <img src={getImageUrl(producto.image)} alt={producto.name} className="img-fluid" />
                    </div>
                    <div className="col-md-6 info">
                        <h2>{producto.name}</h2>
                        <p className="lead">${(producto.price || 0).toLocaleString('es-CL')} CLP</p>
                        {/* CORREGIDO: Volvemos a la etiqueta <p> */}
                        <p className="descripcion">{producto.description}</p>
                        <button className="btn btn-success btn-lg" onClick={handleAddToCart}>
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default DetalleProductoPage;