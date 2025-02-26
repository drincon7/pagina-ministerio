'use client';

import { useCallback } from 'react';
import { useFormContext } from '../context/FormContext';
import { ValidationState, ValidationResult } from '../types/formTypes';

export const useFormValidation = () => {
  const { 
    formData, 
    validationState, 
    setValidationState,
    isCurrentStepValid,
    validateCurrentStep: contextValidateCurrentStep
  } = useFormContext();

  // Esta función simplemente delega la validación al contexto
  // para evitar problemas de bucles infinitos
  const validateCurrentStep = useCallback(() => {
    // Llamamos a la función de validación del contexto
    return contextValidateCurrentStep();
  }, [contextValidateCurrentStep]);

  return {
    validationState,
    isCurrentStepValid,
    validateCurrentStep,
  };
};

export default useFormValidation;