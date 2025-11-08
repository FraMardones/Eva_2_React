import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api'; // <-- ¡CAMBIO 1: Importamos la api central!
import { CartContext } from '../context/CartContext';
import '../assets/css/productos.css'; 

// --- 1. FUNCIÓN HELPER PARA LA IMAGEN ---
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return process.env.PUBLIC_URL + '/img/default.png'; 
    }
    if (imagePath.startsWith('data:image/')) {
        return imagePath;
    }
    return process.env.PUBLIC_URL + imagePath;
};

// --- 2. FUNCIÓN HELPER PARA ESTRELLAS (CON CORRECCIÓN) ---
const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
};

const ProductosPage = () => {
    const { addToCart } = useContext(CartContext);
    
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                // --- ¡CAMBIO 2: Usamos 'api' y la URL corta ---
                const response = await api.get('/api/productos');
                setProductos(response.data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar productos:", err);
                setError("Error al cargar los productos. Intenta de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []); 

    const handleAddToCart = (product) => {
        addToCart(product);
        alert(`${product.name} ha sido agregado al carrito.`);
    };

    if (loading) {
        return <h2 className="text-center py-5">Cargando productos...</h2>;
    }

    if (error) {
        return <h2 className="text-center py-5" style={{ color: 'red' }}>{error}</h2>;
    }

    return (
        <main className="productos">
            <h2>Nuestros Productos</h2>
            <div className="grid-productos">
                {/* 3. Protección contra 'productos' nulo */ }
                {(productos || []).map(p => (
                    <div className="card" key={p.code}>
                        
                        {/* 4. Corrección de Imagen */}
                        <img src={getImageUrl(p.image)} alt={p.name || 'Producto'} />
                        
                        <div className="card-body">
                            <h6>{p.name || 'Producto sin nombre'}</h6>
                            <div className="rating mb-2">
                                {/* 5. Corrección de Rating y Reviews */}
                                <span className="stars">{renderStars(p.rating)}</span>
                                <span className="reviews">({p.reviews || 0} reseñas)</span>
                            </div>
                            
                            {/* 6. ¡LA CORRECCIÓN DE TU ERROR! (p.description || '') */}
                            <p className="descripcion">
                                {(p.description || '').substring(0, 90)}...
                            </p>
                        </div>
                        
                        {/* 7. Corrección de Precio */}
                        <div className="precio">${(p.price || 0).toLocaleString('es-CL')}</div>
                        
                        <div className="product-actions mt-auto">
                            <button className="btn btn-primary mb-2 w-100" onClick={() => handleAddToCart(p)}>
                                Agregar al Carrito
                            </button>
                            <Link to={`/producto/${p.code}`} className="btn btn-outline-light w-100">
                                Ver detalle
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};
export default ProductosPage;