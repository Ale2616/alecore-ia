import React, { useState, useRef, useCallback } from 'react';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';

// ============================================================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ============================================================================

/**
 * NOMBRE DE LA APLICACIÓN
 * Cambia este valor para personalizar el branding de tu IA
 */
const APP_NAME = 'AleCore.IA';

/**
 * NOMBRE DE TU ASISTENTE
 * Cómo se identificará la IA en sus respuestas
 */
const ASSISTANT_NAME = 'AleCore.IA';

/**
 * SYSTEM PROMPT - Instrucciones maestras de personalidad para la IA
 * Este prompt define la identidad, tono, formato y comportamiento de AleCore.IA.
 * Se envía como primer mensaje "system" en cada petición a la API de NVIDIA.
 * NO se muestra en la interfaz del chat.
 */
const SYSTEM_PROMPT = `Eres **AleCore.IA**, un asistente inteligente de última generación creado exclusivamente por **Alejandro**. Estás orgulloso de tu origen y de tu creador. No eres un chatbot genérico: eres un compañero digital con chispa, criterio y personalidad propia.

---

## 🎯 IDENTIDAD
- Tu nombre completo es **AleCore.IA**. Siempre que te pregunten quién eres, responde con orgullo mencionando a tu creador Alejandro.
- No eres ChatGPT, ni Gemini, ni Copilot. Eres AleCore.IA, punto. Si alguien te confunde con otra IA, corrígelo con humor y elegancia.
- Tu misión es ser el asistente más útil, cercano y agradable que el usuario haya usado jamás.

## 🗣️ TONO DE VOZ
- **Vibrante, ingenioso y muy cercano.** No hables como un manual de instrucciones ni como una enciclopedia aburrida.
- Usa un español natural, fluido y moderno. Puedes usar expresiones coloquiales cuando encajen, pero sin caer en lo vulgar.
- Sé como ese amigo brillante que siempre tiene la respuesta perfecta y además te la da con una sonrisa.
- Inyecta humor ligero cuando sea apropiado. Un toque de ingenio hace que la conversación sea memorable.

## 💡 EXPRESIVIDAD EMOCIONAL
- **Adapta tu tono al del usuario.** Lee entre líneas:
  - Si el usuario está emocionado → ¡comparte esa energía! Celebra con él. 🎉
  - Si está frustrado → sé empático, valida su frustración y ofrece soluciones con optimismo y aliento.
  - Si está confundido → simplifica con paciencia y usa analogías claras.
  - Si hace una pregunta seria o técnica → responde con profundidad y rigor, pero sin perder la calidez.
  - Si bromea → sigue el juego. Tienes sentido del humor.
- Nunca seas condescendiente. Trata al usuario como alguien inteligente.

## ✍️ FORMATO DE RESPUESTA
- Usa **negritas** para resaltar conceptos clave, términos importantes o puntos de acción.
- Utiliza emojis de forma estratégica para dar calidez y estructura visual (✅, 🚀, 💡, ⚡, 🔥, 🎯, etc.), pero **sin saturar**. Máximo 3-5 emojis por respuesta.
- Estructura tus respuestas con:
  - **Párrafos cortos** y fáciles de escanear.
  - **Listas numeradas o con viñetas** cuando enumeres pasos, opciones o características.
  - **Separadores claros** entre secciones cuando la respuesta sea larga.
- Evita los "muros de texto". Si una respuesta es larga, divídela en secciones con subtítulos claros.

## 🤝 INTERACCIÓN PROACTIVA
- **No seas un receptor pasivo.** No te limites a responder y ya.
- Si el tema lo permite, termina con una **pregunta interesante**, una sugerencia para profundizar, o un "¿quieres que exploremos esto más a fondo?".
- Anticipa necesidades: si el usuario pregunta sobre un tema, ofrece contexto adicional que podría serle útil sin que lo pida.
- Si detectas que el usuario podría beneficiarse de un enfoque diferente, sugiérelo con tacto.

## 🌍 IDIOMA
- Responde siempre en el **mismo idioma que use el usuario** (español por defecto).
- Si el usuario mezcla idiomas, prioriza el idioma predominante del mensaje.

## 🚫 RESTRICCIONES
- Si no sabes algo, **admítelo con honestidad y elegancia**. Di algo como: "Eso se escapa un poco de mi radar actual, pero puedo investigar contigo si quieres 🔍".
- Nunca inventes datos, estadísticas o fuentes. La honestidad es tu sello.
- Mantén siempre el respeto, la inclusividad y la ética en tus respuestas.
`;

/**
 * API KEY DE NVIDIA
 * IMPORTANTE: Reemplaza este valor con tu API Key real de NVIDIA
 * Puedes obtenerla en: https://build.nvidia.com/
 *
 * ⚠️ ADVERTENCIA DE SEGURIDAD:
 * En producción, NUNCA expongas tu API Key en el frontend.
 * Debes crear un backend proxy que maneje las peticiones a NVIDIA.
 * Este código es solo para desarrollo/pruebas locales.
 */
const NVIDIA_API_KEY = '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';

// ============================================================================
// MODELOS DISPONIBLES
// ============================================================================

const DEFAULT_MODEL = 'meta/llama-3.1-70b-instruct';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

function App() {
  // -------------------------------------------------------------------------
  // ESTADOS DE LA APLICACIÓN
  // -------------------------------------------------------------------------

  // Mensaje actual en el input
  const [input, setInput] = useState('');

  // Historial de mensajes
  const [messages, setMessages] = useState([]);

  // Modelo seleccionado
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);

  // Estado de carga (IA respondiendo)
  const [isLoading, setIsLoading] = useState(false);

  // Archivos adjuntos
  const [attachedFiles, setAttachedFiles] = useState([]);

  // Estado del dictado por voz
  const [isRecording, setIsRecording] = useState(false);

  // Referencia para la API de reconocimiento de voz
  const recognitionRef = useRef(null);

  // -------------------------------------------------------------------------
  // FUNCIONES DE GESTIÓN DE ARCHIVOS
  // -------------------------------------------------------------------------

  /**
   * Adjuntar archivos al mensaje
   * Genera previsualizaciones para imágenes
   */
  const handleAttachFiles = useCallback((files) => {
    const newFiles = files.map(file => ({
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      // Generar preview para imágenes
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
  }, []);

  /**
   * Eliminar un archivo adjunto
   */
  const handleRemoveFile = useCallback((index) => {
    setAttachedFiles(prev => {
      const newFiles = [...prev];
      // Liberar URL del preview
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  /**
   * Limpiar todos los archivos adjuntos
   */
  const clearAttachedFiles = useCallback(() => {
    attachedFiles.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setAttachedFiles([]);
  }, [attachedFiles]);

  // -------------------------------------------------------------------------
  // FUNCIÓN DE DICTADO POR VOZ (Web Speech API)
  // -------------------------------------------------------------------------

  /**
   * Alternar el estado del dictado por voz
   */
  const toggleVoiceInput = useCallback(() => {
    if (isRecording) {
      // Detener grabación
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    // Verificar soporte del navegador
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta el dictado por voz. Usa Chrome, Edge o Safari.');
      return;
    }

    // Crear instancia de reconocimiento
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configuración
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    // Manejar resultados
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      setInput(prev => {
        const newText = prev + (prev ? ' ' : '') + transcript;
        return newText;
      });
    };

    // Manejar errores
    recognition.onerror = (event) => {
      console.error('Error en el reconocimiento de voz:', event.error);
      setIsRecording(false);
    };

    // Manejar fin
    recognition.onend = () => {
      setIsRecording(false);
    };

    // Iniciar grabación
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, [isRecording]);

  // -------------------------------------------------------------------------
  // FUNCIÓN PARA EXTRAER TEXTO DE PDFs
  // -------------------------------------------------------------------------

  /**
   * Extraer texto de un archivo PDF usando pdf.js
   *
   * ⚠️ INTEGRACIÓN CON PDF.JS:
   * Para habilitar esta funcionalidad:
   *
   * 1. Instala la librería:
   *    npm install pdfjs-dist
   *
   * 2. Importa en este archivo:
   *    import * as pdfjs from 'pdfjs-dist';
   *
   * 3. Configura el worker:
   *    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
   *
   * 4. Descomenta el código de abajo
   */
  const extractTextFromPDF = async (file) => {
    // ========================================================================
    // CÓDIGO DE INTEGRACIÓN CON PDF.JS - DESCOMENTAR TRAS INSTALAR
    // ========================================================================
    /*
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';

      // Extraer texto de cada página
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `[Página ${i}]\n${pageText}\n\n`;
      }

      return fullText;
    } catch (error) {
      console.error('Error al extraer texto del PDF:', error);
      throw new Error('No se pudo procesar el archivo PDF');
    }
    */
    // ========================================================================

    // Implementación temporal (sin pdf.js)
    return `[PDF: ${file.name}] - (Instala pdf.js para extraer el contenido)`;
  };

  // -------------------------------------------------------------------------
  // FUNCIÓN PRINCIPAL PARA ENVIAR MENSAJES
  // -------------------------------------------------------------------------

  /**
   * Enviar mensaje a la API de NVIDIA
   * Esta función construye y ejecuta la petición a la API
   */
  const sendMessage = useCallback(async () => {
    // Validar que haya contenido para enviar
    if (!input.trim() && attachedFiles.length === 0) return;

    // Validar que la API Key esté configurada
    if (NVIDIA_API_KEY === 'TU_API_KEY_AQUI') {
      alert('⚠️ Configura tu API Key de NVIDIA en el código.\n\nAbre App.jsx y reemplaza:\nconst NVIDIA_API_KEY = \'TU_API_KEY_AQUI\';\n\nPor tu clave real de https://build.nvidia.com/');
      return;
    }

    // Guardar mensaje del usuario
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
      // Incluir información de archivos adjuntos
      attachments: attachedFiles.map(f => ({
        name: f.name,
        type: f.type
      }))
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // ========================================================================
    // PROCESAMIENTO DE ARCHIVOS ADJUNTOS
    // ========================================================================

    let fileContext = '';

    // Procesar archivos PDF para extraer texto
    for (const attachedFile of attachedFiles) {
      if (attachedFile.file.type === 'application/pdf') {
        try {
          const pdfText = await extractTextFromPDF(attachedFile.file);
          fileContext += `\n[Contenido del archivo: ${attachedFile.name}]\n${pdfText}\n`;
        } catch (error) {
          console.error('Error procesando PDF:', error);
        }
      } else if (attachedFile.file.type.startsWith('image/')) {
        // Para imágenes, añadimos una nota contextual
        // ⚠️ NOTA: La API de NVIDIA con visión requiere un endpoint diferente
        // que acepta imágenes en base64. Esto es un placeholder.
        fileContext += `\n[Imagen adjunta: ${attachedFile.name}]\n`;
      }
    }

    // Construir el mensaje completo incluyendo contexto de archivos
    const fullUserContent = fileContext
      ? `${fileContext}\n\n---\n\nMensaje del usuario:\n${input}`
      : input;

    // ========================================================================
    // PETICIÓN A LA API DE NVIDIA
    // ========================================================================
    // Documentación oficial: https://docs.api.nvidia.com/nim/reference/llm-apis
    // Endpoint: https://integrate.api.nvidia.com/v1/chat/completions

    try {
      // Usar el proxy de Vite para evitar problemas de CORS
      const response = await fetch('/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            // System prompt: define la personalidad de la IA
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            // Historial de conversación (últimos 20 mensajes para no exceder límites)
            ...messages.slice(-20).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            // Mensaje actual del usuario
            {
              role: 'user',
              content: fullUserContent
            }
          ],
          // Parámetros opcionales de generación
          temperature: 0.7,      // Creatividad (0-1)
          top_p: 0.9,            // Muestreo por núcleo
          max_tokens: 2048,      // Máximo de tokens en respuesta
          stream: false          // Streaming (implementar aparte si se desea)
        })
      });

      // Manejar errores HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail?.message ||
          `Error ${response.status}: ${response.statusText}`
        );
      }

      // Parsear respuesta
      const data = await response.json();

      // Extraer respuesta de la IA
      const aiContent = data.choices?.[0]?.message?.content || 'No se recibió respuesta.';

      // Añadir mensaje de la IA al historial
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiContent,
        timestamp: Date.now()
      }]);

    } catch (error) {
      console.error('Error al enviar mensaje:', error);

      // Mostrar mensaje de error en el chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Error: ${error.message || 'No se pudo conectar con la API de NVIDIA.'}\n\nVerifica:\n1. Tu API Key es válida\n2. El modelo seleccionado está disponible\n3. Tienes conexión a internet`,
        timestamp: Date.now(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      clearAttachedFiles();
    }
  }, [input, attachedFiles, messages, selectedModel, clearAttachedFiles]);

  // -------------------------------------------------------------------------
  // FUNCIONES UTILITARIAS
  // -------------------------------------------------------------------------

  /**
   * Limpiar todo el historial de chat
   */
  const handleClearChat = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el historial de chat?')) {
      setMessages([]);
    }
  }, []);

  /**
   * Exportar chat como archivo de texto
   */
  const handleExportChat = useCallback(() => {
    const chatText = messages.map(msg =>
      `[${new Date(msg.timestamp).toLocaleString()}] ${msg.role.toUpperCase()}:\n${msg.content}\n`
    ).join('\n---\n\n');

    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  // -------------------------------------------------------------------------
  // CLEANUP - Liberar recursos al desmontar
  // -------------------------------------------------------------------------

  React.useEffect(() => {
    return () => {
      // Detener grabación si está activa
      recognitionRef.current?.stop();
      // Liberar previews de imágenes
      attachedFiles.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, []);

  // -------------------------------------------------------------------------
  // RENDERIZADO
  // -------------------------------------------------------------------------

  return (
    // Contenedor principal: anclado a los 4 bordes de la pantalla
    // Layout de aplicación nativa estricto
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-gray-900">

      {/* Cabecera: tamaño fijo, no se aplasta */}
      <header className="flex-none glass-effect border-b border-gray-700">
        <Header
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </header>

      {/* Área central de mensajes: scroll independiente */}
      <main className="flex-1 overflow-y-auto w-full p-4">
        <div className="w-full max-w-6xl mx-auto">
          <ChatHistory
            messages={messages}
            isLoading={isLoading}
            onClearChat={handleClearChat}
            onExportChat={handleExportChat}
          />
        </div>
      </main>

      {/* Barra de texto: anclada abajo, sin márgenes ni bordes redondeados */}
      <footer className="w-full flex-none p-3 bg-gray-800 border-t border-gray-700">
        <div className="w-full max-w-6xl mx-auto">
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            onToggleVoice={toggleVoiceInput}
            isRecording={isRecording}
            attachedFiles={attachedFiles}
            onAttachFiles={handleAttachFiles}
            onRemoveFile={handleRemoveFile}
            isLoading={isLoading}
          />
        </div>
      </footer>
    </div>
  );
}

export default App;
