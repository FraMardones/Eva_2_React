import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // Importamos axios
import { CartContext } from '../context/CartContext';
import '../assets/css/detalle-producto.css';



const DetalleProductoPage = () => {
    const { id } = useParams(); // Obtiene el 'id' (código) de la URL
    const { addToCart } = useContext(CartContext);

    // --- NUEVOS ESTADOS ---
    const [producto, setProducto] = useState(null); // Un solo producto, o null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NUEVO HOOK useEffect ---
    // Se ejecuta cada vez que el 'id' (de la URL) cambia
    useEffect(() => {
        const fetchProducto = async () => {
            try {
                setLoading(true);
                // 1. Llama a la API con el ID específico
                const response = await axios.get(`http://localhost:8080/api/productos/${id}`);
                // 2. Guarda el producto encontrado en el estado
                setProducto(response.data);
                setError(null);
            } catch (err) {
                // 3. Si hay un error (ej. 404 Not Found)
                console.error("Error al cargar el producto:", err);
                setError("Producto no encontrado.");
                setProducto(null);
            } finally {
                // 4. Termina la carga
                setLoading(false);
            }
        };

        if (id) {
            fetchProducto(); // Llama a la función solo si hay un id
        }

    }, [id]); // El array [id] asegura que esto se repita si el id cambia

    const handleAddToCart = () => {
        addToCart(producto);
        alert(`${producto.name} ha sido agregado al carrito.`);
    };

    // --- MANEJO DE ESTADOS DE CARGA Y ERROR ---
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
    
    // Si el producto es null pero no hay error ni carga (caso improbable)
    if (!producto) {
         return (
            <div className="container py-5 text-center">
                <h2>Producto no encontrado</h2>
                <Link to="/productos" className="btn btn-primary">Volver a Productos</Link>
            </div>
        );
    }

    // --- RENDERIZADO (sin cambios, ahora usa el estado 'producto') ---
    return (
        <main className="container py-5">
            <div id="detalle-producto">
                <div className="card-detalle row">
                    <div className="col-md-6 img-container">
                        <img src={process.env.PUBLIC_URL + producto.image} alt={producto.name} className="img-fluid" />
                    </div>
                    <div className="col-md-6 info">
                        <h2>{producto.name}</h2>
                        <p className="lead">${producto.price.toLocaleString('es-CL')} CLP</p>
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