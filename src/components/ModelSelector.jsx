import React from 'react';
import { Cpu } from 'lucide-react';

/**
 * ModelSelector - Componente para seleccionar el modelo de NVIDIA
 *
 * @param {string} selectedModel - Modelo actualmente seleccionado
 * @param {function} onModelChange - Callback cuando cambia el modelo
 */
const ModelSelector = ({ selectedModel, onModelChange }) => {
  // Lista de modelos disponibles en la API de NVIDIA
  // Puedes añadir más modelos según se vayan publicando en la documentación de NVIDIA
  const models = [
    {
      value: 'meta/llama-3.1-405b-instruct',
      label: 'Llama 3.1 405B Instruct',
      description: 'Modelo más potente de Meta'
    },
    {
      value: 'meta/llama-3.1-70b-instruct',
      label: 'Llama 3.1 70B Instruct',
      description: 'Equilibrio rendimiento/calidad'
    },
    {
      value: 'meta/llama-3.1-8b-instruct',
      label: 'Llama 3.1 8B Instruct',
      description: 'Rápido y eficiente'
    },
    {
      value: 'mistralai/mistral-large-2-instruct',
      label: 'Mistral Large 2',
      description: 'Modelo avanzado de Mistral'
    },
    {
      value: 'mistralai/mixtral-8x22b-instruct-v0.1',
      label: 'Mixtral 8x22B Instruct',
      description: 'Arquitectura MoE de Mistral'
    },
    {
      value: 'mistralai/mistral-7b-instruct-v0.3',
      label: 'Mistral 7B Instruct v0.3',
      description: 'Versión más reciente de Mistral 7B'
    },
    {
      value: 'google/gemma-2-27b-it',
      label: 'Gemma 2 27B IT',
      description: 'Modelo de Google optimizado'
    },
    {
      value: 'google/gemma-2-9b-it',
      label: 'Gemma 2 9B IT',
      description: 'Versión ligera de Gemma 2'
    },
    {
      value: 'nvidia/nemotron-4-340b-instruct',
      label: 'Nemotron 4 340B Instruct',
      description: 'Modelo propio de NVIDIA'
    },
    {
      value: 'qwen/qwen2-72b-instruct',
      label: 'Qwen2 72B Instruct',
      description: 'Modelo de Alibaba'
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-dark-400">
        <Cpu className="w-5 h-5 text-primary-500" />
        <span className="text-sm font-medium hidden sm:inline">Modelo:</span>
      </div>

      <div className="relative">
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="input-dark pl-3 pr-10 py-2 text-sm font-medium cursor-pointer
                     appearance-none bg-dark-800 border border-dark-700 rounded-lg
                     hover:border-dark-600 focus:border-primary-500 focus:ring-1
                     focus:ring-primary-500 transition-all duration-200
                     max-w-[200px] sm:max-w-[280px]"
          aria-label="Seleccionar modelo de IA"
        >
          {models.map((model) => (
            <option
              key={model.value}
              value={model.value}
              className="bg-dark-900 text-dark-100"
            >
              {model.label}
            </option>
          ))}
        </select>

        {/* Icono de flecha personalizado */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-dark-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;
