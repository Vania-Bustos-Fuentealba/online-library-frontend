> Actualización 26/11/2026: 99 pruebas aprobadas; resultados vigentes en [resultados de entrega](../docs/entrega/resultados-pruebas.txt). Los recuentos siguientes pertenecen a la revisión anterior.

# Pruebas de administración

## Frontend

Ejecutar desde front-react:

```powershell
npm run test:run
npm run coverage
npm run lint
npm run build
```

Resultado de esta revisión: 82 pruebas aprobadas en 15 archivos. Cobertura de las fuentes incluidas: 95,02 % de líneas; administración: 95,14 % de líneas y 80,70 % de ramas. La configuración incluye ahora administración, cliente HTTP y sesión; estos componentes estaban excluidos del informe anterior. No es cobertura de toda la aplicación.

Vitest reemplaza fetch únicamente en las pruebas. Comprueba cuerpos y rutas reales, carga, errores, reintentos, validaciones, roles, expiración, cierre, 401/403, CRUD y doble envío. Los fixtures no son fuentes de datos de la aplicación ni sustituyen una prueba con Spring y MySQL.

## Integración real

`scripts/admin-integration.mjs` requiere BASE_URL, ADMIN_EMAIL y ADMIN_PASSWORD en el entorno. Usar una base de pruebas, porque crea y elimina sus propias cuentas y libros. No imprime tokens ni contraseñas. BASE_URL puede apuntar al Gateway o al proxy de Vite terminado en /api.

```powershell
$env:BASE_URL = 'http://127.0.0.1:18080'
$env:ADMIN_EMAIL = 'admin@library.cl'
# Configurar ADMIN_PASSWORD en el entorno local, sin guardarla en Git.
node scripts/admin-integration.mjs
```

El script comprueba CRUD, sincronización de perfil, diferencia de identidad Auth/perfil, restricciones CLIENT, revocación de ADMIN con token antiguo, protección de la cuenta propia y ausencia de contraseñas en respuestas.

Resultado real del 23-11-2026: 42 respuestas del recorrido principal aprobadas, más limpieza de datos de prueba, atravesando Vite :5177/api → Gateway :18080 → Auth/perfiles/libros → MySQL 8.4. Incluye creación con perfil preexistente para comprobar el reintento tras una creación parcial, cambio de contraseña, correo duplicado, rol inválido y límite UTF-8 de BCrypt. Las migraciones arrancaron sobre una base independiente nueva. Los datos de prueba se retiraron; queda la cuenta inicial.

Swagger/OpenAPI: /v3/api-docs y /swagger-ui/index.html respondieron correctamente dentro de los contenedores Auth, Book y User. No se publicó un puerto directo de esos servicios.

## Backend

Desde cada módulo de Quiti-1556/online-library-microservices, con Java 17 o superior:

Para reproducir desde cero, anteponer clean a test/verify; así no se reutilizan los binarios target que el repositorio tenía versionados.

- auth-service: `./mvnw.cmd -Dtest=UserServiceImplTest,AdminAccountServiceTest,AdminSecurityTest,PasswordRulesTest test`: 25 pruebas aprobadas.
- user-service: `./mvnw.cmd test`: 10 aprobadas; 1 prueba de contexto ya estaba deshabilitada.
- book-service: `./mvnw.cmd -Dtest=BookServiceImplTest,BookValidationTest test`: 9 aprobadas.
- api-gateway: `./mvnw.cmd -Deureka.client.enabled=false -Dspring.cloud.discovery.enabled=false verify`: 17 aprobadas y JAR compilado. Requiere JWT_SECRET de prueba en el entorno.

Las pruebas de contexto de Auth y Book que requieren una BD externa no se incluyeron en esos comandos selectivos. Los tests HTTP de seguridad usan la cadena real Spring Security, JWT firmado y repositorio controlado; la prueba Docker comprueba la persistencia real aparte.

**Verificación adicional que todavía falla:** se ejecutó también la fase Maven verify de Auth, Book y User con esas mismas suites. Las pruebas funcionales pasan, pero JaCoCo exige 80 % de líneas en cada clase y falla en controladores, manejadores, configuración y clases de arranque. No se rebajó el umbral ni se excluyeron clases para aparentar cumplimiento. Las pruebas HTTP contra Docker no están instrumentadas en ese informe. Falta integrar esa cobertura y completar las pruebas de ramas pendientes antes de afirmar que verify pasa en los tres módulos. Gateway verify sí pasa.

Se actualizó JaCoCo de 0.8.12 a 0.8.14 en los módulos revisados porque el informe fallaba con la dependencia Doxia al ejecutar el wrapper disponible. Los comandos posteriores terminaron correctamente. Referencia de versión: https://www.jacoco.org/jacoco/trunk/doc/changes.html
