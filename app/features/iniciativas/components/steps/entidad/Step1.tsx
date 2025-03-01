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
  const nombreField = useFormField('nombre', 'entidad', { required: true, minLength: 2 });
  const nitField = useFormField('nit', 'entidad', { 
    required: true, 
    pattern: /^\d{9,10}-?\d?$/ 
  });
  const emailField = useFormField('email', 'entidad', { 
    required: true, 
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
  });
  const telefonoField = useFormField('telefono', 'entidad', { 
    required: true, 
    pattern: /^\d{10}$/ 
  });

  return (
    <div className="space-y-4">
      {/* Nombre de la Entidad */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="nombre">
          Nombre de la entidad <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={nombreField.value}
          onChange={nombreField.handleChange}
          className={`${inputBaseClass} ${
            !nombreField.validation.isValid && nombreField.showValidationError ? 'border-red-500' : ''
          }`}
          required
        />
        {!nombreField.validation.isValid && nombreField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{nombreField.validation.message}</p>
        )}
      </div>

      {/* Razón social (NIT) */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="nit">
          Razón social de la entidad <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <span className="w-16 text-gray-700 font-medium border border-gray-300 rounded-md flex items-center justify-center">
            NIT.
          </span>
          <input
            type="text"
            id="nit"
            name="nit"
            value={nitField.value}
            onChange={nitField.handleChange}
            placeholder="Número de NIT"
            className={`flex-1 ${inputBaseClass} ${
              !nitField.validation.isValid && nitField.showValidationError ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {!nitField.validation.isValid && nitField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{nitField.validation.message}</p>
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
        <label className={labelBaseClass} htmlFor="telefono">
          Número de contacto <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <span className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 font-medium">
            +57
          </span>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={telefonoField.value}
            onChange={telefonoField.handleChange}
            placeholder="Ej: 10090292929"
            className={`flex-1 ${inputBaseClass} ${
              !telefonoField.validation.isValid && telefonoField.showValidationError ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {!telefonoField.validation.isValid && telefonoField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{telefonoField.validation.message}</p>
        )}
      </div>

      {/* Navegación entre pasos */}
      <StepNavigation/>
    </div>
  );
};

export default Step1;