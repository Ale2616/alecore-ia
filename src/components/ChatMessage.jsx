import React from 'react';
import { User, Bot, Copy, Check, Volume2, VolumeX } from 'lucide-react';

/**
 * ChatMessage - Componente para mostrar un mensaje individual
 *
 * @param {object} message - Objeto mensaje con {role, content, timestamp}
 * @param {boolean} isTyping - Si la IA está "escribiendo"
 */
const ChatMessage = ({ message, isTyping = false }) => {
  const [copied, setCopied] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  // Formatear timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Copiar mensaje al portapapeles
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Leer mensaje en voz alta (Text-to-Speech)
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Es un mensaje del usuario
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}
                  animate-fade-in`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                    ${isUser
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    }`}
      >
        {isUser ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </div>

      {/* Contenido del mensaje */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}
                       max-w-[80%] sm:max-w-[70%]`}>

        {/* Burbuja del mensaje */}
        <div
          className={`${isUser ? 'message-user' : 'message-ai'}
                      border px-4 py-3 shadow-lg`}
        >
          {isTyping ? (
            <div className="typing-dots">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          )}
        </div>

        {/* Metadatos y acciones */}
        <div className="flex items-center gap-2 mt-1 px-1">
          {/* Timestamp */}
          <span className="text-xs text-dark-500">
            {formatTime(message.timestamp)}
          </span>

          {/* Botones de acción (solo para mensajes de IA) */}
          {!isUser && !isTyping && (
            <div className="flex items-center gap-1">
              {/* Botón copiar */}
              <button
                onClick={handleCopy}
                className="p-1 text-dark-500 hover:text-dark-300 transition-colors"
                aria-label="Copiar mensaje"
                title="Copiar"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>

              {/* Botón leer en voz alta */}
              <button
                onClick={handleSpeak}
                className="p-1 text-dark-500 hover:text-dark-300 transition-colors"
                aria-label={isSpeaking ? 'Detener lectura' : 'Leer en voz alta'}
                title={isSpeaking ? 'Detener' : 'Leer'}
              >
                {isSpeaking ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
