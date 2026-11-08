# Online Library Frontend

Frontend desarrollado para el proyecto de **Fullstack II**, basado en la continuidad del sistema creado previamente en **Fullstack I**.

El proyecto corresponde a una biblioteca online que contempla una experiencia diferenciada para clientes y administradores, utilizando HTML, CSS, JavaScript y Bootstrap para la construcción de las distintas vistas.

## Objetivo

Desarrollar la interfaz web de una tienda de libros online e integrarla posteriormente con una arquitectura backend basada en microservicios.

## Funcionalidades principales

### Vista cliente

- Página principal
- Registro de usuario
- Inicio de sesión
- Catálogo de productos
- Detalle de productos
- Carrito de compras
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
- Consulta de detalles

### Panel administrativo en React

La aplicación React se ejecuta desde `user-front-react`. El panel está disponible en `/admin` después de iniciar sesión con una cuenta de rol administrador. Incluye resumen, búsqueda de productos y usuarios, alta, edición y eliminación. Los productos se guardan en LocalStorage; la gestión de usuarios reutiliza el almacenamiento y las validaciones de registro de la aplicación.

> El almacenamiento local sirve para la demostración frontend. La autorización real de administradores y la persistencia compartida requieren el backend.

Para iniciar la aplicación React, entra a `user-front-react`, instala las dependencias con `npm install` y ejecuta `npm run dev`. Inicia sesión con la cuenta semilla `admin@duoc.cl` y contraseña `admin` para abrir el panel.

Las pruebas unitarias y el resumen de cobertura están documentados en [`user-front-react/TESTING.md`](user-front-react/TESTING.md).

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap
- LocalStorage
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

## Estructura inicial

```text
online-library-frontend/
├── index.html
├── pages/
├── assets/
├── css/
└── js/
