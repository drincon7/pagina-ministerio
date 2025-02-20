import { useState, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import { ValidationState } from '../types/formTypes';

export const useFormValidation = () => {
  const { formData, validationState, updateValidation } = useFormContext();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateCurrentStep();
  }, [formData]);

  const validateCurrentStep = () => {
    let newValidationState: ValidationState = {};
    
    if (formData.tipoRemitente === 'persona' && formData.paso === 1) {
      // Validación paso 1 persona
      const personaData = formData.datosPersona;
      if (personaData) {
        newValidationState = {
          nombres: {
            isValid: !!personaData.nombres,
            message: personaData.nombres ? '' : 'El nombre es requerido'
          },
          primerApellido: {
            isValid: !!personaData.primerApellido,
            message: personaData.primerApellido ? '' : 'El primer apellido es requerido'
          },
          numeroDocumento: {
            isValid: !!personaData.numeroDocumento,
            message: personaData.numeroDocumento ? '' : 'El número de documento es requerido'
          },
          email: {
            isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personaData.email),
            message: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personaData.email) ? '' : 'Email inválido'
          },
          numeroContacto: {
            isValid: !!personaData.numeroContacto,
            message: personaData.numeroContacto ? '' : 'El número de contacto es requerido'
          }
        };
      }
    }

    updateValidation(newValidationState);
    setIsValid(Object.values(newValidationState).every(v => v.isValid));
  };

  return {
    isValid,
    validationState,
    validateCurrentStep,
  };
};



