import React from 'react';
import ChatMessage from './ChatMessage';
import { Trash2, Download, MessageSquare } from 'lucide-react';

/**
 * ChatHistory - Componente para mostrar el historial de mensajes
 *
 * @param {array} messages - Array de mensajes
 * @param {boolean} isLoading - Estado de carga
 * @param {function} onClearChat - Función para limpiar el chat
 * @param {function} onExportChat - Función para exportar el chat
 */
const ChatHistory = ({ messages, isLoading, onClearChat, onExportChat }) => {
  const messagesEndRef = React.useRef(null);

  // Auto-scroll al último mensaje
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
      {messages.length === 0 ? (
        /* Estado vacío - Sin mensajes */
        <div className="flex flex-col items-center justify-center h-full
                        text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-dark-800
                          flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-dark-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-dark-200">
              ¡Bienvenido a AleCore.IA!
            </h3>
            <p className="text-dark-400 mt-1 max-w-md">
              Comienza una conversación con tu asistente personal.
              Haz una pregunta o comparte un archivo para empezar.
            </p>
          </div>
        </div>
      ) : (
        /* Lista de mensajes */
        <div className="space-y-6">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isTyping={false}
            />
          ))}

          {/* Indicador de "escribiendo..." */}
          {isLoading && (
            <ChatMessage
              message={{ role: 'assistant', content: '', timestamp: Date.now() }}
              isTyping={true}
            />
          )}

          {/* Referencia para auto-scroll */}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
