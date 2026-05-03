import React from 'react';
import { Send, Square, Mic, MicOff, Paperclip, X, File, Image as ImageIcon } from 'lucide-react';

const ChatInput = ({
  input, setInput, onSend, onStop, onToggleVoice, isRecording,
  attachedFiles, onAttachFiles, onRemoveFile, isLoading
}) => {
  const fileInputRef = React.useRef(null);
  const textareaRef = React.useRef(null);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  };

  React.useEffect(() => { autoResize(); }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) onSend();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) onAttachFiles(files);
    e.target.value = '';
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="w-full">
      {/* Attached files */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-surface-700/30">
          {attachedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-2 bg-surface-800/60 border border-surface-700/40 rounded-lg px-3 py-2 hover:border-surface-600/50 transition-colors group">
              {file.type.startsWith('image/') && file.preview ? (
                <img src={file.preview} alt="Vista previa" className="w-8 h-8 object-cover rounded" />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-surface-700/50 rounded text-surface-400">
                  {getFileIcon(file)}
                </div>
              )}
              <span className="text-xs text-surface-300 max-w-[120px] truncate">{file.name}</span>
              <button onClick={() => onRemoveFile(index)} className="p-0.5 hover:bg-red-500/20 rounded-full transition-colors text-surface-500 hover:text-red-400" aria-label="Eliminar archivo">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main input container */}
      <div className="flex items-end gap-2 glass-panel rounded-2xl p-2 focus-within:border-accent-500/40 focus-within:shadow-glow-sm transition-all duration-300">
        {/* Microphone */}
        <button onClick={onToggleVoice} className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${isRecording ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/40'}`} aria-label={isRecording ? 'Detener grabación' : 'Activar micrófono'} title={isRecording ? 'Detener grabación' : 'Dictado por voz'}>
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Attach files */}
        <button onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-700/40 transition-all duration-200 flex-shrink-0" aria-label="Adjuntar archivos" title="Adjuntar imagen o PDF">
          <Paperclip className="w-5 h-5" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple onChange={handleFileSelect} className="hidden" aria-hidden="true" />

        {/* Textarea */}
        <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escribe tu mensaje..." rows={1} className="flex-1 bg-transparent text-surface-50 placeholder-surface-500 resize-none py-2.5 px-2 focus:outline-none scrollbar-thin max-h-[140px] min-h-[40px] text-sm leading-relaxed" disabled={isLoading} />

        {/* Send / Stop button */}
        {isLoading ? (
          <button
            onClick={onStop}
            className="p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-95"
            aria-label="Detener generación"
            title="Detener generación"
          >
            <Square className="w-5 h-5 fill-current" />
          </button>
        ) : (
          <button
            onClick={onSend}
            disabled={!input.trim() && attachedFiles.length === 0}
            className="p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-glow-sm hover:shadow-glow hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
            aria-label="Enviar mensaje"
            title="Enviar mensaje"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="text-[10px] text-surface-500 mt-2 text-center">
        {isRecording ? '🔴 Grabando... haz clic para detener' : isLoading ? '⏳ Generando... presiona ■ para detener' : 'Enter para enviar · Shift+Enter para nueva línea'}
      </p>
    </div>
  );
};

export default ChatInput;
