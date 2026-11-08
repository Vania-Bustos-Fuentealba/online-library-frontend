# Pruebas unitarias

El proyecto usa Vitest con `jsdom` y React Testing Library para probar funciones y componentes React.

## Comandos

- `npm run test:run`: ejecuta las pruebas una vez.
- `npm run test`: inicia Vitest en modo interactivo.
- `npm run coverage`: ejecuta las pruebas y genera cobertura en `coverage/`.

## Casos cubiertos

- Catálogo de administración: listado inicial, búsqueda, eliminación y cancelación de eliminación.
- Formulario de productos: campos obligatorios, creación, persistencia y rechazo de códigos duplicados.
- Gestión de usuarios: listado sin mostrar contraseñas, eliminación y cancelación.
- Formulario de usuarios: creación, edición, datos duplicados e identificador inexistente.
- Acceso administrativo: redirección cuando no hay una sesión de administrador y cierre de sesión.
- Datos compartidos de usuarios: alta, actualización, eliminación, autenticación y sesión.
- Validación de RUN y correo electrónico.

## Última medición

Al ejecutar `npm run coverage`:

- Sentencias: 91,91%
- Ramas: 81,94%
- Funciones: 93,33%
- Líneas: 92,21%

La cobertura configurada incluye los componentes de administración, el módulo compartido de usuarios y las validaciones.
