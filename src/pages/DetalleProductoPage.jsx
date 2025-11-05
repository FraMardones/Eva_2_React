import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import '../assets/css/detalle-producto.css'; 

// --- Función Helper para la Imagen ---
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return process.env.PUBLIC_URL + '/img/default.png'; 
    }
    if (imagePath.startsWith('data:image/')) {
        return imagePath;
    }
    return process.env.PUBLIC_URL + imagePath;
};

// --- Función Helper para Estrellas ---
const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
};

const DetalleProductoPage = () => {
    const { code } = useParams(); 
    const { addToCart } = useContext(CartContext);
    
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                setLoading(true);
                setError(null); // Limpia errores anteriores
                const response = await axios.get(`http://localhost:8080/api/productos/${code}`);
                setProducto(response.data);

            } catch (err) {
                console.error("Error al cargar el producto:", err);
                
                // --- AQUÍ ESTÁ LA MEJORA ---
                // Revisa si el error es un 404
                if (err.response && err.response.status === 404) {
                    setError("Error 404: Producto no encontrado. Es posible que el servidor se haya reiniciado.");
                } else {
                    setError("No se pudo cargar el producto. Revisa la conexión con el servidor (API).");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [code]); 

    // Muestra "Cargando..."
    if (loading) {
        return <h2 className="text-center py-5">Cargando producto...</h2>;
    }

    // Muestra el mensaje de error (ej: el 404)
    if (error) {
        return <h2 className="text-center py-5" style={{ color: 'red' }}>{error}</h2>;
    }

    // Muestra "No encontrado" si la API funcionó pero no devolvió nada
    if (!producto) {
         return <h2 className="text-center py-5">Producto no encontrado.</h2>;
    }

    const handleAddToCart = () => {
        addToCart(producto);
        alert(`${producto.name} ha sido agregado al carrito.`);
    };

    // Muestra el producto si todo salió bien
    return (
        <main className="container detalle-producto py-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={getImageUrl(producto.image)} alt={producto.name} className="img-fluid" />
                </div>
                <div className="col-md-6">
                    <h2 className="mb-3">{producto.name}</h2>
                    <div className="rating mb-3">
                        <span className="stars">{renderStars(producto.rating)}</span>
                        <span className="reviews">({producto.reviews || 0} reseñas)</span>
                    </div>
                    <p className="descripcion">{producto.description}</p>
                    <h3 className="precio my-4">${(producto.price || 0).toLocaleString('es-CL')}</h3>
                    
                    <button className="btn btn-primary btn-lg me-2" onClick={handleAddToCart}>
                        Agregar al Carrito
                    </button>
                    <Link to="/productos" className="btn btn-outline-secondary btn-lg">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default DetalleProductoPage;