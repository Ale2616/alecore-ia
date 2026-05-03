import React from 'react';
import ChatMessage from './ChatMessage';
import { Sparkles } from 'lucide-react';

/**
 * ChatHistory - Área de mensajes con empty state premium y auto-scroll
 */
const ChatHistory = ({ messages, isLoading }) => {
  const messagesEndRef = React.useRef(null);

  // Auto-scroll al último mensaje
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
      {messages.length === 0 ? (
        /* ── Empty State ────────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center h-full
                        text-center space-y-6 animate-fade-in">

          {/* Animated icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500/20 to-purple-500/20
                            border border-accent-500/20 flex items-center justify-center
                            animate-float shadow-glow">
              <Sparkles className="w-10 h-10 text-accent-400" />
            </div>
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-2xl animate-glow-pulse" />
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="text-xl font-bold text-gradient">
              ¡Hola! Soy AleCore.IA
            </h3>
            <p className="text-sm text-surface-400 leading-relaxed">
              Tu asistente inteligente creado por Alejandro.
              Pregúntame lo que quieras — estoy aquí para ayudarte. 🚀
            </p>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {[
              '💡 ¿Qué puedes hacer?',
              '🧠 Explícame algo complejo',
              '💻 Ayúdame con código',
            ].map((suggestion) => (
              <span
                key={suggestion}
                className="px-3 py-1.5 text-xs text-surface-300
                           bg-surface-800/60 border border-surface-700/40
                           rounded-full"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* ── Messages List ──────────────────────────────────────────── */
        <div className="space-y-5">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isTyping={false}
            />
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <ChatMessage
              message={{ role: 'assistant', content: '', timestamp: Date.now() }}
              isTyping={true}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
