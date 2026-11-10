# Tienda de libros online (React)

Frontend de la tienda online de libros, desarrollado con React para la Evaluación Parcial 2 de Desarrollo Fullstack II. Reemplaza las páginas HTML de la entrega anterior por componentes React reutilizables.

## Tecnologías

- React 19 y React Router
- Vite
- Bootstrap 5 (diseño responsivo)
- Context API y hooks para el estado del carrito
- LocalStorage como persistencia simulada
- Vitest, jsdom y React Testing Library (pruebas unitarias)

## Instalación y ejecución

```bash
npm install
npm run dev
```

Otros comandos:

- `npm run build`: genera la versión de producción.
- `npm run lint`: revisa el código con Oxlint.
- `npm run test:run`: ejecuta las pruebas una vez.
- `npm run coverage`: ejecuta las pruebas con informe de cobertura.

## Vistas

**Tienda:** inicio (`/`), catálogo (`/productos`), detalle de libro (`/productos/:id`), carrito (`/carrito`) y checkout (`/checkout`).

**Sitio:** nosotros, blog, detalle de blog, login, registro y contacto.

**Administración (`/admin`):** resumen, gestión de productos y gestión de usuarios (alta, edición, búsqueda y eliminación). Para entrar, inicia sesión con la cuenta semilla `admin@duoc.cl` y contraseña `admin`.

## Carrito y compra

- El carrito se comparte en toda la aplicación con `CarritoProvider` y el hook `useCarrito`, y se guarda en LocalStorage.
- Cupones disponibles: `DUOC10` (10%) y `LIBROS5` (5%).
- Envío de $3.990, gratis en compras desde $30.000 (calculado después del descuento).
- El checkout valida nombre, correo (@duoc.cl, @profesor.duoc.cl o @gmail.com), dirección, comuna y método de pago.

## Estructura de `src`

```text
src/
├── admin/        Panel administrativo y sus pruebas
├── components/   Componentes reutilizables (TarjetaLibro, FichaLibro, ItemCarrito, ...)
├── context/      CarritoProvider y contexto del carrito
├── data/         Fuentes de datos simuladas (productos, usuarios, blogs, mensajes)
├── hooks/        useCarrito
├── pages/        Páginas de la aplicación y sus pruebas
├── styles/       Estilos de la tienda y del sitio
├── test/         Configuración de las pruebas
└── utils/        Funciones puras (carrito, validaciones, formato)
```

## Pruebas

El detalle de las pruebas y la cobertura está en [`TESTING.md`](TESTING.md).

> El almacenamiento local sirve para la demostración frontend. La autorización real y la persistencia compartida requieren el backend.