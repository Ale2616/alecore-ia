# AleCore.IA - Chat con IA potenciado por NVIDIA

Una aplicación de chat moderna y profesional con integración a la API de NVIDIA, construida con React, JavaScript y Tailwind CSS.

## Características

- **Diseño moderno en modo oscuro** - Interfaz limpia y profesional
- **Selector de modelos NVIDIA** - Cambia entre diferentes modelos en tiempo real
- **Dictado por voz** - Usa la Web Speech API para entrada de voz
- **Adjuntar archivos** - Soporte para imágenes (jpg, png) y PDFs
- **Previsualización de archivos** - Miniaturas antes de enviar
- **Text-to-Speech** - Lee las respuestas en voz alta
- **Historial de chat** - Copia y exportación de conversaciones
- **System Prompt personalizado** - Configura la personalidad de tu IA

## Requisitos previos

- Node.js 18+ instalado
- API Key de NVIDIA (obtenla en https://build.nvidia.com/)

## Instalación

### 1. Instalar dependencias

```bash
cd ai-chat-app
npm install
```

### 2. Configurar tu API Key

Abre el archivo `src/App.jsx` y busca la línea:

```javascript
const NVIDIA_API_KEY = 'TU_API_KEY_AQUI';
```

Reemplázala con tu clave real:

```javascript
const NVIDIA_API_KEY = 'nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en http://localhost:3000

## Personalización

### Cambiar el nombre de la aplicación

En `src/App.jsx`, modifica:

```javascript
const APP_NAME = 'NexusAI';  // Tu nombre aquí
```

### Cambiar el nombre del asistente

```javascript
const ASSISTANT_NAME = 'Nexus';  // Tu nombre aquí
```

### Personalizar el System Prompt

```javascript
const SYSTEM_PROMPT = `Eres ${ASSISTANT_NAME}, [tu descripción aquí]...`;
```

## Integración con PDF.js (opcional)

Para extraer texto real de archivos PDF:

### 1. Instalar la librería

```bash
npm install pdfjs-dist
```

### 2. Configurar en App.jsx

Descomenta la importación y el código en la función `extractTextFromPDF`:

```javascript
import * as pdfjs from 'pdfjs-dist';

// Configurar worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
```

## Modelos disponibles

La aplicación incluye los siguientes modelos de NVIDIA:

| Modelo | Descripción |
|--------|-------------|
| Llama 3.1 405B | Modelo más potente de Meta |
| Llama 3.1 70B | Equilibrio rendimiento/calidad |
| Llama 3.1 8B | Rápido y eficiente |
| Mistral Large 2 | Modelo avanzado de Mistral |
| Mixtral 8x22B | Arquitectura MoE |
| Gemma 2 27B | Modelo de Google |
| Nemotron 4 340B | Modelo propio de NVIDIA |
| Qwen2 72B | Modelo de Alibaba |

## Estructura del proyecto

```
ai-chat-app/
├── index.html              # HTML principal
├── package.json            # Dependencias
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
├── src/
│   ├── main.jsx            # Punto de entrada
│   ├── App.jsx             # Componente principal
│   ├── index.css           # Estilos globales
│   └── components/
│       ├── Header.jsx      # Cabecera con selector
│       ├── ChatInput.jsx   # Input con micrófono/archivos
│       ├── ChatMessage.jsx # Mensaje individual
│       ├── ChatHistory.jsx # Historial de mensajes
│       ├── ModelSelector.jsx # Selector de modelos
│       ├── Sidebar.jsx     # Barra lateral (opcional)
│       └── index.js        # Exportaciones
```

## Build para producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`.

## Consideraciones de seguridad

⚠️ **IMPORTANTE**: Este código expone la API Key en el frontend. Es adecuado para:
- Desarrollo local
- Uso personal
- Prototipos

Para producción, **debes** crear un backend proxy que:
1. Almacene la API Key de forma segura
2. Reciba las peticiones del frontend
3. Reenvíe a NVIDIA con la clave

Ejemplo de endpoint proxy:
```javascript
// Backend (Node.js/Express)
app.post('/api/chat', async (req, res) => {
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
    },
    body: JSON.stringify(req.body)
  });
  res.json(await response.json());
});
```

## Licencia

MIT - Libre uso para proyectos personales y comerciales.

## Soporte

Para problemas o preguntas, revisa la documentación oficial:
- [NVIDIA API Docs](https://docs.api.nvidia.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
