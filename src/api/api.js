import axios from 'axios';

// 1. Esta es tu URL de Render
const API_BASE_URL = 'https://spring-boot-mwnq.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL
});

// 2. Esto "intercepta" cada petición y le añade el token
//    así no tienes que hacerlo manualmente en cada página.
api.interceptors.request.use(
  (config) => {
    // Obtenemos el token guardado en localStorage
    const token = localStorage.getItem('token');
    
    // Si el token existe, lo añadimos a la cabecera 'Authorization'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Manejamos errores en la petición
    return Promise.reject(error);
  }
);

export default api;