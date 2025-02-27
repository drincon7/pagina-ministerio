'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { FormData, ValidationState, ValidationResult } from '../types/formTypes';

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

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validationState, setValidationState] = useState<ValidationState>({});
  const [isCurrentStepValid, setIsCurrentStepValid] = useState<boolean>(false);

  // Actualizar el formulario
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...updates
    }));
  };

  // Reiniciar el formulario
  const resetForm = () => {
    setFormData(initialFormData);
    setValidationState({});
  };

  // Avanzar al siguiente paso
  const nextStep = () => {
    setFormData(prevData => ({
      ...prevData,
      paso: prevData.paso + 1
    }));
  };

  // Retroceder al paso anterior
  const prevStep = () => {
    setFormData(prevData => ({
      ...prevData,
      paso: Math.max(1, prevData.paso - 1)
    }));
  };

  // Determinar el número máximo de pasos según el tipo de remitente
  const getMaxSteps = () => {
    switch (formData.tipoRemitente) {
      case 'persona':
        return 3;
      case 'entidad':
      case 'organizacion':
        return 2;
      default:
        return 1;
    }
  };

  // Función de validación para cada campo
  const validateField = (field: string, value: any, rules: { required?: boolean, pattern?: RegExp, minLength?: number, maxLength?: number }): ValidationResult => {
    const result: ValidationResult = { isValid: true, message: '' };

    if (rules.required && (!value || value.trim() === '')) {
      result.isValid = false;
      result.message = 'Este campo es obligatorio';
      return result;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      result.isValid = false;
      result.message = 'Formato inválido';
      return result;
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      result.isValid = false;
      result.message = `Mínimo ${rules.minLength} caracteres`;
      return result;
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      result.isValid = false;
      result.message = `Máximo ${rules.maxLength} caracteres`;
      return result;
    }

    return result;
  };

  // Validar el paso actual
  const validateCurrentStep = useCallback(() => {
    let stepIsValid = true;
    let newValidationState: ValidationState = {};

    // Validación según tipo de remitente y paso actual
    if (formData.tipoRemitente === 'persona') {
      if (formData.paso === 1) {
        // Validar Número de Documento
        newValidationState.numeroDocumento = validateField(
          'numeroDocumento',
          formData.datosPersona?.numeroDocumento,
          { required: true, pattern: /^\d+$/, minLength: 6, maxLength: 12 }
        );

        // Validar Nombres
        newValidationState.nombres = validateField(
          'nombres',
          formData.datosPersona?.nombres,
          { required: true, minLength: 2 }
        );

        // Validar Primer Apellido
        newValidationState.primerApellido = validateField(
          'primerApellido',
          formData.datosPersona?.primerApellido,
          { required: true, minLength: 2 }
        );

        // Validar Email
        newValidationState.email = validateField(
          'email',
          formData.datosPersona?.email,
          { 
            required: true, 
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
          }
        );

        // Validar Número de Contacto
        newValidationState.numeroContacto = validateField(
          'numeroContacto',
          formData.datosPersona?.numeroContacto,
          { required: true, pattern: /^\d{10}$/ }
        );
      } else if (formData.paso === 2) {
        // Validar Tipo de Proyecto
        newValidationState.tipoProyecto = validateField(
          'tipoProyecto',
          formData.datosPersona?.tipoProyecto,
          { required: true }
        );

        // Validar Título
        newValidationState.titulo = validateField(
          'titulo',
          formData.datosPersona?.titulo,
          { required: true, minLength: 5, maxLength: 100 }
        );

        // Validar Descripción
        newValidationState.descripcion = validateField(
          'descripcion',
          formData.datosPersona?.descripcion,
          { required: true, minLength: 10, maxLength: 500 }
        );

        // Validar Población Beneficiada
        newValidationState.poblacionBeneficiada = validateField(
          'poblacionBeneficiada',
          formData.datosPersona?.poblacionBeneficiada,
          { required: true }
        );

        // Validar Valor Total
        newValidationState.valorTotal = validateField(
          'valorTotal',
          formData.datosPersona?.valorTotal,
          { 
            required: true, 
            pattern: /^\d+(\.\d+)?$/ // Permite números enteros o decimales
          }
        );
      }
      // Puedes añadir validación para paso 3 aquí si lo necesitas
    }
    // Validación para entidades
    else if (formData.tipoRemitente === 'entidad' && formData.paso === 1) {
      // Validar Nombre
      newValidationState.nombre = validateField(
        'nombre',
        formData.datosEntidad?.nombre,
        { required: true, minLength: 2 }
      );

      // Validar NIT
      newValidationState.nit = validateField(
        'nit',
        formData.datosEntidad?.nit,
        { required: true, pattern: /^\d{9,10}-?\d?$/ }
      );

      // Validar Email
      newValidationState.email = validateField(
        'email',
        formData.datosEntidad?.email,
        { 
          required: true, 
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
        }
      );

      // Validar Teléfono
      newValidationState.telefono = validateField(
        'telefono',
        formData.datosEntidad?.telefono,
        { required: true, pattern: /^\d{10}$/ }
      );
    }

    else if (formData.tipoRemitente === 'entidad' && formData.paso === 2) {
      // Validar Tipo de Proyecto
      newValidationState.tipoProyecto = validateField(
        'tipoProyecto',
        formData.datosEntidad?.tipoProyecto,
        { required: true }
      );
    
      // Validar Título
      newValidationState.titulo = validateField(
        'titulo',
        formData.datosEntidad?.titulo,
        { required: true, minLength: 5, maxLength: 100 }
      );
    
      // Validar Descripción
      newValidationState.descripcion = validateField(
        'descripcion',
        formData.datosEntidad?.descripcion,
        { required: true, minLength: 10, maxLength: 500 }
      );
    
      // Validar Población Beneficiada
      newValidationState.poblacionBeneficiada = validateField(
        'poblacionBeneficiada',
        formData.datosEntidad?.poblacionBeneficiada,
        { required: true }
      );
    
      // Validar Valor Total
      newValidationState.valorTotal = validateField(
        'valorTotal',
        formData.datosEntidad?.valorTotal,
        { 
          required: true, 
          pattern: /^\d+(\.\d+)?$/ // Permite números enteros o decimales
        }
      );
    }

    // Validación para organizaciones
    else if (formData.tipoRemitente === 'organizacion' && formData.paso === 1) {
      // Validar Nombre de Organización
      newValidationState.nombreOrganizacion = validateField(
        'nombreOrganizacion',
        formData.datosOrganizacion?.nombreOrganizacion,
        { required: true, minLength: 2 }
      );

      // Validar Razón Social
      newValidationState.razonOrganizacion = validateField(
        'razonOrganizacion',
        formData.datosOrganizacion?.razonOrganizacion,
        { required: true, pattern: /^\d{9,10}-?\d?$/ }
      );
   
      // Validar Email
      newValidationState.email = validateField(
        'email',
        formData.datosOrganizacion?.email,
        { 
          required: true, 
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
        }
      );

      // Validar Número de Contacto
      newValidationState.numeroContacto = validateField(
        'numeroContacto',
        formData.datosOrganizacion?.numeroContacto,
        { required: true, pattern: /^\d{10}$/ }
      );
    }

    // Agregar validaciones para otros pasos según sea necesario...

    // Verificar si todos los campos validados son válidos
    stepIsValid = Object.values(newValidationState).every(result => result?.isValid === true);

    // Actualizar el estado de validación
    setValidationState(newValidationState);
    setIsCurrentStepValid(stepIsValid);

    return stepIsValid;
  }, [formData]); // Solo depender de formData, no de validationState

  // Ejecutar validación cuando cambia el paso o tipo de remitente
  useEffect(() => {
    validateCurrentStep();
  }, [formData.paso, formData.tipoRemitente, validateCurrentStep]);

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

export default FormContext;