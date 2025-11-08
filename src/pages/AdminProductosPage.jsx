import React, { useState, useRef, useEffect } from 'react';
import api from '../api/api'; // <-- ¡CAMBIO 1: Importamos la api central!

// Función para decidir si la imagen es una ruta o Base64
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return process.env.PUBLIC_URL + '/img/default.png'; // Imagen por defecto
    }
    if (imagePath.startsWith('data:image/')) {
        return imagePath;
    }
    return process.env.PUBLIC_URL + imagePath;
};

const AdminProductosPage = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({ id: '', nombre: '', precio: '', imagen: '', description: '', category: 'Accesorios', rating: 0, reviews: 0 });
    const [editingId, setEditingId] = useState(null);
    const fileInputRef = useRef(null); 

    const fetchProductos = async () => {
        setLoading(true);
        try {
            // <-- ¡CAMBIO 2: Usamos 'api' y la URL corta!
            const response = await api.get('/api/productos');
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
            image: imagen || '/img/default.png', 
            description: description,
            category: category,
            rating: Number(rating),
            reviews: Number(reviews)
        };

        try {
            if (editingId) {
                // <-- ¡CAMBIO 3: Usamos 'api' para PUT!
                await api.put(`/api/productos/${editingId}`, newProduct);
                alert("Producto actualizado con éxito");
            } else {
                if (productos.some(p => p.code === newProduct.code)) {
                    alert("¡El ID del producto ya existe!");
                    return;
                }
                // <-- ¡CAMBIO 4: Usamos 'api' para POST!
                await api.post('/api/productos', newProduct);
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
            // <-- ¡CAMBIO 5: Usamos 'api' para DELETE!
            await api.delete(`/api/productos/${code}`);
            alert("Producto eliminado con éxito");
            await fetchProductos();
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            alert("Error al eliminar el producto.");
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
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
            imagen: product.image, 
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

    if (loading) return <h2 className="text-center py-5">Cargando...</h2>;
    if (error) return <h2 className="text-center py-5" style={{ color: 'red' }}>{error}</h2>;

    // ... (El JSX de renderizado no cambia)
    return (
        <div className="container py-3">
            <h3 className="mb-4">Administrar Productos</h3>
            
            <div className="table-responsive mb-5 admin-card">
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
            
            <form onSubmit={handleSubmit} className="row g-3 p-3 admin-card mt-3">
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
                
                <div className="col-md-6">
                    <label htmlFor="imagen" className="form-label">Imagen</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="imagen" 
                        onChange={handleImageChange}
                        ref={fileInputRef} 
                        accept="image/png, image/jpeg, image/webp"
                    />
                </div>
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