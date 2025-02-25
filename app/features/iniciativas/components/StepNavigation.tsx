'use client';

import React, { useEffect } from 'react';
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

  const handlePrev = () => {
    console.log('Handle Previous clicked', {
      currentStep: formData.paso
    });
    prevStep();
  };

  const handleSubmit = () => {
    // Aquí puedes implementar la lógica de envío del formulario
    console.log('Formulario enviado:', formData);
    // Ejemplo: llamada a API, validaciones finales, etc.
  };

  // Determinar el último paso según el tipo de remitente
  const isLastStep = () => {
    switch (formData.tipoRemitente) {
      case 'persona':
        return formData.paso === 3;
      case 'entidad':
      case 'organizacion':
        return formData.paso === 2; // Asumiendo que estos tienen menos pasos
      default:
        return false;
    }
  };

  return (
    <div className="flex justify-between mt-6">
      {formData.paso > 1 && (
        <button
          onClick={handlePrev}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Volver
        </button>
      )}
      
      {!isLastStep() ? (
        <button
          onClick={handleNext}
          disabled={!isCurrentStepValid}
          className={`px-6 py-2 rounded-md ml-auto transition-colors ${
            isCurrentStepValid 
              ? "bg-pink-500 text-white hover:bg-pink-600" 
              : "bg-pink-300 text-white cursor-not-allowed"
          }`}
        >
          Siguiente
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!isCurrentStepValid}
          className={`px-6 py-2 rounded-md ml-auto transition-colors ${
            isCurrentStepValid 
              ? "bg-pink-500 text-white hover:bg-pink-600" 
              : "bg-pink-300 text-white cursor-not-allowed"
          }`}
        >
          Finalizar y enviar
        </button>
      )}
    </div>
  );
};

export default StepNavigation;