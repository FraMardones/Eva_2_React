# Level Up - Web Application 🎮

Aplicación web de comercio electrónico desarrollada en **React 19**, diseñada para la venta de productos gamer. El sistema cuenta con una interfaz pública para clientes y un panel de administración protegido para la gestión de contenido.

## 1. Integrantes del Proyecto
* **Samuel Mansilla**
* **Francisco Mardones**



## 2. Funcionalidades Principales

El proyecto está dividido en dos grandes módulos gestionados por un sistema de enrutamiento y layouts dedicados:

### 🛍️ Cliente (Tienda Pública)
* **Catálogo de Productos:** Visualización de productos con filtrado y detalles específicos.
* **Carrito de Compras:** Gestión de estado global mediante `CartContext` para agregar productos y proceder a la compra.
* **Blog y Contenidos:** Sección de noticias y detalles de artículos (Blogs).
* **Autenticación:** Inicio de sesión para usuarios y administradores.
* **Información Institucional:** Páginas de "Nosotros" y "Contacto".

### 🛠️ Administrador (Backoffice)
Acceso restringido a la ruta `/admin` que permite:
* **Gestión de Productos:** Listar y administrar el inventario (`/admin/productos`).
* **Gestión de Usuarios:** Control de usuarios registrados en la plataforma (`/admin/usuarios`).
* **Dashboard:** Panel principal de administración.



## 3. Arquitectura y Stack Tecnológico

Basado en la configuración del proyecto:

* **Frontend:** React 19, React DOM, React Router Dom (v7).
* **Estilos:** Bootstrap 5, React Bootstrap, CSS Modules y TailwindCSS.
* **Conectividad:** Axios con interceptores para manejo de tokens JWT.
* **Testing:** Jest y Karma.

### Conexión con Backend
La aplicación consume una API REST alojada en Render.
* **Base URL:** `https://spring-boot-mwnq.onrender.com`
* **Seguridad:** Se implementa un interceptor en Axios que inyecta automáticamente el token (`Authorization: Bearer ...`) desde el LocalStorage en cada petición protegida.



## 4. Estructura de Navegación

La aplicación utiliza `react-router-dom` para gestionar las rutas:

| Ruta | Descripción | Layout |
| :--- | :--- | :--- |
| `/` | Página de Inicio | Public |
| `/productos` | Catálogo completo | Public |
| `/producto/:code` | Detalle de un producto | Public |
| `/carrito` | Carrito de compras | Public |
| `/login` | Inicio de sesión | Public |
| `/admin` | Home del Dashboard | Admin |
| `/admin/productos` | ABM de Productos | Admin |
| `/admin/usuarios` | Gestión de Usuarios | Admin |


## 5. Pasos para ejecutar el proyecto

Para levantar el entorno de desarrollo localmente:

1.  **Instalar dependencias:**
    Asegúrate de tener Node.js instalado y ejecuta:
    ```bash
    npm install
    ```

2.  **Ejecutar el servidor de desarrollo:**
    Este comando iniciará la aplicación en `http://localhost:3000` (o el puerto disponible):
    ```bash
    npm start
    ```

3.  **Construir para producción (Build):**
    Para generar la carpeta `build` optimizada para despliegue:
    ```bash
    npm run build
    ```

