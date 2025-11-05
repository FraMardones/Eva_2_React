import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importamos axios
import { CartContext } from '../context/CartContext';
import '../assets/css/productos.css'; // Asegúrate de importar el CSS

// Función para renderizar estrellas (sin cambios)
const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
};

const ProductosPage = () => {
    const { addToCart } = useContext(CartContext);
    
    // --- NUEVOS ESTADOS ---
    // 1. Estado para guardar los productos que vienen de la API
    const [productos, setProductos] = useState([]);
    // 2. Estado para manejar la carga (mostrar "Cargando...")
    const [loading, setLoading] = useState(true);
    // 3. Estado para manejar errores de red
    const [error, setError] = useState(null);

    // --- NUEVO HOOK useEffect ---
    // Esto se ejecuta una sola vez cuando el componente se monta
    useEffect(() => {
        // Función asíncrona para cargar los productos
        const fetchProductos = async () => {
            try {
                // 1. Pone el estado en "cargando"
                setLoading(true);
                // 2. Llama a la API de Spring Boot
                const response = await axios.get('http://localhost:8080/api/productos');
                // 3. Guarda los productos de la respuesta en el estado
                setProductos(response.data);
                setError(null); // Limpia errores previos
            } catch (err) {
                // 4. Si hay un error, lo guarda en el estado
                console.error("Error al cargar productos:", err);
                setError("Error al cargar los productos. Intenta de nuevo más tarde.");
            } finally {
                // 5. Quita el estado de "cargando", tanto si tuvo éxito como si falló
                setLoading(false);
            }
        };

        fetchProductos(); // Llama a la función
    }, []); // El array vacío [] asegura que solo se ejecute una vez

    const handleAddToCart = (product) => {
        addToCart(product);
        alert(`${product.name} ha sido agregado al carrito.`);
    };

    // --- MANEJO DE ESTADOS DE CARGA Y ERROR ---
    if (loading) {
        return <h2 className="text-center py-5">Cargando productos...</h2>;
    }

    if (error) {
        return <h2 className="text-center py-5" style={{ color: 'red' }}>{error}</h2>;
    }

    // --- RENDERIZADO (sin cambios, ahora usa el estado 'productos') ---
    return (
        <main className="productos">
            <h2>Nuestros Productos</h2>
            <div className="grid-productos">
                {productos.map(p => (
                    <div className="card" key={p.code}>
                        <img src={process.env.PUBLIC_URL + p.image} alt={p.name} />
                        <div className="card-body">
                             <h6>{p.name}</h6>
                            <div className="rating mb-2">
                                <span className="stars">{renderStars(p.rating)}</span>
                                <span className="reviews">({p.reviews} reseñas)</span>
                            </div>
                            <p className="descripcion">{p.description.substring(0, 90)}...</p>
                        </div>
                        <div className="precio">${p.price.toLocaleString('es-CL')}</div>
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