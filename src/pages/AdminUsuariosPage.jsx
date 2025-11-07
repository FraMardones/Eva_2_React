import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext'; 
import { regionesYcomunas } from '../data/regiones'; 

const API_AUTH_URL = 'http://localhost:8080/api/auth';
const API_USUARIOS_URL = 'http://localhost:8080/api/usuarios';

const AdminUsuariosPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(CartContext); 

    // Estado del formulario (con points y level)
    const [formData, setFormData] = useState({
        run: '',
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        fechaNac: '', 
        role: 'USER',
        region: '',
        comuna: '',
        points: 0, // <-- AÑADIDO
        level: 1  // <-- AÑADIDO
    });
    const [isEditing, setIsEditing] = useState(false);
    const [comunas, setComunas] = useState([]);

    // Carga de Datos
    const fetchUsuarios = async () => {
        if (!token) {
            setError("No estás autenticado para ver esta información.");
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.get(API_USUARIOS_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsuarios(response.data);
            setError(null);
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
            setError("Error al cargar los usuarios. Revisa los permisos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, [token]);

    // Lógica del Formulario
    useEffect(() => {
        if (formData.region && regionesYcomunas && regionesYcomunas[formData.region]) {
            setComunas(regionesYcomunas[formData.region]);
        } else {
            setComunas([]);
        }
    }, [formData.region]);

    const handleInputChange = (e) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [id]: type === 'number' ? parseInt(value) || 0 : value 
        }));
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({
            run: '', nombre: '', apellidos: '', email: '',
            password: '', fechaNac: '', role: 'USER', region: '', comuna: '',
            points: 0, // <-- AÑADIDO
            level: 1   // <-- AÑADIDO
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.nombre || !formData.apellidos) {
            alert("Email, Nombre y Apellidos son obligatorios.");
            return;
        }

        const usuarioData = { ...formData };
        if (!usuarioData.run) delete usuarioData.run;
        if (!usuarioData.fechaNac) delete usuarioData.fechaNac;

        // Aseguramos que points y level sean números
        usuarioData.points = Number(usuarioData.points) || 0;
        usuarioData.level = Number(usuarioData.level) || 1;

        if (isEditing) {
            // LÓGICA DE EDITAR (PUT)
            try {
                const dataParaPut = { ...usuarioData };
                if (!dataParaPut.password) {
                    delete dataParaPut.password; 
                }
                
                await axios.put(`${API_USUARIOS_URL}/${formData.email}`, dataParaPut, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert("¡Usuario actualizado!");
                handleCancelEdit();
                await fetchUsuarios();
            } catch (err) {
                 console.error("Error al actualizar usuario:", err);
                alert("Error al actualizar el usuario.");
            }
        } else {
            // LÓGICA DE CREAR (POST)
            if (!formData.password) {
                alert("La contraseña es obligatoria para crear un nuevo usuario.");
                return;
            }
            try {
                // Usamos el endpoint de registro (que ahora asigna puntos por defecto)
                await axios.post(`${API_AUTH_URL}/register`, usuarioData); 
                alert("¡Usuario creado con éxito!");
                handleCancelEdit(); 
                await fetchUsuarios(); 
            } catch (err) {
                console.error("Error al crear usuario:", err);
                alert("Error al crear el usuario. ¿El email ya existe?");
            }
        }
    };

    const handleEditClick = (usuario) => {
        setIsEditing(true);
        const fechaNacFormateada = usuario.fechaNac ? usuario.fechaNac.split('T')[0] : '';

        setFormData({
            ...usuario,
            fechaNac: fechaNacFormateada,
            password: '', 
            points: usuario.points || 0, // <-- AÑADIDO
            level: usuario.level || 1   // <-- AÑADIDO
        });
        setComunas(regionesYcomunas[usuario.region] || []);
    };

    const handleDeleteClick = async (email) => {
        // LÓGICA DE ELIMINAR (DELETE)
        if (!window.confirm(`¿Estás seguro de eliminar al usuario ${email}?`)) {
            return;
        }
        try {
            await axios.delete(`${API_USUARIOS_URL}/${email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Usuario eliminado");
            await fetchUsuarios();
        } catch (err) {
            console.error("Error al eliminar:", err);
            alert("Error al eliminar usuario.");
        }
    };

    if (loading) return <h2 className="text-center py-5">Cargando Usuarios...</h2>;
    if (error) return <h2 className="text-center py-5" style={{ color: 'red' }}>{error}</h2>;

    return (
        <div className="container py-3">
            <h3 className="mb-4">Administrar Usuarios</h3>
            
            <div className="table-responsive mb-5 admin-card">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Email</th>
                            <th>Nombre</th>
                            <th>RUN</th>
                            <th>Rol</th>
                            <th>Puntos</th>
                            <th>Nivel</th> {/* <-- AÑADIDO */}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(user => (
                            <tr key={user.email}>
                                <td>{user.email}</td>
                                <td>{user.nombre} {user.apellidos}</td>
                                <td>{user.run || 'N/A'}</td>
                                <td>
                                    <span className={`badge ${user.role === 'ADMIN' ? 'bg-success' : 'bg-secondary'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{user.points}</td>
                                <td>{user.level}</td> {/* <-- AÑADIDO */}
                                <td>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => handleEditClick(user)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(user.email)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Formulario de Crear / Editar --- */}
            <h4>{isEditing ? 'Editando Usuario' : 'Agregar Nuevo Usuario'}</h4>
            <form onSubmit={handleSubmit} className="row g-3 p-3 admin-card mt-3">
                
                <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email (ID)</label>
                    <input type="email" className="form-control" id="email" value={formData.email} onChange={handleInputChange} disabled={isEditing} required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="password" value={formData.password} onChange={handleInputChange} placeholder={isEditing ? "(Dejar en blanco para no cambiar)" : "Contraseña requerida"} required={!isEditing} />
                </div>

                <div className="col-md-4">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" value={formData.nombre} onChange={handleInputChange} required />
                </div>
                <div className="col-md-5">
                    <label htmlFor="apellidos" className="form-label">Apellidos</label>
                    <input type="text" className="form-control" id="apellidos" value={formData.apellidos} onChange={handleInputChange} required />
                </div>
                <div className="col-md-3">
                    <label htmlFor="run" className="form-label">RUN</label>
                    <input type="text" className="form-control" id="run" value={formData.run} onChange={handleInputChange} />
                </div>
                
                <div className="col-md-4">
                    <label htmlFor="fechaNac" className="form-label">Fecha Nacimiento</label>
                    <input type="date" className="form-control" id="fechaNac" value={formData.fechaNac} onChange={handleInputChange} />
                </div>
                <div className="col-md-2">
                    <label htmlFor="role" className="form-label">Rol</label>
                    <select id="role" className="form-select" value={formData.role} onChange={handleInputChange}>
                        <option value="USER">Cliente</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                {/* --- CAMPOS DE PUNTOS Y NIVEL --- */}
                <div className="col-md-2">
                    <label htmlFor="points" className="form-label">Puntos</label>
                    <input type="number" className="form-control" id="points" value={formData.points} onChange={handleInputChange} />
                </div>
                <div className="col-md-2">
                    <label htmlFor="level" className="form-label">Nivel</label>
                    <input type="number" className="form-control" id="level" value={formData.level} onChange={handleInputChange} />
                </div>
                {/* --------------------------- */}


                <div className="col-md-3">
                    <label htmlFor="region" className="form-label">Región</label>
                    <select id="region" className="form-select" value={formData.region} onChange={handleInputChange}>
                        <option value="">Selecciona Región</option>
                        {regionesYcomunas && Object.keys(regionesYcomunas).map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>
                
                <div className="col-md-3">
                    <label htmlFor="comuna" className="form-label">Comuna</label>
                    <select id="comuna" className="form-select" value={formData.comuna} onChange={handleInputChange} disabled={!formData.region}>
                        <option value="">Selecciona Comuna</option>
                        {comunas.map(comuna => (
                            <option key={comuna} value={comuna}>{comuna}</option>
                        ))}
                    </select>
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary me-2">
                        {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                    </button>
                    {isEditing && (
                         <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AdminUsuariosPage;