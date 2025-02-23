'use client';

import React from 'react';
import { useEffect } from 'react';
import { useFormContext } from '../context/FormContext';

const StepNavigation: React.FC = () => {
  const { 
    formData,
    maxSteps,
    nextStep,
    prevStep,
    isCurrentStepValid,
    validationState
  } = useFormContext();

  useEffect(() => {
    console.log('Step Navigation - Current Step:', formData.paso);
    console.log('Is Step Valid:', isCurrentStepValid);
    console.log('Validation State:', validationState);
  }, [formData.paso, isCurrentStepValid, validationState]);

  const handleNext = () => {
    console.log('Handle Next clicked', {
      currentStep: formData.paso,
      isValid: isCurrentStepValid
    });
    nextStep();
  };

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={prevStep}
        className={`px-6 py-2 rounded-md text-sm font-medium
          ${formData.paso === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        disabled={formData.paso === 1}
      >
        Volver
      </button>

      {formData.paso < maxSteps ? (
        <button
          type="button"
          onClick={handleNext}
          className={`px-6 py-2 rounded-md text-sm font-medium 
            ${!isCurrentStepValid
              ? 'bg-pink-300 text-white cursor-not-allowed'
              : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
          disabled={!isCurrentStepValid}
        >
          Siguiente
        </button>
      ) : (
        <button
          type="button"
          className={`px-6 py-2 rounded-md text-sm font-medium 
            ${!isCurrentStepValid
              ? 'bg-pink-300 text-white cursor-not-allowed'
              : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
          disabled={!isCurrentStepValid}
        >
          Finalizar y enviar
        </button>
      )}
    </div>
  );
};

export default StepNavigation;