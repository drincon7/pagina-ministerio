'use client';

import React, { useEffect } from 'react';
import { useFormContext } from '../../../context/FormContext';
import { useFormValidation } from '../../../hooks/useFormValidation';
import StepNavigation from '../../StepNavigation';
import type { FormData } from '../../../types/formTypes';

const Step1: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { validationState, validateCurrentStep } = useFormValidation();

  // Clases base comunes
  const inputBaseClass = "w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500";
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";

  // Efecto para validar los datos del formulario cuando hay cambios significativos
  useEffect(() => {
    // Usamos un timeout para reducir las validaciones mientras el usuario escribe
    const validationTimeout = setTimeout(() => {
      validateCurrentStep();
    }, 300);
    
    return () => clearTimeout(validationTimeout);
  }, [
    formData.datosOrganizacion?.nombreOrganizacion,
    formData.datosOrganizacion?.razonOrganizacion,
    formData.datosOrganizacion?.email,
    formData.datosOrganizacion?.numeroContacto,
    validateCurrentStep
  ]);
  
  // Validar los datos iniciales al montar el componente
  useEffect(() => {
    validateCurrentStep();
  }, [validateCurrentStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const updatedOrganizacionData = {
      ...formData.datosOrganizacion,
      [name]: value,
    };

    const newFormData: Partial<FormData> = {
      datosOrganizacion: updatedOrganizacionData
    };

    updateFormData(newFormData);
  };

  return (
    <div className="space-y-4">
      {/* Nombre de la organización */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="nombreOrganizacion">
          Nombre de la organización <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nombreOrganizacion"
          name="nombreOrganizacion"
          value={formData.datosOrganizacion?.nombreOrganizacion ?? ''}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState.nombreOrganizacion?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState.nombreOrganizacion?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.nombreOrganizacion.message}</p>
        )}
      </div>

      {/* Razón social */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="razonOrganizacion">
          Razón social de la organización <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <span className="w-16 text-gray-700 font-medium border border-gray-300 rounded-md flex items-center justify-center">
            NIT.
          </span>
          <input
            type="text"
            id="razonOrganizacion"
            name="razonOrganizacion"
            value={formData.datosOrganizacion?.razonOrganizacion ?? ''}
            onChange={handleChange}
            placeholder="Número de NIT"
            className={`flex-1 ${inputBaseClass} ${
              validationState.razonOrganizacion?.isValid === false ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {validationState.razonOrganizacion?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.razonOrganizacion.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="email">
          Correo electrónico <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.datosOrganizacion?.email ?? ''}
          onChange={handleChange}
          placeholder="ejemplo@gmail.com"
          className={`${inputBaseClass} ${
            validationState.email?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState.email?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.email.message}</p>
        )}
      </div>

      {/* Número de Contacto */}
      <div className="mb-6">
        <label className={labelBaseClass} htmlFor="numeroContacto">
          Número de contacto <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <span className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 font-medium">
            +57
          </span>
          <input
            type="tel"
            id="numeroContacto"
            name="numeroContacto"
            value={formData.datosOrganizacion?.numeroContacto ?? ''}
            onChange={handleChange}
            placeholder="Ej: 10090292929"
            className={`flex-1 ${inputBaseClass} ${
              validationState.numeroContacto?.isValid === false ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {validationState.numeroContacto?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.numeroContacto.message}</p>
        )}
      </div>

      {/* Navegación entre pasos */}
      <StepNavigation />
    </div>
  );
};

export default Step1;