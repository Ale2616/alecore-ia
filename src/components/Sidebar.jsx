import React from 'react';
import {
  MessageSquare,
  PlusCircle,
  History,
  Settings,
  Moon,
  Sun,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * Sidebar - Barra lateral con historial de conversaciones y opciones
 *
 * @param {boolean} isOpen - Estado de la barra lateral
 * @param {function} onToggle - Función para abrir/cerrar
 * @param {array} conversations - Lista de conversaciones guardadas
 * @param {function} onSelectConversation - Seleccionar conversación
 * @param {function} onNewChat - Crear nuevo chat
 */
const Sidebar = ({
  isOpen,
  onToggle,
  conversations = [],
  onSelectConversation,
  onNewChat
}) => {
  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Barra lateral */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-dark-900 border-r border-dark-700
                    z-50 transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Cabecera */}
          <div className="p-4 border-b border-dark-700">
            <button
              onClick={onNewChat}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Nuevo Chat
            </button>
          </div>

          {/* Lista de conversaciones */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            <div className="text-xs font-medium text-dark-500 uppercase tracking-wider px-2 mb-2">
              Conversaciones recientes
            </div>

            {conversations.length === 0 ? (
              <p className="text-sm text-dark-500 px-2 py-4 text-center">
                No hay conversaciones guardadas
              </p>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectConversation(conv)}
                    className="w-full text-left px-3 py-2 rounded-lg
                               hover:bg-dark-800 transition-colors
                               group flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-dark-500
                                            group-hover:text-dark-400" />
                    <span className="text-sm text-dark-300 truncate">
                      {conv.title || 'Sin título'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pie con opciones */}
          <div className="p-4 border-t border-dark-700 space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2
                               text-dark-400 hover:text-dark-200
                               hover:bg-dark-800 rounded-lg transition-colors">
              <History className="w-5 h-5" />
              <span className="text-sm">Historial completo</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2
                               text-dark-400 hover:text-dark-200
                               hover:bg-dark-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              <span className="text-sm">Configuración</span>
            </button>

            <div className="pt-2 border-t border-dark-700 mt-2">
              <p className="text-xs text-dark-500 text-center">
                AleCore.IA v1.0.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
