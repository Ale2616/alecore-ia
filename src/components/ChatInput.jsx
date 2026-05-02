import React from 'react';
import { Send, Mic, MicOff, Paperclip, X, File, Image as ImageIcon } from 'lucide-react';

/**
 * ChatInput - Componente de entrada de texto avanzado
 *
 * @param {string} input - Texto actual del input
 * @param {function} setInput - Setter del input
 * @param {function} onSend - Función para enviar mensaje
 * @param {function} onToggleVoice - Toggle del dictado por voz
 * @param {boolean} isRecording - Estado del dictado por voz
 * @param {array} attachedFiles - Archivos adjuntos
 * @param {function} onAttachFiles - Función para adjuntar archivos
 * @param {function} onRemoveFile - Función para eliminar archivo
 * @param {boolean} isLoading - Estado de carga
 */
const ChatInput = ({
  input,
  setInput,
  onSend,
  onToggleVoice,
  isRecording,
  attachedFiles,
  onAttachFiles,
  onRemoveFile,
  isLoading
}) => {
  // Referencia para el input file oculto
  const fileInputRef = React.useRef(null);

  // Manejar envío con Enter (Shift+Enter para salto de línea)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Manejar selección de archivos
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onAttachFiles(files);
    }
    // Resetear el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  };

  // Obtener icono según tipo de archivo
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    if (file.type === 'application/pdf') {
      return <File className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  // Obtener nombre corto del archivo
  const getShortFileName = (file) => {
    const maxLength = 20;
    if (file.name.length <= maxLength) return file.name;
    const ext = file.name.split('.').pop();
    const name = file.name.split('.').slice(0, -1).join('.');
    return `${name.substring(0, maxLength)}...${ext}`;
  };

  return (
    <div className="w-full">
      {/* Previsualización de archivos adjuntos */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-gray-700">
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-700 border border-gray-600
                         rounded-lg px-3 py-2 group hover:border-gray-500 transition-colors"
            >
              {/* Miniatura para imágenes o icono para otros archivos */}
              {file.type.startsWith('image/') && file.preview ? (
                <img
                  src={file.preview}
                  alt="Vista previa"
                  className="w-8 h-8 object-cover rounded"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center
                               bg-gray-600 rounded text-gray-400">
                  {getFileIcon(file)}
                </div>
              )}

              {/* Nombre del archivo */}
              <span className="text-sm text-gray-300 max-w-[150px] truncate">
                {getShortFileName(file)}
              </span>

              {/* Botón eliminar */}
              <button
                onClick={() => onRemoveFile(index)}
                className="p-1 hover:bg-gray-600 rounded-full transition-colors
                           text-gray-400 hover:text-red-400"
                aria-label="Eliminar archivo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Contenedor principal del input */}
      <div className="flex items-end gap-2 bg-gray-700 border border-gray-600
                      rounded-2xl p-2 hover:border-gray-500 focus-within:border-primary-500
                      focus-within:ring-1 focus-within:ring-primary-500 transition-all duration-200">

        {/* Botón de micrófono */}
        <button
          onClick={onToggleVoice}
          className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0
                     ${isRecording
                       ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse'
                       : 'bg-gray-600 text-gray-400 hover:bg-gray-500 hover:text-gray-300'
                     }`}
          aria-label={isRecording ? 'Detener grabación' : 'Activar micrófono'}
          title={isRecording ? 'Detener grabación' : 'Dictado por voz'}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Botón de adjuntar archivos */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl bg-gray-600 text-gray-400
                     hover:bg-gray-500 hover:text-gray-300 transition-all duration-200
                     flex-shrink-0"
          aria-label="Adjuntar archivos"
          title="Adjuntar imagen o PDF"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />

        {/* Área de texto */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje... (Shift+Enter para salto de línea)"
          rows={1}
          className="flex-1 bg-transparent text-gray-100 placeholder-gray-500
                     resize-none py-3 px-2 focus:outline-none scrollbar-thin
                     max-h-32 min-h-[44px]"
          style={{
            height: 'auto',
            minHeight: '44px',
            maxHeight: '128px'
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
          }}
          disabled={isLoading}
        />

        {/* Botón de enviar */}
        <button
          onClick={onSend}
          disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
          className="p-3 rounded-xl bg-primary-600 text-white
                     hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex-shrink-0
                     hover:scale-105 active:scale-95"
          aria-label="Enviar mensaje"
          title="Enviar mensaje"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Texto de ayuda */}
      <p className="text-xs text-dark-500 mt-2 text-center">
        {isRecording ? '🔴 Grabando... haz clic en el micrófono para detener' : 'Presiona Enter para enviar, Shift+Enter para nueva línea'}
      </p>
    </div>
  );
};

export default ChatInput;
