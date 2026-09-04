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
