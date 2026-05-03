import React from 'react';
import { X, Cpu, Zap, Brain, Star, Check, Layers, Code, FastForward } from 'lucide-react';

/**
 * SettingsModal - Modal de configuración con selector de modelos estilizado
 */

const MODELS = [
  // Llama Family
  {
    value: 'meta/llama-3.1-405b-instruct',
    label: 'Llama 3.1 405B',
    provider: 'Meta',
    description: 'El modelo más potente. Máxima calidad en razonamiento y generación.',
    badge: '⚡ Potente',
    badgeColor: 'from-amber-500 to-orange-500',
    icon: Zap,
  },
  {
    value: 'meta/llama-3.1-70b-instruct',
    label: 'Llama 3.1 70B',
    provider: 'Meta',
    description: 'Balance perfecto entre rendimiento y velocidad de respuesta.',
    badge: '⭐ Recomendado',
    badgeColor: 'from-accent-500 to-accent-400',
    icon: Star,
  },
  {
    value: 'meta/llama-3.1-8b-instruct',
    label: 'Llama 3.1 8B',
    provider: 'Meta',
    description: 'Rápido y eficiente para tareas sencillas.',
    badge: '🏃 Rápido',
    badgeColor: 'from-green-500 to-emerald-500',
    icon: FastForward,
  },

  // NVIDIA Special
  {
    value: 'nvidia/llama-3.1-nemotron-70b-instruct',
    label: 'Nemotron 70B',
    provider: 'NVIDIA',
    description: 'Optimizado para razonamiento complejo, análisis y lógica.',
    badge: '🧠 Razonamiento',
    badgeColor: 'from-purple-500 to-pink-500',
    icon: Brain,
  },
  {
    value: 'nvidia/nemotron-4-340b-instruct',
    label: 'Nemotron 4 340B',
    provider: 'NVIDIA',
    description: 'Alineado para generación de alta calidad y precisión.',
    badge: '🎯 Precisión',
    badgeColor: 'from-indigo-500 to-blue-500',
    icon: Layers,
  },

  // Mistral / Gemma
  {
    value: 'mistralai/mistral-large-2-instruct',
    label: 'Mistral Large 2',
    provider: 'Mistral',
    description: 'Modelo insignia de Mistral, excelente para código y razonamiento.',
    badge: '💻 Código',
    badgeColor: 'from-blue-400 to-cyan-500',
    icon: Code,
  },
  {
    value: 'mistralai/mixtral-8x7b-instruct-v0.1',
    label: 'Mixtral 8x7B',
    provider: 'Mistral',
    description: 'Arquitectura MoE, gran rendimiento y velocidad.',
    badge: '🔄 MoE',
    badgeColor: 'from-teal-500 to-emerald-400',
    icon: Layers,
  },
  {
    value: 'google/gemma-2-27b-it',
    label: 'Gemma 2 27B',
    provider: 'Google',
    description: 'Potente modelo abierto de Google con gran capacidad de razonamiento.',
    badge: '🌐 Abierto',
    badgeColor: 'from-red-500 to-orange-400',
    icon: Star,
  },
  {
    value: 'google/gemma-2-9b-it',
    label: 'Gemma 2 9B',
    provider: 'Google',
    description: 'Versión ligera de Gemma 2, ideal para baja latencia.',
    badge: '⚡ Ligero',
    badgeColor: 'from-red-400 to-orange-300',
    icon: FastForward,
  },

  // Eficientes
  {
    value: 'microsoft/phi-3-medium-4k-instruct',
    label: 'Phi-3 Medium',
    provider: 'Microsoft',
    description: 'Gran capacidad de razonamiento en un tamaño reducido.',
    badge: '🔬 Eficiente',
    badgeColor: 'from-sky-500 to-blue-400',
    icon: Brain,
  },
  {
    value: 'microsoft/phi-3-mini-4k-instruct',
    label: 'Phi-3 Mini',
    provider: 'Microsoft',
    description: 'El modelo más pequeño y veloz de la familia Phi.',
    badge: '🚀 Ultra-Rápido',
    badgeColor: 'from-sky-400 to-blue-300',
    icon: FastForward,
  },
];

const SettingsModal = ({ isOpen, onClose, selectedModel, onModelChange }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-panel-solid rounded-2xl
                      shadow-2xl shadow-accent-500/10 animate-slide-up overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600
                            flex items-center justify-center shadow-glow-sm">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-surface-50">Configuración</h2>
              <p className="text-xs text-surface-400">Selecciona tu modelo de IA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost rounded-xl"
            aria-label="Cerrar configuración"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Cards */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3 sticky top-0 bg-surface-900/80 backdrop-blur-sm z-10 py-1">
            Modelo de IA
          </p>

          {MODELS.map((model) => {
            const isSelected = selectedModel === model.value;
            const Icon = model.icon;

            return (
              <button
                key={model.value}
                onClick={() => onModelChange(model.value)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300
                           group relative overflow-hidden
                           ${isSelected
                             ? 'border-accent-500/60 bg-accent-500/10 shadow-glow-sm'
                             : 'border-surface-700/40 bg-surface-800/40 hover:border-surface-600/60 hover:bg-surface-700/30'
                           }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                  ${isSelected
                                    ? 'bg-accent-500/20 text-accent-400'
                                    : 'bg-surface-700/50 text-surface-400 group-hover:text-surface-300'
                                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold text-sm
                                       ${isSelected ? 'text-accent-300' : 'text-surface-100'}`}>
                        {model.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                                       bg-gradient-to-r ${model.badgeColor} text-white`}>
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-xs text-surface-400 leading-relaxed">
                      {model.description}
                    </p>
                    <span className="text-[10px] text-surface-500 mt-1 block">
                      {model.provider} · {model.value}
                    </span>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center
                                    flex-shrink-0 shadow-glow-sm">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 pt-2 border-t border-surface-700/30">
          <p className="text-[11px] text-surface-500 text-center">
            Los modelos son proporcionados por la API de NVIDIA NIM.
            El cambio se aplica inmediatamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
