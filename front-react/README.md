# Online Library Frontend

Frontend desarrollado para el proyecto de **Fullstack II**, basado en la continuidad del sistema creado previamente en **Fullstack I**.

El proyecto corresponde a una biblioteca online que contempla una experiencia diferenciada para clientes y administradores. La entrega anterior se construyó con HTML, CSS, JavaScript y Bootstrap; en la Evaluación Parcial 2 se migró a **React** (carpeta `front-react`).

## Objetivo

Desarrollar la interfaz web de una tienda de libros online e integrarla posteriormente con una arquitectura backend basada en microservicios.

## Funcionalidades principales

### Vista cliente

- Página principal
- Registro de usuario
- Inicio de sesión
- Catálogo de productos
- Detalle de productos
- Carrito de compras con cupones
- Checkout con validación de datos de despacho
- Página Nosotros
- Blog
- Detalle de publicaciones
- Formulario de contacto

### Vista administrador

- Dashboard administrativo
- Gestión de productos
- Creación y edición de productos
- Gestión de usuarios
- Creación y edición de usuarios

## Aplicación React

La aplicación React se ejecuta desde `front-react`. Entra a esa carpeta, instala las dependencias con `npm install` y ejecuta `npm run dev`.

El panel administrativo está disponible en `/admin` después de iniciar sesión con una cuenta de rol administrador (cuenta semilla `admin@duoc.cl`, contraseña `admin`). Los productos y el carrito se guardan en LocalStorage; la gestión de usuarios reutiliza el almacenamiento y las validaciones de registro.

> El almacenamiento local sirve para la demostración frontend. La autorización real de administradores y la persistencia compartida requieren el backend.

Más detalles en [`front-react/README.md`](front-react/README.md). Las pruebas unitarias y el resumen de cobertura están en [`front-react/TESTING.md`](front-react/TESTING.md).

## Tecnologías utilizadas

- React y React Router
- Vite
- Bootstrap
- JavaScript
- LocalStorage
- Vitest y React Testing Library
- HTML5 y CSS3 (versión inicial)
- Git y GitHub

## Integración con backend

El frontend está diseñado para comunicarse con el backend mediante un API Gateway.

La arquitectura backend contempla microservicios como:

- `auth-service`
- `user-service`
- `book-service`
- `inventory-service`
- `cart-service`
- `order-service`
- `payment-service`
- `review-service`
- `recommendation-service`
- `notification-service`
- `blog-service`
- `contact-service`

La comunicación general del sistema sigue la estructura:

Frontend → API Gateway → Microservicios

## Estructura del repositorio

```text
online-library-frontend/
├── front-react/   Aplicación React (versión actual)
├── pages/         Plantilla HTML inicial
├── assets/        Recursos de la plantilla HTML
├── css/           Estilos de la plantilla HTML
└── js/            Scripts de la plantilla HTML
```