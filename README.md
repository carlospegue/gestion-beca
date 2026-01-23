# Gestión Beca - Aplicación Web

Sistema de gestión de residencias estudiantiles conectado a PocketBase.

## 📋 Requisitos

- **PocketBase**: Servidor ejecutándose en `http://localhost:8090`
- **Navegador moderno**: Chrome, Firefox, Safari o Edge
- **Conexión a Internet**: Para cargar recursos de CDN (Tailwind CSS)

## 🚀 Cómo Usar

### 1. Iniciar PocketBase

Asegúrate de que PocketBase está corriendo en tu máquina:

```bash
./pocketbase serve
```

El servidor se ejecutará en `http://localhost:8090`

### 2. Abrir la Aplicación

1. Abre `index.html` en tu navegador
2. Serás redirigido automáticamente a `login.html`
3. Ingresa tus credenciales de PocketBase

**Credenciales de ejemplo:**
- Email: `admin@example.com`
- Contraseña: `1234`

(Asegúrate de crear un usuario en PocketBase con estas credenciales)

### 3. Navegar por la Aplicación

Una vez autenticado, podrás:

- **Dashboard**: Ver estadísticas rápidas del sistema
- **Carreras**: Gestionar carreras académicas
- **Estudiantes**: Registrar y administrar estudiantes
- **Cuartos**: Gestionar cuartos de la residencia
- **Edificios**: Administrar edificios/bloques
- **Cuartelerías**: Registrar salidas de estudiantes
- **Evaluaciones**: Registrar evaluaciones académicas
- **Medios Básicos**: Gestionar inventario de recursos
- **Sanciones**: Registrar sanciones disciplinarias

## 📁 Estructura de Archivos

```
Gestion Beca/
├── index.html              # Página principal (SPA shell)
├── login.html              # Página de autenticación
├── app.js                  # Lógica de la aplicación (2000+ líneas)
├── pocketbase-api.js       # Wrapper de API para PocketBase
└── README.md              # Este archivo
```

## 🔌 Conexión con PocketBase

### Configuración de PocketBase

1. Asegúrate de que PocketBase tiene las siguientes colecciones:
   - `carreras`
   - `estudiantes`
   - `cuartos`
   - `plantas`
   - `edificios`
   - `cuartelerias`
   - `evaluacions` (nota la 's' al final)
   - `mediosbasicos`
   - `sancion_disciplinarias`

2. Crea un usuario en la colección `users`:
   - Email: `admin@example.com`
   - Contraseña: `1234`

### API Endpoint

La aplicación conecta a PocketBase en: `http://localhost:8090`

Para cambiar el servidor, edita `pocketbase-api.js`:

```javascript
const PB_URL = 'http://localhost:8090'; // Cambiar aquí
```

## 🛠️ Características

### Autenticación
- Login con email/contraseña
- Tokens JWT almacenados en localStorage
- Sesión persistente entre recargas

### CRUD Completo
- **Crear**: Botón "Nuevo..." en cada sección
- **Leer**: Tablas dinámicas que cargan datos del servidor
- **Actualizar**: Botón "Editar" para modificar registros
- **Eliminar**: Botón "Eliminar" con confirmación

### Relaciones
- Los estudiantes se relacionan con carreras y cuartos
- Las cuartelerías se relacionan con estudiantes
- Los medios básicos se relacionan con cuartos

### Notificaciones
- Mensajes de éxito en verde
- Mensajes de error en rojo
- Se desaparecen automáticamente después de 3 segundos

## 🔐 Seguridad

- Los tokens de autenticación se almacenan en localStorage
- Los tokens se envían en cada solicitud de API
- La sesión se verifica al cargar la aplicación
- Logout limpia el almacenamiento local

## 🚨 Solución de Problemas

### "No puedo conectar a PocketBase"

1. Verifica que PocketBase está corriendo:
   ```bash
   curl http://localhost:8090/_/
   ```

2. Si recibe error 404, el servidor no está corriendo
3. Inicia PocketBase e intenta nuevamente

### "Error de autenticación"

1. Verifica que el usuario existe en PocketBase
2. Verifica que la contraseña es correcta
3. Revisa la consola del navegador (F12) para más detalles

### "Datos no se cargan"

1. Abre la consola del navegador (F12)
2. Revisa los errores en la sección "Console"
3. Asegúrate de que las colecciones existen en PocketBase
4. Verifica que tienes permisos para leer las colecciones

### "Editar/Crear no funciona"

1. Verifica que iniciaste sesión correctamente
2. Revisa que el formulario esté completo
3. Verifica en la consola los errores de API

## 📝 Notas

- La aplicación es una SPA (Single Page Application)
- No requiere servidor web, funciona localmente
- Los datos se sincronizan en tiempo real con PocketBase
- Las relaciones entre tablas funcionan automáticamente

## 🔄 Sincronización de Datos

Los datos se cargan al iniciar la aplicación y se actualizan cuando:
- Creas un nuevo registro
- Editas un registro existente
- Eliminas un registro
- Cambias de vista

## 📞 Soporte

Si tienes problemas:

1. Verifica la consola del navegador (F12)
2. Revisa que PocketBase está corriendo
3. Intenta hacer logout y login nuevamente
4. Limpia el cache del navegador
5. Intenta en modo incógnito/privado

---

**Versión**: 1.0  
**Última actualización**: 2026  
**Estado**: Conectado a PocketBase ✅
