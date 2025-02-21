'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import type { ValidationState, FormData } from '../types/formTypes';

export const useFormValidation = () => {
  const { formData, validationState, updateValidation } = useFormContext();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateCurrentStep();
  }, [formData]);

  const validateCurrentStep = () => {
    let newValidationState: ValidationState = {};
    
    if (formData.tipoRemitente === 'persona') {
      switch (formData.paso) {
        case 1:
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
                isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personaData.email || ''),
                message: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personaData.email || '') ? '' : 'Email inválido'
              },
              numeroContacto: {
                isValid: !!personaData.numeroContacto,
                message: personaData.numeroContacto ? '' : 'El número de contacto es requerido'
              }
            };
          }
          break;

        case 2:
          const step2Data = formData.datosPersona;
          if (step2Data) {
            newValidationState = {
              tipoProyecto: {
                isValid: !!step2Data.tipoProyecto,
                message: step2Data.tipoProyecto ? '' : 'El tipo de proyecto es requerido'
              },
              titulo: {
                isValid: !!step2Data.titulo && step2Data.titulo.length <= 100,
                message: !step2Data.titulo ? 'El título es requerido' : 
                        step2Data.titulo.length > 100 ? 'El título no debe exceder 100 caracteres' : ''
              },
              descripcion: {
                isValid: !!step2Data.descripcion && step2Data.descripcion.length <= 500,
                message: !step2Data.descripcion ? 'La descripción es requerida' : 
                        step2Data.descripcion.length > 500 ? 'La descripción no debe exceder 500 caracteres' : ''
              },
              poblacionBeneficiada: {
                isValid: !!step2Data.poblacionBeneficiada,
                message: step2Data.poblacionBeneficiada ? '' : 'La población beneficiada es requerida'
              },
              valorTotal: {
                isValid: !!step2Data.valorTotal,
                message: step2Data.valorTotal ? '' : 'El valor total es requerido'
              }
            };
          }
          break;

        case 3:
          const docs = formData.datosPersona?.documentos;
          if (docs) {
            newValidationState = {
              cartaPresentacion: {
                isValid: !!docs.cartaPresentacion,
                message: docs.cartaPresentacion ? '' : 'La carta de presentación es requerida'
              },
              anexoTecnico: {
                isValid: !!docs.anexoTecnico,
                message: docs.anexoTecnico ? '' : 'El anexo técnico es requerido'
              },
              mgaNacional: {
                isValid: !!docs.mgaNacional,
                message: docs.mgaNacional ? '' : 'El documento MGA Nacional es requerido'
              }
            };
          }
          break;
      }
    }

    updateValidation(newValidationState);
    setIsValid(Object.values(newValidationState).every((v) => v?.isValid === true));
  };

  return {
    isValid,
    validationState,
    validateCurrentStep,
  };
};