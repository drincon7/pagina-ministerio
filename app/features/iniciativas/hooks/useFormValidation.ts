'use client';

import { useCallback } from 'react';
import { FormData, ValidationState } from '../types/formTypes';

/**
 * Hook para manejar la validación de formularios
 */
export const useFormValidation = (
  formData: FormData,
  validationState: ValidationState,
  setValidationState: React.Dispatch<React.SetStateAction<ValidationState>>,
  setIsCurrentStepValid: React.Dispatch<React.SetStateAction<boolean>>
) => {
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
    let newValidationState: ValidationState = {};

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
      // Validaciones para el paso 3 si es necesario
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

    // Verificar si todos los campos validados son válidos
    stepIsValid = Object.values(newValidationState).every(result => result?.isValid === true);

    // Actualizar el estado de validación
    setValidationState(newValidationState);
    setIsCurrentStepValid(stepIsValid);

    return stepIsValid;
  }, [formData, validateField, setValidationState, setIsCurrentStepValid]);

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