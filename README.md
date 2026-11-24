# Online Library Frontend

Aplicación vigente: **front-react**, React + Vite. Las carpetas pages, js y assets conservan la entrega HTML anterior. user-front-react no es la aplicación de esta rama.

## Ejecutar

```powershell
cd front-react
npm ci
npm run dev
```

El frontend solicita `/api`; Vite elimina ese prefijo y envía la petición al Gateway. Por defecto usa http://localhost:8080. Si ese puerto está ocupado:

```powershell
$env:GATEWAY_URL = 'http://127.0.0.1:18080'
npm run dev
```

La versión de producción requiere un proxy del servidor web de `/api/*` al Gateway y fallback de rutas a index.html. El proxy de Vite solo corresponde a desarrollo/preview; no se incorpora en dist.

## Administración y autenticación

- /admin: resumen de cuentas, libros y stock bajo desde API.
- /admin/usuarios: listado, búsqueda, detalle, alta, edición, roles ADMIN/CLIENT y eliminación.
- /admin/productos: listado, búsqueda, detalle y CRUD de libros con precio y existencias.
- /login: autenticación con JWT; persistencia de sesión, expiración y cierre.
- Los datos de administración ya no se guardan en LocalStorage. Solo persisten token y metadatos de sesión; el carrito y otras áreas fuera de este alcance conservan su implementación.
- No hay login simulado ni cuenta local admin@duoc.cl. La cuenta inicial del backend es admin@library.cl; su contraseña nueva procede de ADMIN_INITIAL_PASSWORD, nunca del código.
- El frontend requiere los cambios de backend de esta revisión: las operaciones de cuentas se implementaron en /auth/users. No se deben confundir esos IDs con los perfiles de /users.

Backend confirmado: https://github.com/Quiti-1556/online-library-microservices

Lee [ADMINISTRACION.md](ADMINISTRACION.md) para contratos, limitaciones y pauta. Pruebas: [front-react/TESTING.md](front-react/TESTING.md).

Para estudiar la implementación, abre la [guía del código administrativo](docs/guia-codigo-administracion.html): incluye 35 archivos con líneas numeradas, notas de lectura y explicación de su propósito. Descarga el HTML y ábrelo en el navegador para ver su formato.
