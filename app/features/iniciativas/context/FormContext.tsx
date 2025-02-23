'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FormData, ValidationState, ValidationField, TipoRemitente } from '../types/formTypes';

interface FormContextType {
  formData: FormData;
  validationState: ValidationState;
  updateFormData: (data: Partial<FormData>) => void;
  updateValidation: (validation: Partial<ValidationState>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
  maxSteps: number;
  canProceed: boolean;
  isCurrentStepValid: boolean;
}

const initialFormData: FormData = {
  tipoRemitente: 'persona',
  paso: 1,
  datosPersona: {
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    email: '',
    numeroContacto: '',
    tipoProyecto: 'SOCIAL',
    titulo: '',
    descripcion: '',
    localizaciones: [{ departamento: '', ciudad: '' }], // Inicializamos con una localización
    poblacionBeneficiada: '',
    valorTotal: '',
    documentos: {
      cartaPresentacion: null,
      anexoTecnico: null,
      mgaNacional: null
    }
  }
};

const getMaxSteps = (tipoRemitente: TipoRemitente): number => {
  switch (tipoRemitente) {
    case 'persona':
      return 3;
    case 'entidad':
    case 'organizacion':
      return 1;
    default:
      return 1;
  }
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validationState, setValidationState] = useState<ValidationState>({});

  // Persistencia en localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prevData => ({
          ...initialFormData,
          ...parsedData,
          datosPersona: {
            ...initialFormData.datosPersona,
            ...(parsedData.datosPersona || {})
          }
        }));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
      datosPersona: data.datosPersona ? {
        ...prev.datosPersona,
        ...data.datosPersona
      } : prev.datosPersona
    }));
  }, []);

  const updateValidation = useCallback((validation: Partial<ValidationState>) => {
    setValidationState(prev => {
      const newValidation: ValidationState = { ...prev };
      
      Object.entries(validation).forEach(([key, value]) => {
        if (value) {
          newValidation[key] = {
            isValid: value.isValid,
            message: value.message
          } as ValidationField;
        }
      });
      
      return newValidation;
    });
  }, []);

  const maxSteps = getMaxSteps(formData.tipoRemitente);
  const canProceed = formData.paso < maxSteps;

  // Validación del paso actual
  const isCurrentStepValid = useCallback(() => {
    console.log('Current validation state:', validationState);
    const currentStepFields = Object.values(validationState);
  
    if (currentStepFields.length === 0) {
      return false; // Si no hay campos para validar, no es válido
    }
    
    const allFieldsValid = currentStepFields.every((field): field is ValidationField => 
      field !== undefined && field.isValid === true
    );
    
    // Añade console.log para debugging
    console.log('All fields valid?', allFieldsValid);
    
    return allFieldsValid;
  }, [validationState]);
  

// En FormContext.tsx

const nextStep = useCallback(() => {
  console.log('nextStep called', {
    currentStep: formData.paso,
    maxSteps,
    isValid: isCurrentStepValid()
  });

  if (formData.paso < maxSteps && isCurrentStepValid()) {
    setFormData(prev => {
      const newStep = prev.paso + 1;
      console.log('Updating to step:', newStep);
      return {
        ...prev,
        paso: newStep
      };
    });
  }
}, [formData.paso, maxSteps, isCurrentStepValid]);

  const prevStep = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      paso: Math.max(1, prev.paso - 1)
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setValidationState({});
    localStorage.removeItem('formData');
  }, []);

  const value = {
    formData,
    validationState,
    updateFormData,
    updateValidation,
    nextStep,
    prevStep,
    resetForm,
    maxSteps,
    canProceed,
    isCurrentStepValid: isCurrentStepValid()
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};