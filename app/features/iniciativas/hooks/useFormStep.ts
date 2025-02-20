// src/features/iniciativas/hooks/useFormStep.ts

import { useFormContext } from '../context/FormContext';
import { TipoRemitente } from '../types/formTypes';

export const useFormStep = () => {
  const { formData, nextStep, prevStep } = useFormContext();

  const getMaxSteps = (tipoRemitente: TipoRemitente): number => {
    switch (tipoRemitente) {
      case 'persona':
        return 2; // Por ahora solo tenemos 2 pasos para persona
      case 'entidad':
        return 1; // Por ahora solo tenemos 1 paso para entidad
      case 'organizacion':
        return 1; // Por ahora solo tenemos 1 paso para organización
      default:
        return 1;
    }
  };

  const canProceed = (): boolean => {
    const maxSteps = getMaxSteps(formData.tipoRemitente);
    return formData.paso < maxSteps;
  };

  const canGoBack = (): boolean => {
    return formData.paso > 1;
  };

  return {
    currentStep: formData.paso,
    maxSteps: getMaxSteps(formData.tipoRemitente),
    canProceed,
    canGoBack,
    nextStep,
    prevStep,
  };
};

