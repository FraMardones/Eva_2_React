import React, { useState, useContext, useRef } from 'react';
import { CartContext } from '../context/CartContext'; // ✅ 1. Importa el Contexto

const AdminProductosPage = () => {
    // ✅ 2. Obtiene los productos y la función para actualizarlos desde el Contexto
    const { products, setProducts } = useContext(CartContext);
    
    // Estado local solo para el formulario
    const [formData, setFormData] = useState({ id: '', nombre: '', precio: '', imagen: '', description: '', category: 'Accesorios', rating: 0, reviews: 0 });
    const [editingId, setEditingId] = useState(null);
    const fileInputRef = useRef(null); // Ref para limpiar el input file

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // ✅ 3. NUEVA FUNCIÓN PARA MANEJAR LA SUBIDA DE IMAGEN
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

    const handleSubmit = (e) => {
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
            image: imagen || process.env.PUBLIC_URL + '/img/default.png', // Usa la imagen Base64 o una por defecto
            description: description,
            category: category,
            rating: Number(rating),
            reviews: Number(reviews)
        };

        if (editingId) {
            // Actualizar producto existente
            setProducts(prev => prev.map(p => (p.code === editingId ? newProduct : p)));
            setEditingId(null);
        } else {
            if (products.some(p => p.code === newProduct.code)) {
                alert("¡El ID del producto ya existe!");
                return;
            }
            // Añadir nuevo producto (usando setProducts del contexto)
            setProducts(prev => [...prev, newProduct]);
        }
        
        // Limpiar formulario y el input file
        setFormData({ id: '', nombre: '', precio: '', imagen: '', description: '', category: 'Accesorios', rating: 0, reviews: 0 });
        if (fileInputRef.current) fileInputRef.current.value = null;
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


    return (
        <div className="container py-3">
            <h3 className="mb-4">Administrar Productos</h3>
            <div className="table-responsive mb-5" style={{backgroundColor: 'white'}}>
                {/* ... (Tabla de productos, sin cambios) ... */}
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
                        {products.map(prod => (
                            <tr key={prod.code}>
                                <td>{prod.code}</td>
                                <td>{prod.name}</td>
                                <td>${prod.price.toLocaleString('es-CL')}</td>
                                <td><img src={prod.image} alt={prod.name} width="50" /></td>
                                <td>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => handleEdit(prod)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => setProducts(products.filter(p => p.code !== prod.code))}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h4>{editingId ? 'Editando Producto' : 'Agregar Nuevo Producto'}</h4>
            <form onSubmit={handleSubmit} className="row g-3 p-3" style={{backgroundColor: 'white', borderRadius: '8px'}}>
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
                
                {/* ✅ 4. INPUT DE TEXTO CAMBIADO A TIPO 'file' */}
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
                 {/* (Opcional) Campos extra que estaban en productos.js */}
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