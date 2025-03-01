'use client';

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useFormContext } from '../context/FormContext';
import { ValidationResult } from '../types/formTypes';

type FieldType = 'persona' | 'entidad' | 'organizacion';

interface ValidationRules {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  customValidator?: (value: any) => ValidationResult;
}

/**
 * Hook personalizado para manejar campos de formulario con validación y
 * almacenamiento automático en el contexto (que a su vez se guarda en localStorage)
 */
export const useFormField = (
  fieldName: string,
  fieldType: FieldType,
  validationRules?: ValidationRules
) => {
  const { formData, updateFormData, validationState, setValidationState, registerFieldValidator } = useFormContext();
  
  // Determinar el valor actual del campo según el tipo de remitente
  const getCurrentValue = (): string => {
    if (fieldType === 'persona' && formData.datosPersona) {
      return (formData.datosPersona[fieldName as keyof typeof formData.datosPersona] as string) || '';
    } else if (fieldType === 'entidad' && formData.datosEntidad) {
      return (formData.datosEntidad[fieldName as keyof typeof formData.datosEntidad] as string) || '';
    } else if (fieldType === 'organizacion' && formData.datosOrganizacion) {
      return (formData.datosOrganizacion[fieldName as keyof typeof formData.datosOrganizacion] as string) || '';
    }
    return '';
  };
  
  // Estado local para el valor del campo
  const [value, setValue] = useState<string>(getCurrentValue());
  
  // Estado para la validación
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    message: ''
  });
  
  // Añadir estado para controlar cuándo mostrar errores
  const [showValidationError, setShowValidationError] = useState<boolean>(false);
  
  // Sincronizar el estado local cuando cambia el contexto
  useEffect(() => {
    setValue(getCurrentValue());
  }, [formData]);
  
  // Actualizar validación cuando cambia el estado de validación en el contexto
  useEffect(() => {
    const currentValidation = validationState[fieldName];
    if (currentValidation) {
      setValidation(currentValidation);
    }
  }, [validationState, fieldName]);
  
  // Validar el campo
  const validateField = (fieldValue: string): ValidationResult => {
    if (!validationRules) {
      return { isValid: true, message: '' };
    }
    
    // Verificar regla de campo requerido
    if (validationRules.required && (!fieldValue || fieldValue.trim() === '')) {
      return { isValid: false, message: 'Este campo es obligatorio' };
    }
    
    // Verificar regla de patrón
    if (fieldValue && validationRules.pattern && !validationRules.pattern.test(fieldValue)) {
      return { isValid: false, message: 'Formato inválido' };
    }
    
    // Verificar longitud mínima
    if (fieldValue && validationRules.minLength && fieldValue.length < validationRules.minLength) {
      return { 
        isValid: false, 
        message: `Mínimo ${validationRules.minLength} caracteres` 
      };
    }
    
    // Verificar longitud máxima
    if (fieldValue && validationRules.maxLength && fieldValue.length > validationRules.maxLength) {
      return { 
        isValid: false, 
        message: `Máximo ${validationRules.maxLength} caracteres` 
      };
    }
    
    // Verificar validador personalizado
    if (validationRules.customValidator) {
      return validationRules.customValidator(fieldValue);
    }
    
    return { isValid: true, message: '' };
  };
  
  // Manejar cambios en el campo
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Validar el campo pero no mostrar el error inmediatamente
    const validationResult = validateField(newValue);
    
    // Actualizar la validación en el contexto pero no mostrarla visualmente
    setValidation(validationResult);
    
    // Actualizar el estado de validación en el contexto
    setValidationState(prev => ({
      ...prev,
      [fieldName]: validationResult
    }));
    
    // Actualizar el valor en el contexto (y por ende en localStorage)
    if (fieldType === 'persona') {
      updateFormData({
        datosPersona: {
          ...formData.datosPersona,
          [fieldName]: newValue
        }
      });
    } else if (fieldType === 'entidad') {
      updateFormData({
        datosEntidad: {
          ...formData.datosEntidad,
          [fieldName]: newValue
        }
      });
    } else if (fieldType === 'organizacion') {
      updateFormData({
        datosOrganizacion: {
          ...formData.datosOrganizacion,
          [fieldName]: newValue
        }
      });
    }
  };
  
  // Actualizar manualmente el valor
  const updateValue = (newValue: string) => {
    setValue(newValue);
    
    // Validar el campo
    const validationResult = validateField(newValue);
    setValidation(validationResult);
    
    // Actualizar el estado de validación en el contexto
    setValidationState(prev => ({
      ...prev,
      [fieldName]: validationResult
    }));
    
    // Actualizar el valor en el contexto (y por ende en localStorage)
    if (fieldType === 'persona') {
      updateFormData({
        datosPersona: {
          ...formData.datosPersona,
          [fieldName]: newValue
        }
      });
    } else if (fieldType === 'entidad') {
      updateFormData({
        datosEntidad: {
          ...formData.datosEntidad,
          [fieldName]: newValue
        }
      });
    } else if (fieldType === 'organizacion') {
      updateFormData({
        datosOrganizacion: {
          ...formData.datosOrganizacion,
          [fieldName]: newValue
        }
      });
    }
  };
  
  // Función para mostrar los errores de validación
  const showErrors = () => {
    setShowValidationError(true);
  };

  // Registrar la función showErrors en el contexto
  useEffect(() => {
    // Verificar si registerFieldValidator es una función
    if (typeof registerFieldValidator === 'function') {
      return registerFieldValidator(showErrors);
    }
    
    // Si no es una función, simplemente retorna una función de limpieza vacía
    return () => {};
  }, [registerFieldValidator]);
  
  return {
    value,
    validation,
    handleChange,
    updateValue,
    showErrors,
    showValidationError
  };
};

export default useFormField;