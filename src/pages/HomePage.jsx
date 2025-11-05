import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CategoryFilter from '../components/CategoryFilter';
import UserProfile from '../components/UserProfile';
import { CartContext } from '../context/CartContext';

import '../assets/css/banner.css';
import '../assets/css/productos.css';

// --- FUNCIÓN HELPER (LA MISMA QUE ANTES) ---
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return process.env.PUBLIC_URL + '/img/default.png'; 
    }
    if (imagePath.startsWith('data:image/')) {
        return imagePath;
    }
    return process.env.PUBLIC_URL + imagePath;
};

// --- FUNCIÓN HELPER (CORREGIDA) ---
const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
};

// Función para normalizar texto (sin cambios)
const normalizeText = (text) => {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceFilter, setPriceFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ... (Hook useEffect para cargar productos, sin cambios) ...
    useEffect(() => {
        const fetchAllProductos = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/api/productos');
                setAllProducts(response.data);
                setFilteredProducts(response.data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar productos en Home:", err);
                setError("Error al cargar productos.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllProductos();
    }, []);

    // ... (Hook useEffect para filtrar productos, sin cambios) ...
    useEffect(() => {
        let tempProducts = [...allProducts];

        if (searchTerm) {
             tempProducts = tempProducts.filter(product =>
                (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) // Protegido
            );
        }
        if (selectedCategory !== 'all') {
             tempProducts = tempProducts.filter(product =>
                normalizeText(product.category) === selectedCategory
            );
        }
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(str => str === '' ? undefined : Number(str));
             tempProducts = tempProducts.filter(product => {
                const price = product.price || 0; // Protegido
                if (max !== undefined) {
                    return price >= min && price <= max;
                }
                return price >= min;
            });
        }
        setFilteredProducts(tempProducts);

    }, [selectedCategory, priceFilter, searchTerm, allProducts]);

    return (
        <div>
            {/* --- Sección del Banner (con el arreglo de CSS en línea) --- */}
            <section className="banner py-5 bg-dark text-light">
                 <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h1 className="display-4 fw-bold animate-text">Level-UP Gamer</h1>
                            <p className="lead animate-text-delay">¡Desafía tus límites y únete a la comunidad gamer! Consolas, accesorios y más con envío a todo Chile.</p>
                            <p className="mb-3 animate-text-delay2">Productos de alta calidad para cada gamer, con envíos rápidos y seguros.</p>
                            <div className="mb-3 animate-text-delay3">
                                <span className="material-icons align-middle">local_shipping</span> Envío a todo Chile<br />
                                <span className="material-icons align-middle">sports_esports</span> Amplia variedad de productos<br />
                                <span className="material-icons align-middle">star</span> Calidad y confianza garantizadas
                            </div>
                            <Link to="/productos" className="btn btn-primary btn-lg animate-button">Explora nuestros productos</Link>
                        </div>
                        {/* Esta es la columna de la imagen (con la corrección forzada) */}
                        <div className="col-md-6 text-center">
                            <img
                                src={process.env.PUBLIC_URL + "/img/banner2.png"}
                                alt="Banner Gamer"
                                className="img-fluid animate-img banner-img"
                                // Estilo en línea para forzar la visualización
                                style={{ display: 'block', margin: 'auto' }} 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Componente de Perfil de Usuario (sin cambios) */}
            <UserProfile />

            <div className="banner-divider"></div>

            <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* --- Sección de Productos --- */}
            <section className="products container">
                 <h2 className="section-title">Nuestros Productos</h2>
                <div className="filters mb-4 d-flex gap-2">
                    {/* ... (filtros sin cambios) ... */}
                    <input
                        type="text"
                        className="filter-input flex-grow-1"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="filter-input"
                        onChange={(e) => setPriceFilter(e.target.value)}
                        value={priceFilter}
                    >
                      <option value="">Filtrar por precio</option>
                      <option value="0-30000">$0 - $30.000</option>
                      <option value="30000-100000">$30.000 - $100.000</option>
                      <option value="100000-500000">$100.000 - $500.000</option>
                      <option value="500000-">$500.000 o más</option>
                    </select>
                </div>
                
                {loading && <p className="text-center w-100">Cargando productos...</p>}
                {error && <p className="text-center w-100" style={{color: 'red'}}>{error}</p>}
                
                {!loading && !error && (
                    <div className="grid-productos">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div className="card" key={product.code}>
                                    
                                    <img src={getImageUrl(product.image)} alt={product.name || 'Producto'} />
                                    
                                    <div className="card-body">
                                        <h6>{product.name || 'Producto sin nombre'}</h6>
                                        <div className="rating mb-2">
                                            <span className="stars">{renderStars(product.rating)}</span>
                                            <span className="reviews">({product.reviews || 0} reseñas)</span>
                                        </div>
                                        
                                        {/* ✅ ¡ESTA ES LA CORRECCIÓN PRINCIPAL! */}
                                        <p className="descripcion">
                                            {(product.description || '').substring(0, 80)}...
                                        </p>
                                    </div>
                                    {/* ✅ Protección para el precio */}
                                    <div className="precio">${(product.price || 0).toLocaleString('es-CL')}</div>
                                    <Link to={`/producto/${product.code}`} className="btn btn-outline-light">
                                        Ver detalle
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center w-100">No se encontraron productos con esos filtros.</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;