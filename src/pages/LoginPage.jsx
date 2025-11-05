import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importamos axios
import { regionesYcomunas } from '../data/regiones';
import '../assets/css/login.css';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    // El estado del formulario sigue igual
    const [formData, setFormData] = useState({
        run: '', nombre: '', apellidos: '', email: '',
        password: '', fechaNac: '', role: 'cliente', region: '', comuna: '',
        referralCode: ''
    });
    const [errors, setErrors] = useState({});
    const [comunas, setComunas] = useState([]);

    // Este hook useEffect para las comunas sigue igual
    useEffect(() => {
        if (formData.region && regionesYcomunas && regionesYcomunas[formData.region]) {
            setComunas(regionesYcomunas[formData.region]);
        } else {
            setComunas([]);
        }
        if (formData.comuna && !comunas.includes(formData.comuna)) {
             setFormData(prev => ({ ...prev, comuna: '' }));
        }
    }, [formData.region, comunas]); // Se corrige la dependencia 'comunas'

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    // La función de validación sigue igual
    const validate = () => {
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
        
        // La fecha de nacimiento es importante para el backend (LocalDate)
        if (!formData.fechaNac) newErrors.fechaNac = "La fecha de nacimiento es obligatoria.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- handleRegister MODIFICADO ---
    const handleRegister = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                // 1. Llamamos a la API de registro de Spring Boot
                // Nota: referralCode se envía en el objeto formData
                const response = await axios.post('http://localhost:8080/api/auth/register', formData);

                // 2. Si el registro es exitoso (código 201)
                const newUser = response.data;
                alert(`¡Usuario ${newUser.nombre} registrado con éxito! Tu código de referido es: ${newUser.myReferralCode}`);
                setIsLogin(true); // Muestra el formulario de login
                setFormData({ // Resetea el formulario
                    run: '', nombre: '', apellidos: '', email: '',
                    password: '', fechaNac: '', role: 'cliente', region: '', comuna: '',
                    referralCode: '' 
                });
                setErrors({});

            } catch (error) {
                // 3. Manejamos errores de la API
                console.error("Error en el registro:", error);
                if (error.response) {
                    if (error.response.status === 409) { // 409 Conflict (Email existe)
                        setErrors(prev => ({ ...prev, email: "El correo electrónico ya está registrado." }));
                    } else if (error.response.status === 400) { // 400 Bad Request
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

    // --- handleLogin MODIFICADO ---
    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!email || !password) {
            alert("Email y contraseña son requeridos.");
            return;
        }

        try {
            // 1. Llamamos a la API de login de Spring Boot
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: email,
                password: password
            });

            // 2. Si el login es exitoso (código 200)
            const user = response.data; // El usuario viene del backend (ya sin contraseña)
            
            // 3. Guardamos el usuario devuelto por la API en localStorage
            localStorage.setItem("user", JSON.stringify(user));
            
            alert(`¡Bienvenido de nuevo, ${user.nombre}!`);

            // 4. Redirigimos según el rol
            if (user.role === 'admin') {
                navigate("/admin"); // Asumiendo que tienes una ruta /admin
            } else {
                navigate("/"); // A la página de inicio
            }
            window.location.reload(); // Recarga la página para actualizar el Header

        } catch (error) {
            // 5. Manejamos errores de login
            console.error("Error en el login:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                alert("Correo o contraseña incorrectos.");
            } else {
                alert("No se pudo conectar con el servidor de login.");
            }
        }
    };

    // --- RENDERIZADO (sin cambios) ---
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
                            value={formData.referralCode} 
                            onChange={handleInputChange} 
                        />

                        <select id="role" value={formData.role} onChange={handleInputChange}>
                            <option value="">Selecciona tu rol</option>
                            <option value="cliente">Cliente</option>
                            <option value="admin">Administrador</option>
                        </select>
                        {errors.role && <span className="error">{errors.role}</span>}

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