import React from 'react';
import {
  MessageSquare,
  PlusCircle,
  Trash2,
  Download,
  X,
  Sparkles,
  Cpu,
  Check
} from 'lucide-react';
import { MODELS } from './SettingsModal';

/**
 * Sidebar - Drawer lateral con selector de modelos integrado + acciones del chat.
 * Diseñado para móvil: contiene todo lo que el usuario necesita en un solo lugar.
 */
const Sidebar = ({
  isOpen,
  onToggle,
  onNewChat,
  onClearChat,
  onExportChat,
  messageCount = 0,
  selectedModel,
  onModelChange,
}) => {
  // Seleccionar modelo y cerrar sidebar
  const handleModelSelect = (modelValue) => {
    onModelChange(modelValue);
    onToggle(); // Cierra el sidebar automáticamente
  };

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

          {/* Scrollable content */}
          <div className="flex-1 px-4 overflow-y-auto scrollbar-thin space-y-4">

            {/* ─── Model selector ─── */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-3.5 h-3.5 text-accent-400" />
                <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Modelo de IA
                </span>
              </div>

              <div className="space-y-2">
                {MODELS.map((model) => {
                  const isSelected = selectedModel === model.id;
                  const Icon = model.icon;

                  return (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200
                                 ${isSelected
                                   ? 'border-accent-500/60 bg-accent-500/10'
                                   : 'border-surface-700/30 bg-surface-800/30 hover:border-surface-600/50 hover:bg-surface-700/30'
                                 }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                        ${isSelected
                                          ? 'bg-accent-500/20 text-accent-400'
                                          : 'bg-surface-700/50 text-surface-400'
                                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium block
                                           ${isSelected ? 'text-accent-300' : 'text-surface-200'}`}>
                            {model.label}
                          </span>
                          <span className="text-[10px] text-surface-500 block truncate">
                            {model.providerLabel}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-accent-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── Chat stats ─── */}
            <div>
              <div className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">
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
