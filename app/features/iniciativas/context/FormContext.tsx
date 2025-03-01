'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { FormData, ValidationState } from '../types/formTypes';
import { useFormStorage } from '../hooks/useFormStorage';
import { useFormValidation } from '../hooks/useFormValidation';

interface FormContextType {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  resetForm: () => void;
  nextStep: () => void;
  prevStep: () => void;
  maxSteps: number;
  validationState: ValidationState;
  setValidationState: React.Dispatch<React.SetStateAction<ValidationState>>;
  isCurrentStepValid: boolean;
  validateCurrentStep: () => boolean;
}

// Valores iniciales del formulario
const initialFormData: FormData = {
  paso: 1,
  tipoRemitente: 'persona', // Valores posibles: 'persona', 'entidad', 'organizacion'
  datosPersona: {
    remitenteId: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    numeroContacto: '',
    tipoProyecto: '',
    titulo: '',
    descripcion: '',
    poblacionBeneficiada: '',
    valorTotal: ''
  },
  datosEntidad: {
    remitenteId: '',
    nombre: '',
    nit: '',
    email: '',
    telefono: '',
    tipoProyecto: '',
    titulo: '',
    descripcion: '',
    poblacionBeneficiada: '',
    valorTotal: ''
  },
  datosOrganizacion: {
    remitenteId: '',
    nombreOrganizacion: '',
    razonOrganizacion: '',
    tipoDocumento: 'NIT',
    numeroDocumento: '',
    email: '',
    numeroContacto: '',
    tipoProyecto: '',
    titulo: '',
    descripcion: '',
    poblacionBeneficiada: '',
    valorTotal: ''
  }
};

// Estado inicial de validación (ahora se inicializa desde useFormValidation)
const initialValidationState: ValidationState = {};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estados del formulario
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validationState, setValidationState] = useState<ValidationState>(initialValidationState);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  
  // Actualizar el formulario
  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prevData => {
      const newData = { ...prevData, ...updates };
      
      // Si hay actualizaciones específicas de tipo de remitente, fusionarlas correctamente
      if (updates.datosPersona && prevData.datosPersona) {
        newData.datosPersona = { ...prevData.datosPersona, ...updates.datosPersona };
      }
      
      if (updates.datosEntidad && prevData.datosEntidad) {
        newData.datosEntidad = { ...prevData.datosEntidad, ...updates.datosEntidad };
      }
      
      if (updates.datosOrganizacion && prevData.datosOrganizacion) {
        newData.datosOrganizacion = { ...prevData.datosOrganizacion, ...updates.datosOrganizacion };
      }
      
      return newData;
    });
  }, []);
  
  // Utilizar el hook de almacenamiento
  const { saveFormToStorage, loadFormFromStorage, clearFormStorage } = useFormStorage(formData, updateFormData);
  
  // Utilizar el hook de validación
  const { validateCurrentStep } = useFormValidation(
    formData, 
    validationState, 
    setValidationState,
    setIsCurrentStepValid
  );
  
  // Cargar datos al iniciar
  useEffect(() => {
    if (!isDataLoaded) {
      const loaded = loadFormFromStorage();
      setIsDataLoaded(true);
      
      // Si no se cargaron datos, asegurarnos de que haya valores iniciales
      if (!loaded) {
        setFormData(initialFormData);
      }
    }
  }, [isDataLoaded, loadFormFromStorage]);
  
  // Reiniciar el formulario
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setValidationState(initialValidationState);
    clearFormStorage();
  }, [clearFormStorage]);
  
  // Avanzar al siguiente paso
  const nextStep = useCallback(() => {
    setFormData(prevData => ({
      ...prevData,
      paso: prevData.paso + 1
    }));
  }, []);
  
  // Retroceder al paso anterior
  const prevStep = useCallback(() => {
    setFormData(prevData => ({
      ...prevData,
      paso: Math.max(1, prevData.paso - 1)
    }));
  }, []);
  
  // Determinar el número máximo de pasos según el tipo de remitente
  const getMaxSteps = useCallback(() => {
    switch (formData.tipoRemitente) {
      case 'persona':
        return 3;
      case 'entidad':
      case 'organizacion':
        return 2;
      default:
        return 1;
    }
  }, [formData.tipoRemitente]);
  
  // Ejecutar validación cuando cambia el paso o tipo de remitente
  useEffect(() => {
    validateCurrentStep();
  }, [formData.paso, formData.tipoRemitente, validateCurrentStep]);
  
  // Guardar datos cuando cambian
  useEffect(() => {
    if (formData.tipoRemitente) {
      saveFormToStorage();
    }
  }, [formData, saveFormToStorage]);
  
  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        resetForm,
        nextStep,
        prevStep,
        maxSteps: getMaxSteps(),
        validationState,
        setValidationState,
        isCurrentStepValid,
        validateCurrentStep
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext debe ser usado dentro de un FormProvider');
  }
  return context;
};