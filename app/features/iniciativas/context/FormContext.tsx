'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormData, ValidationState } from '../types/formTypes';

interface FormContextType {
  formData: FormData;
  validationState: ValidationState;
  updateFormData: (data: Partial<FormData>) => void;
  updateValidation: (validation: Partial<ValidationState>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

// Estado inicial con todos los campos requeridos
const initialFormData: FormData = {
  tipoRemitente: 'persona',
  paso: 1,
  datosPersona: {
    // Inicializamos con valores vacíos pero válidos para TypeScript
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    email: '',
    numeroContacto: '',
    // Campos del paso 2 inicializados
    tipoProyecto: 'SOCIAL',
    titulo: '',
    descripcion: '',
    localizaciones: [],
    poblacionBeneficiada: '',
    valorTotal: ''
  }
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validationState, setValidationState] = useState<ValidationState>({});

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Asegurarnos de que los datos cargados tienen la estructura correcta
        setFormData({
          ...initialFormData,
          ...parsedData,
          datosPersona: {
            ...initialFormData.datosPersona,
            ...(parsedData.datosPersona || {})
          }
        });
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        setFormData(initialFormData);
      }
    }
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => {
      // Si se actualizan los datos de persona, asegurarnos de mantener la estructura
      if (data.datosPersona) {
        return {
          ...prev,
          ...data,
          datosPersona: {
            ...prev.datosPersona,
            ...data.datosPersona
          }
        };
      }
      return {
        ...prev,
        ...data
      };
    });
  };

  const updateValidation = (validation: Partial<ValidationState>) => {
    setValidationState(prev => {
      const newValidation: ValidationState = { ...prev };
      // Asegurarnos de que cada campo tenga la estructura correcta
      Object.entries(validation).forEach(([key, value]) => {
        if (value) {
          newValidation[key] = {
            isValid: value.isValid,
            message: value.message
          };
        }
      });
      return newValidation;
    });
  };

  const nextStep = () => {
    setFormData(prev => ({
      ...prev,
      paso: prev.paso + 1,
    }));
  };

  const prevStep = () => {
    setFormData(prev => ({
      ...prev,
      paso: Math.max(1, prev.paso - 1),
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setValidationState({});
    localStorage.removeItem('formData');
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        validationState,
        updateFormData,
        updateValidation,
        nextStep,
        prevStep,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};