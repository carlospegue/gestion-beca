# Desplegar en Railway

Sigue estos pasos para desplegar tu aplicación en Railway.

## 1. Preparar el proyecto

Tu proyecto ya está listo. Los archivos necesarios están creados:
- `package.json` - Configuración del proyecto
- `Procfile` - Comando para ejecutar en Railway
- `.gitignore` - Archivos a ignorar en Git

## 2. Crear un repositorio en GitHub

### Opción A: Desde GitHub Web
1. Ve a [github.com](https://github.com) y crea un nuevo repositorio
2. Dale el nombre `gestion-beca`
3. No inicialices con README (ya lo tienes)

### Opción B: Desde PowerShell (en tu carpeta del proyecto)

```powershell
# Inicializar Git
git init

# Agregar los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Sistema de Gestión de Residencia"

# Agregar repositorio remoto (reemplaza usuario y repo)
git remote add origin https://github.com/TU_USUARIO/gestion-beca.git

# Cambiar rama a main
git branch -M main

# Subir archivos
git push -u origin main
```

## 3. Conectar con Railway

1. **Ve a [railway.app](https://railway.app)** y crea una cuenta (con GitHub es más fácil)

2. **Crea un nuevo proyecto:**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Autoriza Railway a acceder a tu GitHub
   - Selecciona el repositorio `gestion-beca`

3. **Configura variables de entorno (opcional):**
   - Railway detectará automáticamente que es un proyecto Node.js
   - Los puertos se configuran automáticamente

4. **Espera el despliegue:**
   - Railway compilará automáticamente
   - Verás el estado en la consola

## 4. Obtener tu URL

Una vez desplegado:
1. Ve a tu proyecto en Railway
2. En la pestaña "Deployments", encontrarás tu URL pública
3. Será algo como: `https://gestion-beca-production.up.railway.app`

## 5. Actualizar la URL en tu navegador

Simplemente accede a esa URL. La aplicación detectará automáticamente que está en producción y usará esa URL para la API de PocketBase.

## 🔗 URLs finales

- **Frontend + API**: `https://tu-proyecto.up.railway.app`
- **Login**: `https://tu-proyecto.up.railway.app/login.html`
- **PocketBase Admin**: `https://tu-proyecto.up.railway.app/_/` (el dashboard de PocketBase)

## ⚠️ Notas importantes

1. **Base de datos persistente**: Railway guarda automáticamente los datos de PocketBase
2. **Reinicio automático**: Si el servidor se detiene, Railway lo reinicia
3. **Dominio personalizado**: Puedes agregar tu dominio propio en las opciones de Railway
4. **HTTPS**: Railway proporciona HTTPS automáticamente (certificados SSL gratis)

## 📝 Solución de problemas

### Si ves error 502 Bad Gateway
- Espera 2-3 minutos a que se despliegue completamente
- Revisa los logs en Railway (pestaña "Logs")

### Si los datos no se guardan
- Asegúrate de que la base de datos de PocketBase está en el servidor
- Revisa los logs para errores de conexión

### Si no puedes hacer login
- Verifica que tienes usuarios creados en PocketBase en Railway
- Puedes acceder al panel de administración en `/_/`

---

¡Una vez desplegado, tu aplicación estará disponible en internet las 24/7! 🚀
