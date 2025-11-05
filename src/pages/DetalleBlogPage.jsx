import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // Importamos axios
import '../assets/css/detalle_blog.css';

// Ya no importamos los datos locales
// import { blogs } from '../data/blogs';

const DetalleBlogPage = () => {
    const { id } = useParams(); // Obtiene el 'id' (código) de la URL

    // --- NUEVOS ESTADOS ---
    const [blog, setBlog] = useState(null); // Un solo blog, o null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NUEVO HOOK useEffect ---
    // Se ejecuta cada vez que el 'id' (de la URL) cambia
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                // 1. Llama a la API con el ID específico del blog
                const response = await axios.get(`http://localhost:8080/api/blogs/${id}`);
                // 2. Guarda el blog encontrado en el estado
                setBlog(response.data);
                setError(null);
            } catch (err) {
                // 3. Si hay un error (ej. 404 Not Found)
                console.error("Error al cargar el blog:", err);
                setError("Blog no encontrado.");
                setBlog(null);
            } finally {
                // 4. Termina la carga
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog(); // Llama a la función solo si hay un id
        }

    }, [id]); // El array [id] asegura que esto se repita si el id cambia

    // --- MANEJO DE ESTADOS DE CARGA Y ERROR ---
    if (loading) {
        return <h2 className="text-center py-5">Cargando blog...</h2>;
    }

    if (error || !blog) {
        return (
            <div className="container py-5 text-center">
                <h2 style={{ color: 'red' }}>{error || "Blog no encontrado."}</h2>
                <Link to="/blogs" className="btn btn-secondary mt-3">← Volver a Blogs</Link>
            </div>
        );
    }
    
    // --- RENDERIZADO (ahora usa el estado 'blog') ---
    return (
        <main className="container py-5" id="detalle-blog">
            <h1>{blog.titulo}</h1>
            <p className="text-muted">Por {blog.autor} - {blog.fecha}</p>
            {/* ¡CORRECCIÓN DE IMAGEN! */}
            <img src={process.env.PUBLIC_URL + blog.imagen} className="img-fluid mb-4" alt={blog.titulo} />
            {/* Usamos pre-line para respetar los saltos de línea del contenido del blog */}
            <p style={{ whiteSpace: 'pre-line' }}>{blog.contenido}</p>
            <Link to="/blogs" className="btn btn-secondary mt-3">← Volver a Blogs</Link>
        </main>
    );
};
export default DetalleBlogPage;