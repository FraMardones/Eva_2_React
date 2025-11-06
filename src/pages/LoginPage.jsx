import React, { useState, useEffect, useContext } from 'react'; // <-- 1. IMPORTAR useContext
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { regionesYcomunas } from '../data/regiones';
import '../assets/css/login.css';
import { CartContext } from '../context/CartContext'; // <-- 2. IMPORTAR EL CONTEXTO

const LoginPage = () => {
    // --- 3. OBTENER LA FUNCIÓN 'login' DEL CONTEXTO ---
    const { login } = useContext(CartContext); 
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        run: '', nombre: '', apellidos: '', email: '',
        password: '', fechaNac: '', 
        role: 'USER', // <-- 4. CORRECCIÓN DE ROL: Cambiado 'cliente' a 'USER'
        region: '', comuna: '',
        referralCode: ''
    });
    const [errors, setErrors] = useState({});
    const [comunas, setComunas] = useState([]);

    useEffect(() => {
        if (formData.region && regionesYcomunas && regionesYcomunas[formData.region]) {
            setComunas(regionesYcomunas[formData.region]);
        } else {
            setComunas([]);
        }
        if (formData.comuna && !comunas.includes(formData.comuna)) {
             setFormData(prev => ({ ...prev, comuna: '' }));
        }
    }, [formData.region]); // Dependencia 'comunas' eliminada, era un error

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const validate = () => {
        // (Tu función de validación está bien, no se necesita cambiar)
        const newErrors = {};
        const nameRegex = /^[a-zA-Z\s]+$/;
        const runRegex = /^[0-9]+[0-9kK]?$/;
        const emailRegex = /^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
        if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio.";
        else if (!nameRegex.test(formData.nombre)) newErrors.nombre = "El nombre solo puede contener letras.";
        if (!formData.apellidos) newErrors.apellidos = "Los apellidos son obligatorios.";
        else if (!nameRegex.test(formData.apellidos)) newErrors.apellidos = "Los apellidos solo pueden contener letras.";
        if (!formData.run) newErrors.run = "El RUN es obligatorio.";
        else if (!runRegex.test(formData.run)) newErrors.run = "El RUN solo puede contener números y la letra K.";
        if (!formData.email) newErrors.email = "El correo es obligatorio.";
        else if (!emailRegex.test(formData.email)) newErrors.email = "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        if (!formData.password) newErrors.password = "La contraseña es obligatoria.";
        if (!formData.role) newErrors.role = "Debes seleccionar un rol.";
        if (!formData.region) newErrors.region = "Debes seleccionar una región.";
        if (!formData.comuna) newErrors.comuna = "Debes seleccionar una comuna.";
        if (!formData.fechaNac) newErrors.fechaNac = "La fecha de nacimiento es obligatoria.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- 5. handleRegister MODIFICADO ---
    const handleRegister = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                // 1. Llamamos a la API de registro
                const response = await axios.post('http://localhost:8080/api/auth/register', formData);
                
                // 2. Si el registro es exitoso (código 201)
                const newUser = response.data; // El backend devuelve el usuario creado
                alert(`¡Usuario ${newUser.nombre} registrado con éxito! Tu código de referido es: ${newUser.myReferralCode}`);
                
                // 3. ¡PROBLEMA SOLUCIONADO! Ahora, inicia sesión automáticamente
                // Haremos un "auto-login" con los datos que acabamos de registrar
                // (El backend /register no devuelve token, así que llamamos a /login)
                handleLogin(e, { email: formData.email, password: formData.password });

            } catch (error) {
                // (Manejo de errores sin cambios)
                console.error("Error en el registro:", error);
                if (error.response) {
                    if (error.response.status === 409) { 
                        setErrors(prev => ({ ...prev, email: "El correo electrónico ya está registrado." }));
                    } else if (error.response.status === 400) { 
                        alert("Error: Faltan datos o son incorrectos. " + (error.response.data.mensaje || ""));
                    } else {
                        alert("Error inesperado en el servidor al registrar.");
                    }
                } else {
                    alert("No se pudo conectar con el servidor de registro.");
                }
            }
        }
    };

    // --- 6. handleLogin MODIFICADO ---
    const handleLogin = async (e, credentials = null) => {
        e.preventDefault();
        
        let email, password;
        
        if (credentials) {
            // Viene del auto-login después de registrarse
            email = credentials.email;
            password = credentials.password;
        } else {
            // Viene del formulario de login
            email = e.target.email.value;
            password = e.target.password.value;
        }

        if (!email || !password) {
            alert("Email y contraseña son requeridos.");
            return;
        }

        try {
            // 1. Llamamos a la API de login
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: email,
                password: password
            });

            // 2. ¡PROBLEMA SOLUCIONADO!
            // response.data ahora es { token, usuario }
            const authData = response.data; 
            
            // 3. Usamos la función 'login' del Contexto
            login(authData);
            
            alert(`¡Bienvenido de nuevo, ${authData.usuario.nombre}!`);

            // 4. Redirigimos según el rol
            if (authData.usuario.role === 'ADMIN') { // <-- 7. CORRECCIÓN DE ROL
                navigate("/admin"); 
            } else {
                navigate("/"); // A la página de inicio
            }
            // 5. ELIMINAMOS window.location.reload(); 
            // El contexto se encargará de actualizar la vista.

        } catch (error) {
            console.error("Error en el login:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                alert("Correo o contraseña incorrectos.");
            } else {
                alert("No se pudo conectar con el servidor de login.");
            }
        }
    };

    // --- 8. RENDERIZADO (Cambiamos los 'value' de los roles) ---
    return (
        <div className="auth-container">
            {isLogin ? (
                <div className="form-box">
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleLogin}>
                        <input type="email" name="email" placeholder="Correo electrónico" required />
                        <input type="password" name="password" placeholder="Contraseña" required />
                        <button type="submit">Entrar</button>
                    </form>
                    <div className="toggle-form">
                        ¿No tienes cuenta?{' '}
                        <button type="button" className="link-button" onClick={() => setIsLogin(false)}>
                            Regístrate aquí
                        </button>
                    </div>
                </div>
            ) : (
                <div className="form-box">
                    <h2>Registro</h2>
                    <form onSubmit={handleRegister} noValidate>
                        {/* ... (inputs de run, nombre, apellidos, email, password, fechaNac, referralCode sin cambios) ... */}
                        <input type="text" id="run" placeholder="RUN" value={formData.run} onChange={handleInputChange} />
                        {errors.run && <span className="error">{errors.run}</span>}

                        <input type="text" id="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} />
                        {errors.nombre && <span className="error">{errors.nombre}</span>}
                        
                        <input type="text" id="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleInputChange} />
                        {errors.apellidos && <span className="error">{errors.apellidos}</span>}

                        <input type="email" id="email" placeholder="Correo electrónico" value={formData.email} onChange={handleInputChange} />
                        {errors.email && <span className="error">{errors.email}</span>}

                        <input type="password" id="password" placeholder="Contraseña" value={formData.password} onChange={handleInputChange} />
                        {errors.password && <span className="error">{errors.password}</span>}

                        <input type="date" id="fechaNac" value={formData.fechaNac} onChange={handleInputChange} />
                        {errors.fechaNac && <span className="error">{errors.fechaNac}</span>}
                        
                        <input 
                            type="text" 
                            id="referralCode" 
                            placeholder="Código de referido (opcional)" 
                            label="Código de referido (opcional)"
                            value={formData.referralCode} 
                            onChange={handleInputChange} 
                        />
                        
                        <select id="role" value={formData.role} onChange={handleInputChange}>
                            <option value="">Selecciona tu rol</option>
                            <option value="USER">Cliente</option> {/* <-- CORREGIDO */}
                            <option value="ADMIN">Administrador</option> {/* <-- CORREGIDO */}
                        </select>
                        {errors.role && <span className="error">{errors.role}</span>}

                        {/* ... (selects de region y comuna sin cambios) ... */}
                        <select id="region" value={formData.region} onChange={handleInputChange}>
                            <option value="">Selecciona Región</option>
                            {regionesYcomunas && Object.keys(regionesYcomunas).map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
{errors.region && <span className="error">{errors.region}</span>}

<select id="comuna" value={formData.comuna} onChange={handleInputChange} disabled={!formData.region}>
                            <option value="">Selecciona Comuna</option>
                            {comunas.map(comuna => (
                                <option key={comuna} value={comuna}>{comuna}</option>
                            ))}
                        </select>
{errors.comuna && <span className="error">{errors.comuna}</span>}

                        <button type="submit">Registrarse</button>
                    </form>
                    <div className="toggle-form">
                        ¿Ya tienes cuenta?{' '}
                        <button type="button" className="link-button" onClick={() => setIsLogin(true)}>
                            Inicia sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;