import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import SettingsModal, { MODELS } from './components/SettingsModal';

// ============================================================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ============================================================================

const APP_NAME = 'AleCore.IA';
const ASSISTANT_NAME = 'AleCore.IA';

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

const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const DEFAULT_MODEL = 'meta/llama-3.1-70b-instruct';

// ============================================================================
// HELPERS — localStorage
// ============================================================================

const STORAGE_KEYS = {
  MESSAGES: 'alecore_messages',
  MODEL: 'alecore_model',
};

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

function App() {
  // -------------------------------------------------------------------------
  // ESTADOS
  // -------------------------------------------------------------------------

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => loadFromStorage(STORAGE_KEYS.MESSAGES, []));
  const [selectedModel, setSelectedModel] = useState(() => loadFromStorage(STORAGE_KEYS.MODEL, DEFAULT_MODEL));
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  // UI states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const recognitionRef = useRef(null);
  // AbortController ref para cancelar la generación en curso
  const abortControllerRef = useRef(null);

  // -------------------------------------------------------------------------
  // PERSISTENCIA
  // -------------------------------------------------------------------------

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MODEL, selectedModel);
  }, [selectedModel]);

  // -------------------------------------------------------------------------
  // GESTIÓN DE ARCHIVOS
  // -------------------------------------------------------------------------

  const handleAttachFiles = useCallback((files) => {
    const newFiles = files.map(file => ({
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setAttachedFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const clearAttachedFiles = useCallback(() => {
    attachedFiles.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setAttachedFiles([]);
  }, [attachedFiles]);

  // -------------------------------------------------------------------------
  // DICTADO POR VOZ
  // -------------------------------------------------------------------------

  const toggleVoiceInput = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta el dictado por voz. Usa Chrome, Edge o Safari.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (event) => {
      console.error('Error en el reconocimiento de voz:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, [isRecording]);

  // -------------------------------------------------------------------------
  // PDF helper
  // -------------------------------------------------------------------------

  const extractTextFromPDF = async (file) => {
    return `[PDF: ${file.name}] - (Instala pdf.js para extraer el contenido)`;
  };

  // -------------------------------------------------------------------------
  // STOP — Abortar la generación en curso
  // -------------------------------------------------------------------------

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // -------------------------------------------------------------------------
  // ENVIAR MENSAJE (Streaming con AbortController)
  // -------------------------------------------------------------------------

  const sendMessage = useCallback(async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    // Guardar mensaje del usuario
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
      attachments: attachedFiles.map(f => ({ name: f.name, type: f.type }))
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Procesar archivos adjuntos
    let fileContext = '';
    for (const attachedFile of attachedFiles) {
      if (attachedFile.file.type === 'application/pdf') {
        try {
          const pdfText = await extractTextFromPDF(attachedFile.file);
          fileContext += `\n[Contenido del archivo: ${attachedFile.name}]\n${pdfText}\n`;
        } catch (error) {
          console.error('Error procesando PDF:', error);
        }
      } else if (attachedFile.file.type.startsWith('image/')) {
        fileContext += `\n[Imagen adjunta: ${attachedFile.name}]\n`;
      }
    }

    const fullUserContent = fileContext
      ? `${fileContext}\n\n---\n\nMensaje del usuario:\n${input}`
      : input;

    // Crear AbortController para esta petición
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
    // ─── Resolver proveedor del modelo seleccionado ───────────────────────────
    const modelConfig = MODELS.find(m => m.id === selectedModel);
    const provider = modelConfig?.provider || 'nvidia';

    // ─── Configurar endpoint y headers según proveedor ────────────────────────
    let fetchUrl, fetchHeaders;

    if (provider === 'google') {
      // Google Gemini — compatible con formato OpenAI (v1beta/openai)
      if (!GEMINI_API_KEY) {
        throw new Error('Falta la clave VITE_GEMINI_API_KEY en tu archivo .env');
      }
      fetchUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
      fetchHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Accept': 'text/event-stream',
      };
    } else {
      // NVIDIA NIM — conexión directa (sin proxy), streaming nativo del navegador
      if (!NVIDIA_API_KEY) {
        throw new Error('Falta la clave VITE_NVIDIA_API_KEY en tu archivo .env');
      }
      fetchUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
      fetchHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Accept': 'text/event-stream',
      };
    }

    // ─── Preparar payload condicional ─────────────────────────────────────────
    // Limpiar estrictamente los mensajes a solo { role, content } para evitar el Error 400
    const cleanMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-20).map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: fullUserContent }
    ];

    let bodyPayload;
    if (provider === 'google') {
      // Gemini es estricto y rechaza parámetros extra en este endpoint
      bodyPayload = {
        model: selectedModel,
        messages: cleanMessages,
        stream: true
      };
    } else {
      // NVIDIA acepta más parámetros para ajuste fino
      bodyPayload = {
        model: selectedModel,
        messages: cleanMessages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2048,
        stream: true
      };
    }

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify(bodyPayload),
      signal: controller.signal
    });


      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail?.message || errorData.detail || errorData.error?.message || errorMessage;
        } catch {
          if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }

      // Mensaje vacío inicial del asistente
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      }]);

      // Procesar streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let assistantContent = '';
      let buffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
              try {
                const data = JSON.parse(trimmed.substring(6));
                const delta = data.choices?.[0]?.delta?.content || '';
                assistantContent += delta;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: assistantContent
                  };
                  return updated;
                });
              } catch (e) {
                console.warn('Error parsing stream chunk', e);
              }
            }
          }
        }
      }

      // Flush buffer residual
      if (buffer.trim()) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
          try {
            const data = JSON.parse(trimmed.substring(6));
            const delta = data.choices?.[0]?.delta?.content || '';
            assistantContent += delta;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: assistantContent
              };
              return updated;
            });
          } catch {
            // chunk incompleto, ignorar
          }
        }
      }

    } catch (error) {
      // Si el usuario abortó, NO mostrar error — el texto generado queda intacto
      if (error.name === 'AbortError') {
        // Silenciosamente detenido por el usuario
        return;
      }

      console.error('Error al enviar mensaje:', error);

      const isFailedToFetch = error.message === 'Failed to fetch';
      const errorDetail = isFailedToFetch
        ? "El navegador bloqueó la petición (CORS/AdBlock) o no hay red. Intenta desactivar tu AdBlocker o usar otro navegador."
        : error.message;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ **Error de conexión**: ${errorDetail}\n\n**Detalles técnicos:**\n\`${error.name}: ${error.message}\`\n\nVerifica:\n1. Si usas AdBlock/Brave Shields, desactívalo temporalmente.\n2. Tu API Key es válida\n3. Tienes conexión a internet`,
        timestamp: Date.now(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      clearAttachedFiles();
    }
  }, [input, attachedFiles, messages, selectedModel, clearAttachedFiles]);

  // -------------------------------------------------------------------------
  // FUNCIONES UTILITARIAS
  // -------------------------------------------------------------------------

  const handleClearChat = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el historial de chat?')) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    }
  }, []);

  const handleExportChat = useCallback(() => {
    const chatText = messages.map(msg =>
      `[${new Date(msg.timestamp).toLocaleString()}] ${msg.role.toUpperCase()}:\n${msg.content}\n`
    ).join('\n---\n\n');

    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alecore-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  /**
   * resetChat — Vacía los mensajes y limpia localStorage.
   * No pide confirmación si el chat está vacío.
   */
  const resetChat = useCallback(() => {
    if (messages.length === 0) return;
    if (window.confirm('¿Iniciar un nuevo chat? El historial actual se borrará.')) {
      // Abortar generación en curso si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setMessages([]);
      setInput('');
      setIsLoading(false);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    }
  }, [messages]);

  // -------------------------------------------------------------------------
  // CLEANUP
  // -------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      abortControllerRef.current?.abort();
      attachedFiles.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, []);

  // -------------------------------------------------------------------------
  // RENDERIZADO
  // -------------------------------------------------------------------------

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-surface-950">

      {/* Sidebar Drawer — con selector de modelos integrado */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(false)}
        onNewChat={resetChat}
        onClearChat={handleClearChat}
        onExportChat={handleExportChat}
        messageCount={messages.length}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      {/* Settings Modal (desktop) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      {/* Header — con botón Nuevo Chat (desktop) */}
      <header className="flex-none">
        <Header
          selectedModel={selectedModel}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onNewChat={resetChat}
        />
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto w-full p-4">
        <div className="w-full max-w-4xl mx-auto h-full">
          <ChatHistory
            messages={messages}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Input Bar — con botón Stop */}
      <footer className="w-full flex-none p-3 glass-panel-solid border-t border-surface-700/40">
        <div className="w-full max-w-4xl mx-auto">
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            onStop={handleStop}
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
