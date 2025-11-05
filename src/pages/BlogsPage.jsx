import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importamos axios
import '../assets/css/blog.css';

// Ya no importamos los datos locales
// import { blogs } from '../data/blogs';

const BlogsPage = () => {
    // --- ESTADOS PARA DATOS DE LA API ---
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- HOOK PARA CARGAR BLOGS DESDE LA API ---
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                // 1. Llama a la API de blogs de Spring Boot
                const response = await axios.get('http://localhost:8080/api/blogs');
                // 2. Guarda los blogs en el estado
                setBlogs(response.data);
                setError(null);
            } catch (err) {
                // 3. Maneja cualquier error
                console.error("Error al cargar blogs:", err);
                setError("No se pudieron cargar los blogs.");
            } finally {
                // 4. Finaliza la carga
                setLoading(false);
            }
        };

        fetchBlogs(); // Llama a la función
    }, []); // El array vacío [] asegura que solo se ejecute una vez

    // --- MANEJO DE ESTADOS DE CARGA Y ERROR ---
    if (loading) {
        return <h2 className="text-center py-5">Cargando blogs...</h2>;
    }

    if (error) {
        return <h2 className="text-center py-5" style={{ color: 'red' }}>{error}</h2>;
    }

    // --- RENDERIZADO (ahora usa el estado 'blogs') ---
    return (
        <main className="main-blogs py-5">
            <h1>📰 Noticias y Curiosidades</h1>
            <div className="grid-blogs">
                {blogs.map(blog => (
                    <div className="blog-card-wrapper" key={blog.id}>
                        <div className="card h-100 shadow-sm">
                            {/* ¡CORRECCIÓN DE IMAGEN! */}
                            <img src={process.env.PUBLIC_URL + blog.imagen} className="card-img-top" alt={blog.titulo} />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{blog.titulo}</h5>
                                <p className="card-text">{blog.descripcion}</p>
                                <Link to={`/blog/${blog.id}`} className="btn btn-primary mt-auto">Leer más</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};
export default BlogsPage;