import React from 'react';
import {
  MessageSquare,
  PlusCircle,
  Trash2,
  Download,
  X,
  Sparkles
} from 'lucide-react';

/**
 * Sidebar - Drawer lateral con acciones del chat
 */
const Sidebar = ({
  isOpen,
  onToggle,
  onNewChat,
  onClearChat,
  onExportChat,
  messageCount = 0
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onToggle}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50
                    glass-panel-solid shadow-2xl shadow-black/40
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-surface-700/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-400" />
              <span className="font-bold text-surface-50">AleCore.IA</span>
            </div>
            <button
              onClick={onToggle}
              className="btn-ghost"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New chat button */}
          <div className="p-4">
            <button
              onClick={() => { onNewChat(); onToggle(); }}
              className="w-full btn-glow flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Nuevo Chat
            </button>
          </div>

          {/* Stats */}
          <div className="flex-1 px-4 overflow-y-auto scrollbar-thin">
            <div className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-3">
              Chat actual
            </div>

            <div className="p-3 rounded-xl bg-surface-800/40 border border-surface-700/30">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-accent-400" />
                <span className="text-sm text-surface-200">Conversación activa</span>
              </div>
              <p className="text-xs text-surface-400">
                {messageCount === 0
                  ? 'Sin mensajes aún. ¡Empieza a chatear!'
                  : `${messageCount} mensaje${messageCount !== 1 ? 's' : ''} en esta conversación`
                }
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-surface-700/40 space-y-1">
            <button
              onClick={() => { onExportChat(); onToggle(); }}
              disabled={messageCount === 0}
              className="w-full flex items-center gap-3 px-3 py-2.5
                         text-surface-400 hover:text-surface-100
                         hover:bg-surface-700/40 rounded-xl transition-all duration-200
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Exportar chat</span>
            </button>

            <button
              onClick={() => { onClearChat(); onToggle(); }}
              disabled={messageCount === 0}
              className="w-full flex items-center gap-3 px-3 py-2.5
                         text-surface-400 hover:text-red-400
                         hover:bg-red-500/10 rounded-xl transition-all duration-200
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Limpiar chat</span>
            </button>

            {/* Version */}
            <div className="pt-3 mt-2 border-t border-surface-700/30">
              <p className="text-[10px] text-surface-500 text-center">
                AleCore.IA v2.0 · Hecho con 💙 por Alejandro
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
