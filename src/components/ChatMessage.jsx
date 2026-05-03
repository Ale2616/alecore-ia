import React from 'react';
import { User, Bot, Copy, Check, Volume2, VolumeX } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

/**
 * ChatMessage - Burbuja de mensaje con markdown, glassmorphism y animaciones
 */
const ChatMessage = ({ message, isTyping = false }) => {
  const [copied, setCopied] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const isUser = message.role === 'user';

  // Formatear timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Copiar mensaje
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = message.content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text-to-Speech
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

  return (
    <div
      className={`flex gap-3 animate-slide-up
                  ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                    shadow-lg transition-all duration-300
                    ${isUser
                      ? 'bg-accent-600/20 text-accent-400 border border-accent-500/20'
                      : 'bg-gradient-to-br from-accent-500 to-purple-600 text-white shadow-glow-sm'
                    }`}
      >
        {isUser
          ? <User className="w-4 h-4" />
          : <Bot className="w-4 h-4" />
        }
      </div>

      {/* Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}
                       max-w-[85%] sm:max-w-[75%]`}>

        {/* Sender label */}
        <span className={`text-[11px] font-medium mb-1 px-1
                         ${isUser ? 'text-accent-400' : 'text-surface-400'}`}>
          {isUser ? 'Tú' : 'AleCore.IA'}
        </span>

        {/* Bubble */}
        <div className={`${isUser ? 'message-user' : 'message-ai'}
                         px-4 py-3 shadow-lg transition-all duration-200`}>
          {isTyping ? (
            <div className="typing-dots py-1">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          ) : isUser ? (
            // User messages: plain text (no markdown needed)
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          ) : (
            // AI messages: full markdown rendering
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Meta & Actions */}
        <div className="flex items-center gap-2 mt-1.5 px-1">
          <span className="text-[10px] text-surface-500">
            {formatTime(message.timestamp)}
          </span>

          {!isUser && !isTyping && (
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleCopy}
                className="p-1 text-surface-500 hover:text-accent-400
                           rounded-md hover:bg-surface-700/30 transition-all duration-200"
                aria-label="Copiar mensaje"
                title="Copiar"
              >
                {copied
                  ? <Check className="w-3 h-3 text-green-400" />
                  : <Copy className="w-3 h-3" />
                }
              </button>

              <button
                onClick={handleSpeak}
                className="p-1 text-surface-500 hover:text-accent-400
                           rounded-md hover:bg-surface-700/30 transition-all duration-200"
                aria-label={isSpeaking ? 'Detener lectura' : 'Leer en voz alta'}
                title={isSpeaking ? 'Detener' : 'Leer'}
              >
                {isSpeaking
                  ? <VolumeX className="w-3 h-3 text-accent-400" />
                  : <Volume2 className="w-3 h-3" />
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
