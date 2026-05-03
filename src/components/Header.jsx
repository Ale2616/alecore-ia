import React from 'react';
import { Sparkles, Settings, Menu, Cpu } from 'lucide-react';

/**
 * Header - Cabecera glassmorphism con logo, badge de modelo y botones
 */
const Header = ({ selectedModel, onOpenSettings, onToggleSidebar }) => {
  // Get short model name for the badge
  const getModelBadge = () => {
    if (selectedModel.includes('405b')) return 'Llama 405B';
    if (selectedModel.includes('nemotron')) return 'Nemotron 70B';
    if (selectedModel.includes('70b')) return 'Llama 70B';
    return selectedModel.split('/').pop()?.split('-').slice(0, 3).join(' ') || 'AI';
  };

  return (
    <header className="glass-panel-solid border-b border-surface-700/40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            onClick={onToggleSidebar}
            className="btn-ghost lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600
                          flex items-center justify-center shadow-glow-sm
                          animate-glow-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-surface-50 tracking-tight">
              AleCore<span className="text-gradient">.IA</span>
            </h1>
            <p className="text-[11px] text-surface-400 hidden sm:block">
              Asistente inteligente por Alejandro
            </p>
          </div>
        </div>

        {/* Center: Model badge */}
        <button
          onClick={onOpenSettings}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg
                     bg-surface-800/60 border border-surface-700/40
                     hover:border-accent-500/30 hover:bg-surface-700/40
                     transition-all duration-200 group"
          title="Cambiar modelo"
        >
          <Cpu className="w-3.5 h-3.5 text-accent-400 group-hover:text-accent-300" />
          <span className="text-xs font-medium text-surface-300 group-hover:text-surface-100">
            {getModelBadge()}
          </span>
        </button>

        {/* Right: Settings */}
        <button
          onClick={onOpenSettings}
          className="btn-ghost"
          aria-label="Configuración"
          title="Configuración"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
