import React from 'react';
import { Sparkles, Settings, Info } from 'lucide-react';
import ModelSelector from './ModelSelector';

/**
 * Header - Componente de cabecera con selector de modelos
 *
 * @param {string} selectedModel - Modelo seleccionado
 * @param {function} onModelChange - Callback de cambio de modelo
 */
const Header = ({ selectedModel, onModelChange }) => {
  return (
    <header className="glass-effect border-b border-dark-700 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br
                          from-primary-500 to-purple-600
                          flex items-center justify-center
                          shadow-lg shadow-primary-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-dark-100">
              AleCore.IA
            </h1>
            <p className="text-xs text-dark-400 hidden sm:block">
              Tu asistente personal inteligente
            </p>
          </div>
        </div>

        {/* Selector de modelos (centro) */}
        <div className="flex-1 flex justify-center px-4">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          />
        </div>

        {/* Botones de la derecha (placeholder para futuras funcionalidades) */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-dark-400 hover:text-dark-200
                       hover:bg-dark-800 rounded-lg transition-all duration-200"
            aria-label="Información"
            title="Información"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-dark-400 hover:text-dark-200
                       hover:bg-dark-800 rounded-lg transition-all duration-200"
            aria-label="Configuración"
            title="Configuración"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
