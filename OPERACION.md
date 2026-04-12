# 📂 MANUAL DE OPERACIÓN: AURNEM DYNAMIS

Este documento es tu guía definitiva para mantener el control total sobre la infraestructura de **Aurnem Dynamis** sin mi intervención.

---

## 🚀 1. CÓMO ARRANCAR EL SISTEMA TÚ SOLO

Para que la IA funcione, el **Frontend** (lo que ves) y el **Backend** (el cerebro que guarda la API Key) deben estar encendidos al mismo tiempo.

He creado un acceso directo para que solo necesites **UNA terminal**:

1. Abre tu terminal (PowerShell, CMD o la terminal de tu editor).
2. Asegúrate de estar dentro de la carpeta `aurnem-dynamics`.
3. Ejecuta el comando maestro:
```bash
npm run start-full
```

### ¿Qué hace este comando?
- Lanza el **Core Backend** (Puerto 3002) inyectando tu API Key de forma segura.
- Lanza la **Interfaz Vite** (Puerto 3001) conectándola automáticamente al cerebro.

---

## 🔍 2. ¿POR QUÉ ANTES NO TE FUNCIONABA? (DIAGNÓSTICO)

Si intentabas abrir el código directamente o solo corrías la interfaz de Vite, la IA fallaba por tres razones estructurales que ya arreglé:

1. **Falta del Cerebro**: Vite por sí solo no puede hablar con Google porque no tiene permiso para leer tu archivo `.env` (por seguridad). Necesitaba el archivo `server.js` activo.
2. **Modelo Erróneo**: Tu API Key solo tiene acceso a los modelos de la serie **Gemini 3.0 Preview**. El código original buscaba el modelo 1.5, el cual te devolvía un error 404.
3. **Puertos "Zombie"**: Tenías procesos antiguos colgados en los mismos puertos. He limpiado tu entorno para que el puerto 3001 y 3002 estén libres para Aurnem.

---

## 🌐 3. ¿FUNCIONARÁ SI LO SUBES A INTERNET?

**SÍ, pero con condiciones.**

### Si lo subes a un Hosting Estático (como Vercel o Netlify estándar):
- **NO funcionará la IA por defecto.** Estos servicios solo "muestran" el frontend. Necesitan un servidor real operando el `server.js` 24/7.

### Cómo hacerlo funcionar en la nube:

1. **Host con Soporte de Servidor**: Te recomiendo servicios como **Render**, **Railway** o **Google Cloud Run**.
2. **Variables de Entorno**: En el panel de control de tu hosting (Vercel, Render, etc.), deberás ir a la sección "Environment Variables" y añadir manualmente:
   - `GEMINI_API_KEY`: Tu clave de Google.
3. **Seguridad Total**: Nunca subas el archivo `.env` a GitHub. Está en el `.gitignore` precisamente para que tu clave nunca se haga pública.

---

## 🛡️ 4. ARCHIVOS CRÍTICOS QUE NO DEBES BORRAR
- `server.js`: El guardaespaldas de tu API Key y personalidad de la IA.
- `start.js`: Tu simplificador de arranque.
- `.env`: Donde reside el poder de tu clave.

> [!TIP]
> Si alguna vez la IA deja de responder, verifica en la terminal que el mensaje `[Aurnem Dynamics] Núcleo operativo seguro en el puerto 3002` esté visible.
