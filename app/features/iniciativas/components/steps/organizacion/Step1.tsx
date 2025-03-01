'use client';

import React, { useEffect } from 'react';
import { useFormContext } from '../../../context/FormContext';
import StepNavigation from '../../StepNavigation';
import { useFormField } from '../../../hooks/useFormField';

const Step1: React.FC = () => {
  const { 
    formData, 
    updateFormData
  } = useFormContext();

  // Clases base comunes
  const inputBaseClass = "w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500";
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";

  // Usar el hook useFormField para cada campo
  const nombreOrganizacionField = useFormField('nombreOrganizacion', 'organizacion', { 
    required: true, 
    minLength: 2 
  });
  
  const razonOrganizacionField = useFormField('razonOrganizacion', 'organizacion', { 
    required: true, 
    pattern: /^\d{9,10}-?\d?$/ 
  });
  
  const emailField = useFormField('email', 'organizacion', { 
    required: true, 
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
  });
  
  const numeroContactoField = useFormField('numeroContacto', 'organizacion', { 
    required: true, 
    pattern: /^\d{10}$/ 
  });

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
          value={nombreOrganizacionField.value}
          onChange={nombreOrganizacionField.handleChange}
          className={`${inputBaseClass} ${
            !nombreOrganizacionField.validation.isValid && nombreOrganizacionField.showValidationError ? 'border-red-500' : ''
          }`}
          required
        />
        {!nombreOrganizacionField.validation.isValid && nombreOrganizacionField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{nombreOrganizacionField.validation.message}</p>
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
            value={razonOrganizacionField.value}
            onChange={razonOrganizacionField.handleChange}
            placeholder="Número de NIT"
            className={`flex-1 ${inputBaseClass} ${
              !razonOrganizacionField.validation.isValid && razonOrganizacionField.showValidationError ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {!razonOrganizacionField.validation.isValid && razonOrganizacionField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{razonOrganizacionField.validation.message}</p>
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
          value={emailField.value}
          onChange={emailField.handleChange}
          placeholder="ejemplo@gmail.com"
          className={`${inputBaseClass} ${
            !emailField.validation.isValid && emailField.showValidationError ? 'border-red-500' : ''
          }`}
          required
        />
        {!emailField.validation.isValid && emailField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{emailField.validation.message}</p>
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
            value={numeroContactoField.value}
            onChange={numeroContactoField.handleChange}
            placeholder="Ej: 10090292929"
            className={`flex-1 ${inputBaseClass} ${
              !numeroContactoField.validation.isValid && numeroContactoField.showValidationError ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {!numeroContactoField.validation.isValid && numeroContactoField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{numeroContactoField.validation.message}</p>
        )}
      </div>

      {/* Navegación entre pasos */}
      <StepNavigation />
    </div>
  );
};

export default Step1;