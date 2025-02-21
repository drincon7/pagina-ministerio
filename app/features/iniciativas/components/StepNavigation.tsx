'use client';

import React from 'react';
import { useFormStep } from '../hooks/useFormStep';
import { useFormValidation } from '../hooks/useFormValidation';

const StepNavigation: React.FC = () => {
  const { currentStep, maxSteps, nextStep, prevStep } = useFormStep();
  const { isValid } = useFormValidation();

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={prevStep}
        className={`px-6 py-2 rounded-md text-sm font-medium
          ${currentStep === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        disabled={currentStep === 1}
      >
        Volver
      </button>

      {currentStep < maxSteps ? (
        <button
          type="button"
          onClick={nextStep}
          className={`px-6 py-2 rounded-md text-sm font-medium 
            ${!isValid
              ? 'bg-pink-300 text-white cursor-not-allowed'
              : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
          disabled={!isValid}
        >
          Siguiente
        </button>
      ) : (
        <button
          type="button"
          className={`px-6 py-2 rounded-md text-sm font-medium 
            ${!isValid
              ? 'bg-pink-300 text-white cursor-not-allowed'
              : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
          disabled={!isValid}
        >
          Finalizar y enviar
        </button>
      )}
    </div>
  );
};

export default StepNavigation;