> Actualización 26/11/2026: este documento conserva la revisión inicial. El estado integrado y las pruebas vigentes están en [ENTREGA.md](ENTREGA.md).

# Revisión e integración de administración

## Base verificada

Frontend: feature/react-tienda, commit e34b6e3a7debc93bcea3a87146e002b76b9d285d. El commit existe en GitHub y era la punta remota. Fetch confirmó 0 commits de diferencia. El árbol estaba limpio; no había cambios staged. Aplicación activa: front-react (README, package.json, App.jsx y main.jsx). No se editó la copia histórica user-front-react.

Backend confirmado por la usuaria: Quiti-1556/online-library-microservices, base 0c28557. Se creó la rama local feature/react-tienda desde esa base; se conservó el cambio previo de .idea/workspace.xml. No se editó la copia proyecto-fullstack2 de VBUSTOSF, que tenía cambios propios.

## Diagnóstico previo y resultado

| Función | Evidencia inicial | Trabajo realizado |
|---|---|---|
| Panel, menú y navegación | App.jsx y AdminLayout.jsx ya montaban /admin | Pruebas con JWT, navegación activa, expiración, cierre y otra pestaña |
| Resumen | AdminDashboard contaba adminData y usuarios locales | Consultas reales /books y /auth/users, fallos independientes y reintento |
| Usuarios | Formularios CRUD sobre LocalStorage | CRUD HTTP y roles reales respaldados por controladores/servicios nuevos dentro de Auth |
| Identidad de usuarios | /users devolvía ID de perfil; DELETE /auth/users esperaba ID de cuenta | Todas las operaciones administrativas usan Auth; sincronización del perfil por correo |
| Productos | e34b6e3 ya implementaba solicitudes /books mediante api.js | Detalle administrativo, validación del contrato, precio decimal, mensajes de éxito y pruebas |
| Stock | Listado HTTP con umbral 5 y resumen local | Fuente común /books y umbral inclusivo 5; indicador textual accesible |
| Sesión | JWT local con vencimiento; 401 no notificaba al panel | Evento inmediato, validación de identidad, protección ante respuesta 401 antigua |
| Permisos | Gateway solo restringía ciertas escrituras; servicios expuestos por puertos | Roles vigentes consultados en Auth, protección de Auth con Spring Security, servicios administrativos privados en Docker |
| Errores | Mensajes genéricos, JSON no controlado, espera indefinida | Errores de validación/negocio, tiempo límite, reintentos y conservación de formularios |
| Pruebas | 13 fallidas / 46; muchas esperaban simulación | Suite actualizada; se distingue HTTP simulado en Vitest de comprobación real |
| Configuración | Clave JWT y contraseña inicial públicas; YAML mal anidado; migraciones inconsistentes | Secretos locales excluidos de Git, puertos y claves YAML corregidos, migraciones preparadas para instalación limpia |

## Requisitos y fuentes

1. **Confirmados por EP3 DSY1104**, páginas 2–4 y rúbrica 6–8: Spring Boot y BD; CRUD y Swagger; integración REST; JWT y roles; persistencia de sesión; restricciones frontend; pruebas de integración. Entregables grupales: repositorios públicos, proyectos comprimidos, manual con capturas y documento de integración. El PDF adjuntado después desde Downloads de Fluox tiene el mismo SHA-256 que el leído desde VBUSTOSF. Se usa como pauta principal de esta entrega.
2. **Confirmados en ERS de Entrega I**, RF011–RF014: menú administrativo, mantenedores y detalles; además campos de producto (código, categoría, descripción, imagen, stock crítico por producto) y usuario (RUN, apellidos, región/comuna, dirección, fecha) y rol Vendedor.
3. **Diferencia pendiente**: el backend actual no modela todos esos campos ni Vendedor. No se fabricaron campos, roles o servicios para aparentar cumplimiento. Se integró el modelo real ADMIN/CLIENT y title/author/price/stock. El equipo debe confirmar la continuidad de los campos de Entrega I y ampliar el modelo si siguen siendo exigibles.
4. **Reparto**: la responsabilidad administrativa está confirmada por la usuaria. No se encontró un reparto actual de los tres integrantes dentro de los repositorios; el README antiguo del backend enumera dos personas. No se reasignó trabajo de catálogo, carrito o compras.
5. **Ejemplos del profesor**: api_tienda.rar ofrece /api/products en una aplicación distinta; api_tienda_con_jwt_login_token.rar muestra un filtro JWT y login con credenciales fijas. Se usaron como explicación, no como endpoints ni credenciales del proyecto.
6. **Opcionales**: paginación, ordenar tablas, auditoría visual y mejoras estéticas. No son requisitos añadidos por esta revisión.

Fuentes locales leídas: DSY1104 Evaluación Parcial 3_EE_EP_Estudiante.pdf (Downloads de VBUSTOSF); ERS_Online_Library.docx (Desktop/Evaluacion_1_Vania_Bustos_seccion_003v); README y código actual de ambos repositorios.

## Contratos implementados

El navegador agrega /api; el Gateway recibe las rutas de esta tabla sin ese prefijo.

| Método y ruta | Datos / resultado | Acceso |
|---|---|---|
| POST /auth/login | email, password → token, email, role | Público |
| POST /auth/register | name, email, password → cuenta CLIENT y perfil | Público; no acepta asignación de rol |
| GET /auth/users | Lista de id, name, email, role; sin contraseñas | ADMIN |
| GET /auth/users/{id} | Cuenta de Auth | ADMIN |
| POST /auth/users | name, email, password, role | ADMIN |
| PUT /auth/users/{id} | name, email, role; password opcional | ADMIN |
| DELETE /auth/users/{id} | Elimina perfil por correo y después cuenta | ADMIN, salvo cuenta propia/principal |
| GET /auth/session | Identidad y rol actuales de BD | JWT válido, usado internamente por Gateway |
| GET /books y /books/{id} | title, author, price, stock, id | Usuario autenticado |
| POST /books, PUT/DELETE /books/{id} | CRUD de libros | ADMIN |
| GET /users | Perfiles, con IDs independientes de Auth | ADMIN por Gateway |
| PUT /users/email/{email} | name, email; conserva teléfono/dirección | Sincronización interna Auth → perfiles |

Las rutas administrativas que faltaban se implementaron en el backend antes de conectarlas desde React. No deben usarse con el backend anterior sin desplegar los cambios correspondientes.

## Seguridad y persistencia

El navegador decodifica JWT para presentar la interfaz; no verifica su firma. Gateway verifica firma, expiración y rol conocido y consulta /auth/session para comprobar la cuenta vigente. Quitar ADMIN o eliminar una cuenta invalida sus permisos aunque el token anterior no haya vencido. Ante caída de Auth, Gateway deniega la operación con 503.

Auth protege /auth/users con Spring Security, incluso sin Gateway. Los roles se toman de la BD, no de parámetros del cliente. Las contraseñas se cifran con el PasswordEncoder existente. La edición con contraseña vacía la omite; no reenvía el hash. La cuenta propia no se puede eliminar ni cambiar su rol/correo; la cuenta principal conserva correo y rol.

Los servicios auth, book, user e inventory ya no publican puertos directamente en docker-compose.yml. Deben permanecer en la red interna. La autenticación centralizada depende de ese aislamiento; no se debe publicar un microservicio sin protección adicional.

JWT_SECRET procede del entorno y debe ser común a Auth y Gateway. La clave pública anterior se rotó solo en el .env local; no se publica. ADMIN_INITIAL_PASSWORD configura la cuenta principal al crear una BD vacía. No cambia contraseñas de bases existentes. El respaldo del .env anterior se conserva fuera de los entregables. Al usar la clave nueva, los tokens de la clave vieja dejan de funcionar. .env estaba versionado pese al ignore: se retiró del seguimiento conservando el archivo local y se añadió .env.example sin secretos.

No se añadió refresh token: al vencer se inicia sesión nuevamente, validando credenciales antes de emitir un nuevo JWT. Esta es la renovación mediante reautenticación; no hay renovación automática silenciosa. LocalStorage conserva JWT según la arquitectura existente; requiere HTTPS y prevención de XSS en un despliegue real. Cerrar sesión borra el token del navegador, pero no revoca copias del token ya emitido; expiran según su duración.

El servidor devuelve 401 ante credenciales incorrectas, 409 ante correo duplicado y 400 ante datos inválidos. Se valida también el límite de 72 bytes UTF-8 de BCrypt, incluyendo contraseñas con tildes; los errores internos no se envían al navegador.

## Ejecución reproducible

El backend incluye docker-compose.admin.yml para una base independiente y los cinco servicios necesarios. Consultar ADMINISTRACION.md del backend. El proxy de Vite admite GATEWAY_URL; el valor por defecto sigue siendo http://localhost:8080. En la comprobación aislada se usa http://127.0.0.1:18080.

Spring Boot 4 requiere el módulo de auto-configuración de Flyway; se añadió spring-boot-starter-flyway y se validó el arranque con la base nueva. Swagger se actualizó a Springdoc 3.0.3, compatible con Boot 4.0.x según la [matriz oficial](https://springdoc.org/). La documentación JSON de los servicios se consulta internamente sin publicar puertos adicionales.

## Límites que no se deben ocultar

- Stock mostrado y editado: book-service. inventory-service mantiene otra tabla y no hay sincronización garantizada con ella; no se implementó una escritura doble desde React.
- Stock crítico por libro y campos históricos de ERS: pendientes de modelo persistente y acuerdo del equipo.
- La actualización de cuenta/perfil usa una transacción local de Auth y llamada HTTP a perfiles; no es una transacción distribuida. Un fallo remoto no se anuncia como éxito. Una caída posterior al commit remoto y anterior al commit local puede exigir reconciliación.
- En la prueba inicial un timeout dejó un perfil sin cuenta. Se limpió únicamente ese dato de prueba y se cambió el alta a PUT de identidad: un reintento reutiliza el perfil sin duplicarlo ni borrar teléfono/dirección. Esto no convierte las dos bases en una transacción distribuida.
- Las migraciones V1 de Auth y V2 de perfiles fueron corregidas para **instalación limpia**, confirmada por la usuaria. No aplicar estos cambios sobre un historial Flyway anterior sin una estrategia de migración.
- Manual académico con capturas de todos los flujos y despliegue compartido del equipo: deben completarse con la versión que acuerden entregar.

## Guardar y subir

Revisar primero git status y git diff en cada repositorio. Mantener feature/react-tienda. En frontend, agregar archivos de front-react y documentación revisada, incluida docs/guia-codigo-administracion.html. En backend, agregar solo src, los pom.xml/Dockerfile modificados, configuración y documentación; excluir .idea/workspace.xml, .env y target. Hacer un commit por repositorio y push normal. La primera publicación del backend requiere git push -u origin feature/react-tienda. La publicación de esta revisión fue solicitada por la usuaria; no incluye merge a main ni push forzado. Los resultados y limitaciones de las pruebas están en front-react/TESTING.md.
