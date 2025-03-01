'use client';

import { useCallback, useEffect } from 'react';
import { FormData, ValidationState } from '../types/formTypes';

// Crear un objeto inicial con todos los posibles campos validados
const initialValidationState: ValidationState = {
  // Campos de persona
  numeroDocumento: { isValid: true, message: '' },
  nombres: { isValid: true, message: '' },
  primerApellido: { isValid: true, message: '' },
  segundoApellido: { isValid: true, message: '' },
  email: { isValid: true, message: '' },
  numeroContacto: { isValid: true, message: '' },
  
  // Campos de entidad
  nombre: { isValid: true, message: '' },
  nit: { isValid: true, message: '' },
  telefono: { isValid: true, message: '' },
  
  // Campos de organización
  nombreOrganizacion: { isValid: true, message: '' },
  razonOrganizacion: { isValid: true, message: '' },
  
  // Campos comunes para iniciativa
  tipoProyecto: { isValid: true, message: '' },
  titulo: { isValid: true, message: '' },
  descripcion: { isValid: true, message: '' },
  poblacionBeneficiada: { isValid: true, message: '' },
  valorTotal: { isValid: true, message: '' },
};

/**
 * Hook para manejar la validación de formularios
 */
export const useFormValidation = (
  formData: FormData,
  validationState: ValidationState,
  setValidationState: React.Dispatch<React.SetStateAction<ValidationState>>,
  setIsCurrentStepValid: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Inicializar el estado de validación si es la primera vez
  useEffect(() => {
    if (Object.keys(validationState).length === 0) {
      setValidationState(initialValidationState);
    }
  }, [validationState, setValidationState]);
  
  /**
   * Valida un campo individual según reglas específicas
   */
  const validateField = useCallback((
    field: string, 
    value: any, 
    rules: { 
      required?: boolean, 
      pattern?: RegExp, 
      minLength?: number, 
      maxLength?: number 
    }
  ) => {
    const result = { isValid: true, message: '' };

    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
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
  }, []);

  /**
   * Valida el paso actual según el tipo de remitente
   */
  const validateCurrentStep = useCallback(() => {
    let stepIsValid = true;
    let newValidationState = { ...initialValidationState }; // Usar el estado inicial como base

    // Validación según tipo de remitente y paso actual
    if (formData.tipoRemitente === 'persona') {
      if (formData.paso === 1) {
        // Validar datos de persona paso 1
        newValidationState.numeroDocumento = validateField(
          'numeroDocumento',
          formData.datosPersona?.numeroDocumento,
          { required: true, pattern: /^\d+$/, minLength: 6, maxLength: 12 }
        );

        newValidationState.nombres = validateField(
          'nombres',
          formData.datosPersona?.nombres,
          { required: true, minLength: 2 }
        );

        newValidationState.primerApellido = validateField(
          'primerApellido',
          formData.datosPersona?.primerApellido,
          { required: true, minLength: 2 }
        );

        newValidationState.email = validateField(
          'email',
          formData.datosPersona?.email,
          { 
            required: true, 
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
          }
        );

        newValidationState.numeroContacto = validateField(
          'numeroContacto',
          formData.datosPersona?.numeroContacto,
          { required: true, pattern: /^\d{10}$/ }
        );
      } else if (formData.paso === 2) {
        // Validar datos de persona paso 2
        newValidationState.tipoProyecto = validateField(
          'tipoProyecto',
          formData.datosPersona?.tipoProyecto,
          { required: true }
        );

        newValidationState.titulo = validateField(
          'titulo',
          formData.datosPersona?.titulo,
          { required: true, minLength: 5, maxLength: 100 }
        );

        newValidationState.descripcion = validateField(
          'descripcion',
          formData.datosPersona?.descripcion,
          { required: true, minLength: 10, maxLength: 500 }
        );

        newValidationState.poblacionBeneficiada = validateField(
          'poblacionBeneficiada',
          formData.datosPersona?.poblacionBeneficiada,
          { required: true }
        );

        newValidationState.valorTotal = validateField(
          'valorTotal',
          formData.datosPersona?.valorTotal,
          { 
            required: true, 
            pattern: /^\d+(\.\d+)?$/ // Permite números enteros o decimales
          }
        );
      }
    } 
    // Validación para entidades
    else if (formData.tipoRemitente === 'entidad') {
      if (formData.paso === 1) {
        // Validar datos de entidad paso 1
        newValidationState.nombre = validateField(
          'nombre',
          formData.datosEntidad?.nombre,
          { required: true, minLength: 2 }
        );

        newValidationState.nit = validateField(
          'nit',
          formData.datosEntidad?.nit,
          { required: true, pattern: /^\d{9,10}-?\d?$/ }
        );

        newValidationState.email = validateField(
          'email',
          formData.datosEntidad?.email,
          { 
            required: true, 
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
          }
        );

        newValidationState.telefono = validateField(
          'telefono',
          formData.datosEntidad?.telefono,
          { required: true, pattern: /^\d{10}$/ }
        );
      } else if (formData.paso === 2) {
        // Validar datos de entidad paso 2
        newValidationState.tipoProyecto = validateField(
          'tipoProyecto',
          formData.datosEntidad?.tipoProyecto,
          { required: true }
        );
      
        newValidationState.titulo = validateField(
          'titulo',
          formData.datosEntidad?.titulo,
          { required: true, minLength: 5, maxLength: 100 }
        );
      
        newValidationState.descripcion = validateField(
          'descripcion',
          formData.datosEntidad?.descripcion,
          { required: true, minLength: 10, maxLength: 500 }
        );
      
        newValidationState.poblacionBeneficiada = validateField(
          'poblacionBeneficiada',
          formData.datosEntidad?.poblacionBeneficiada,
          { required: true }
        );
      
        newValidationState.valorTotal = validateField(
          'valorTotal',
          formData.datosEntidad?.valorTotal,
          { 
            required: true, 
            pattern: /^\d+(\.\d+)?$/ // Permite números enteros o decimales
          }
        );
      }
    }
    // Validación para organizaciones
    else if (formData.tipoRemitente === 'organizacion') {
      if (formData.paso === 1) {
        // Validar datos de organización paso 1
        newValidationState.nombreOrganizacion = validateField(
          'nombreOrganizacion',
          formData.datosOrganizacion?.nombreOrganizacion,
          { required: true, minLength: 2 }
        );

        newValidationState.razonOrganizacion = validateField(
          'razonOrganizacion',
          formData.datosOrganizacion?.razonOrganizacion,
          { required: true, pattern: /^\d{9,10}-?\d?$/ }
        );
   
        newValidationState.email = validateField(
          'email',
          formData.datosOrganizacion?.email,
          { 
            required: true, 
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
          }
        );

        newValidationState.numeroContacto = validateField(
          'numeroContacto',
          formData.datosOrganizacion?.numeroContacto,
          { required: true, pattern: /^\d{10}$/ }
        );
      } else if (formData.paso === 2) {
        // Validar datos de organización paso 2
        newValidationState.tipoProyecto = validateField(
          'tipoProyecto',
          formData.datosOrganizacion?.tipoProyecto,
          { required: true }
        );
      
        newValidationState.titulo = validateField(
          'titulo',
          formData.datosOrganizacion?.titulo,
          { required: true, minLength: 5, maxLength: 100 }
        );
      
        newValidationState.descripcion = validateField(
          'descripcion',
          formData.datosOrganizacion?.descripcion,
          { required: true, minLength: 10, maxLength: 500 }
        );
      
        newValidationState.poblacionBeneficiada = validateField(
          'poblacionBeneficiada',
          formData.datosOrganizacion?.poblacionBeneficiada,
          { required: true }
        );
      
        newValidationState.valorTotal = validateField(
          'valorTotal',
          formData.datosOrganizacion?.valorTotal,
          { 
            required: true, 
            pattern: /^\d+(\.\d+)?$/ // Permite números enteros o decimales
          }
        );
      }
    }

    // Verificar si todos los campos relevantes para el paso actual son válidos
    // Solo comprobamos los campos que son relevantes según el paso actual
    const fieldsToCheck = getFieldsForCurrentStep(formData);
    stepIsValid = fieldsToCheck.every(field => 
      newValidationState[field]?.isValid === true
    );

    // Actualizar el estado de validación
    setValidationState(newValidationState);
    setIsCurrentStepValid(stepIsValid);

    return stepIsValid;
  }, [formData, validateField, setValidationState, setIsCurrentStepValid]);

  /**
   * Determina qué campos deben validarse según el paso actual
   */
  const getFieldsForCurrentStep = (formData: FormData): string[] => {
    if (formData.tipoRemitente === 'persona') {
      if (formData.paso === 1) {
        return ['numeroDocumento', 'nombres', 'primerApellido', 'email', 'numeroContacto'];
      } else if (formData.paso === 2) {
        return ['tipoProyecto', 'titulo', 'descripcion', 'poblacionBeneficiada', 'valorTotal'];
      }
    } 
    else if (formData.tipoRemitente === 'entidad') {
      if (formData.paso === 1) {
        return ['nombre', 'nit', 'email', 'telefono'];
      } else if (formData.paso === 2) {
        return ['tipoProyecto', 'titulo', 'descripcion', 'poblacionBeneficiada', 'valorTotal'];
      }
    }
    else if (formData.tipoRemitente === 'organizacion') {
      if (formData.paso === 1) {
        return ['nombreOrganizacion', 'razonOrganizacion', 'email', 'numeroContacto'];
      } else if (formData.paso === 2) {
        return ['tipoProyecto', 'titulo', 'descripcion', 'poblacionBeneficiada', 'valorTotal'];
      }
    }
    return [];
  };

  /**
   * Valida un campo específico y actualiza el estado de validación
   */
  const validateSingleField = useCallback((
    fieldName: string, 
    value: any, 
    rules: { 
      required?: boolean, 
      pattern?: RegExp, 
      minLength?: number, 
      maxLength?: number 
    }
  ) => {
    const result = validateField(fieldName, value, rules);
    
    setValidationState(prev => ({
      ...prev,
      [fieldName]: result
    }));
    
    return result.isValid;
  }, [validateField, setValidationState]);

  return {
    validateField,
    validateCurrentStep,
    validateSingleField,
    validationState
  };
};

export default useFormValidation;