import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productos';

// --- NUEVA FUNCIÓN ---
// Esta función decide si la imagen es una ruta o Base64
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return process.env.PUBLIC_URL + '/img/default.png'; // Imagen por defecto
    }
    // Si es Base64, úsala directamente
    if (imagePath.startsWith('data:image/')) {
        return imagePath;
    }
    // Si es una ruta, añádele el PUBLIC_URL
    return process.env.PUBLIC_URL + imagePath;
};

const AdminProductosPage = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({ id: '', nombre: '', precio: '', imagen: '', description: '', category: 'Accesorios', rating: 0, reviews: 0 });
    const [editingId, setEditingId] = useState(null);
    const fileInputRef = useRef(null); // Ref para limpiar el input file

    // --- LÓGICA DE DATOS (Sin cambios) ---
    const fetchProductos = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setProductos(response.data);
            setError(null);
        } catch (err) {
            console.error("Error al cargar productos:", err);
            setError("Error al cargar los productos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id, nombre, precio, imagen, description, category, rating, reviews } = formData;
        if (!id || !nombre || !precio) {
            alert('ID, Nombre y Precio son obligatorios.');
            return;
        }

        const newProduct = { 
            code: id,
            name: nombre, 
            price: Number(precio), 
            // 'imagen' ya es Base64 (si se subió una nueva) o la ruta/Base64 anterior
            image: imagen || '/img/default.png', 
            description: description,
            category: category,
            rating: Number(rating),
            reviews: Number(reviews)
        };

        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, newProduct);
                alert("Producto actualizado con éxito");
            } else {
                if (productos.some(p => p.code === newProduct.code)) {
                    alert("¡El ID del producto ya existe!");
                    return;
                }
                await axios.post(API_URL, newProduct);
                alert("Producto creado con éxito");
            }
            
            handleCancelEdit();
            await fetchProductos();

        } catch (err) {
            console.error("Error al guardar producto:", err);
            alert("Error al guardar el producto.");
        }
    };

    const handleDelete = async (code) => {
        if (!window.confirm(`¿Estás seguro de eliminar el producto ${code}?`)) {
            return;
        }
        try {
            await axios.delete(`${API_URL}/${code}`);
            alert("Producto eliminado con éxito");
            await fetchProductos();
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            alert("Error al eliminar el producto.");
        }
    };

    // --- Lógica del Formulario (ACTUALIZADA) ---

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // ✅ VUELVE LA FUNCIÓN PARA MANEJAR SUBIDA DE IMAGEN
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            // Convierte la imagen a Base64 y la guarda en el estado del formulario
            setFormData(prev => ({ ...prev, imagen: event.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleEdit = (product) => {
        setEditingId(product.code);
        setFormData({ 
            id: product.code, 
            nombre: product.name, 
            precio: product.price, 
            imagen: product.image, // La imagen ya es Base64 o una ruta
            description: product.description,
            category: product.category || 'Accesorios',
            rating: product.rating || 0,
            reviews: product.reviews || 0
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ id: '', nombre: '', precio: '', imagen: '', description: '', category: 'Accesorios', rating: 0, reviews: 0 });
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    // --- Renderizado (ACTUALIZADO) ---

    if (loading) return <h2 className="text-center py-5">Cargando...</h2>;
    if (error) return <h2 className="text-center py-5" style={{ color: 'red' }}>{error}</h2>;

    return (
        <div className="container py-3">
            <h3 className="mb-4">Administrar Productos</h3>
            <div className="table-responsive mb-5" style={{backgroundColor: 'white'}}>
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(productos || []).map(prod => (
                            <tr key={prod.code}>
                                <td>{prod.code}</td>
                                <td>{prod.name}</td>
                                <td>${prod.price.toLocaleString('es-CL')}</td>
                                {/* ✅ USA LA NUEVA FUNCIÓN HELPER */}
                                <td><img src={getImageUrl(prod.image)} alt={prod.name} width="50" /></td>
                                <td>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => handleEdit(prod)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prod.code)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h4>{editingId ? 'Editando Producto' : 'Agregar Nuevo Producto'}</h4>
            <form onSubmit={handleSubmit} className="row g-3 p-3" style={{backgroundColor: 'white', borderRadius: '8px'}}>
                {/* ... (campos id, nombre, precio sin cambios) ... */}
                <div className="col-md-3">
                    <label htmlFor="id" className="form-label">ID</label>
                    <input type="text" className="form-control" id="id" value={formData.id} onChange={handleInputChange} disabled={!!editingId} required />
                </div>
                <div className="col-md-5">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" value={formData.nombre} onChange={handleInputChange} required />
                </div>
                <div className="col-md-4">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input type="number" className="form-control" id="precio" value={formData.precio} onChange={handleInputChange} required min="0"/>
                </div>
                
                {/* ✅ VUELVE EL INPUT TIPO 'file' */}
                <div className="col-md-6">
                    <label htmlFor="imagen" className="form-label">Imagen</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="imagen" 
                        onChange={handleImageChange} // Usa la función de Base64
                        ref={fileInputRef} 
                        accept="image/png, image/jpeg, image/webp"
                    />
                </div>
                 {/* ... (otros campos del formulario sin cambios) ... */}
                 <div className="col-md-6">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea className="form-control" id="description" value={formData.description} onChange={handleInputChange} rows="2"></textarea>
                </div>
                <div className="col-md-4">
                    <label htmlFor="category" className="form-label">Categoría</label>
                    <input type="text" className="form-control" id="category" value={formData.category} onChange={handleInputChange} />
                </div>
                 <div className="col-md-4">
                    <label htmlFor="rating" className="form-label">Rating (0-5)</label>
                    <input type="number" className="form-control" id="rating" value={formData.rating} onChange={handleInputChange} max="5" min="0" />
                </div>
                 <div className="col-md-4">
                    <label htmlFor="reviews" className="form-label">Reseñas</label>
                    <input type="number" className="form-control" id="reviews" value={formData.reviews} onChange={handleInputChange} min="0" />
                </div>
                
                <div className="col-12">
                    <button type="submit" className="btn btn-primary me-2">
                        {editingId ? 'Actualizar Producto' : 'Agregar Producto'}
                    </button>
                    {editingId && (
                         <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                            Cancelar Edición
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AdminProductosPage;