'use client';

import React from 'react';

interface NavigationButtonsProps {
  currentStep: number;
  isLastStep: boolean;
  isCurrentStepValid: boolean;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

/**
 * Componente para mostrar los botones de navegación entre pasos
 */
const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  isLastStep,
  isCurrentStepValid,
  loading,
  onPrevious,
  onNext,
  onSubmit
}) => {
  return (
    <div className="flex justify-between mt-6">
      {/* Botón Anterior / Volver */}
      {currentStep > 1 && (
        <button
          onClick={onPrevious}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
          disabled={loading}
          aria-label="Volver al paso anterior"
          type="button"
        >
          Volver
        </button>
      )}
      
      {/* Botón Siguiente o Finalizar */}
      {!isLastStep ? (
        <button
          onClick={onNext}
          disabled={!isCurrentStepValid || loading}
          className={`px-6 py-2 rounded-md ml-auto transition-colors ${
            isCurrentStepValid && !loading
              ? "bg-pink-500 text-white hover:bg-pink-600" 
              : "bg-pink-300 text-white cursor-not-allowed"
          }`}
          aria-label="Continuar al siguiente paso"
          type="button"
        >
          {loading ? "Procesando..." : "Siguiente"}
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={!isCurrentStepValid || loading}
          className={`px-6 py-2 rounded-md ml-auto transition-colors ${
            isCurrentStepValid && !loading
              ? "bg-pink-500 text-white hover:bg-pink-600" 
              : "bg-pink-300 text-white cursor-not-allowed"
          }`}
          aria-label="Finalizar el formulario"
          type="button"
        >
          {loading ? "Procesando..." : "Finalizar y enviar"}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;