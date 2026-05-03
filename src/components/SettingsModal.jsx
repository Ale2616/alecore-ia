import React from 'react';
import { X, Cpu, Zap, Brain, Star, Check, Sparkles } from 'lucide-react';

// ============================================================================
// CATÁLOGO DE MODELOS HÍBRIDO (NVIDIA + Google Gemini)
// provider: 'nvidia' → usa el proxy /api/v1/chat/completions + VITE_NVIDIA_API_KEY
// provider: 'google' → llama directo a la API de Gemini  + VITE_GEMINI_API_KEY
// ============================================================================

const MODELS = [
  // ── NVIDIA / Meta ──────────────────────────────────────────────────────────
  {
    id: 'meta/llama-3.1-70b-instruct',
    label: 'Llama 3.1 70B',
    name: 'Llama 3.1 70B (Estable)',
    provider: 'nvidia',
    providerLabel: 'NVIDIA NIM · Meta',
    description: 'Balance perfecto entre rendimiento y velocidad. El más estable.',
    badge: '⭐ Estable',
    badgeColor: 'from-accent-500 to-accent-400',
    icon: Star,
  },
  {
    id: 'meta/llama-3.1-405b-instruct',
    label: 'Llama 3.1 405B',
    name: 'Llama 3.1 405B (Potente)',
    provider: 'nvidia',
    providerLabel: 'NVIDIA NIM · Meta',
    description: 'Máxima potencia y calidad. Responde en modo streaming.',
    badge: '⚡ Potente',
    badgeColor: 'from-amber-500 to-orange-500',
    icon: Zap,
  },
  {
    id: 'nvidia/llama-3.1-nemotron-70b-instruct',
    label: 'Nemotron 70B',
    name: 'Nemotron 70B',
    provider: 'nvidia',
    providerLabel: 'NVIDIA NIM',
    description: 'Optimizado para razonamiento complejo, análisis y lógica.',
    badge: '🧠 Razonamiento',
    badgeColor: 'from-purple-500 to-pink-500',
    icon: Brain,
  },
  // ── Google Gemini ──────────────────────────────────────────────────────────
  {
    id: 'gemini-1.5-pro',
    label: 'Gemini 1.5 Pro',
    name: 'Gemini 1.5 Pro (Google)',
    provider: 'google',
    providerLabel: 'Google AI',
    description: 'El modelo más capaz de Google. Contexto de 1M de tokens.',
    badge: '🌐 Pro',
    badgeColor: 'from-blue-500 to-indigo-500',
    icon: Sparkles,
  },
];

// Exportar para reutilizar en Sidebar y App.jsx
export { MODELS };

// ============================================================================
// COMPONENTE
// ============================================================================

const SettingsModal = ({ isOpen, onClose, selectedModel, onModelChange }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Auto-cierre al seleccionar
  const handleModelSelect = (modelId) => {
    onModelChange(modelId);
    onClose();
  };

  // Agrupar por proveedor para UI organizada
  const nvidiaModels = MODELS.filter(m => m.provider === 'nvidia');
  const googleModels = MODELS.filter(m => m.provider === 'google');

  const ModelCard = ({ model }) => {
    const isSelected = selectedModel === model.id;
    const Icon = model.icon;
    return (
      <button
        key={model.id}
        onClick={() => handleModelSelect(model.id)}
        className={`w-full text-left p-4 rounded-xl border transition-all duration-300
                   group relative overflow-hidden
                   ${isSelected
                     ? 'border-accent-500/60 bg-accent-500/10 shadow-glow-sm'
                     : 'border-surface-700/40 bg-surface-800/40 hover:border-surface-600/60 hover:bg-surface-700/30'
                   }`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                          ${isSelected
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'bg-surface-700/50 text-surface-400 group-hover:text-surface-300'
                          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`font-semibold text-sm ${isSelected ? 'text-accent-300' : 'text-surface-100'}`}>
                {model.label}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${model.badgeColor} text-white`}>
                {model.badge}
              </span>
            </div>
            <p className="text-xs text-surface-400 leading-relaxed">{model.description}</p>
            <span className="text-[10px] text-surface-500 mt-1 block">{model.providerLabel} · {model.id}</span>
          </div>
          {isSelected && (
            <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-panel-solid rounded-2xl shadow-2xl shadow-accent-500/10 animate-slide-up overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-surface-50">Modelo de IA</h2>
              <p className="text-xs text-surface-400">Toca uno para seleccionarlo y cerrar</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost rounded-xl" aria-label="Cerrar configuración">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model List */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">

          {/* ── NVIDIA Group ── */}
          <div>
            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
              NVIDIA NIM
            </p>
            <div className="space-y-2">
              {nvidiaModels.map(m => <ModelCard key={m.id} model={m} />)}
            </div>
          </div>

          {/* ── Google Group ── */}
          <div>
            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
              Google Gemini
            </p>
            <div className="space-y-2">
              {googleModels.map(m => <ModelCard key={m.id} model={m} />)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-700/30">
          <p className="text-[11px] text-surface-500 text-center">
            NVIDIA requiere <code className="bg-surface-800 px-1 rounded">VITE_NVIDIA_API_KEY</code> · Google requiere <code className="bg-surface-800 px-1 rounded">VITE_GEMINI_API_KEY</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
