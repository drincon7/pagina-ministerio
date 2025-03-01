'use client';

import React, { useEffect, useRef } from 'react';
import { useFormContext } from '../../../context/FormContext';
import StepNavigation from '../../StepNavigation';
import { useFormField } from '../../../hooks/useFormField';

const Step1: React.FC = () => {
  const { 
    formData, 
    updateFormData,
    validationState, 
    validateCurrentStep
  } = useFormContext();

  // Clases base comunes
  const inputBaseClass = "w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500";
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";

  // Usar el hook useFormField para cada campo
  const nombresField = useFormField('nombres', 'persona', { required: true, minLength: 2 });
  const primerApellidoField = useFormField('primerApellido', 'persona', { required: true, minLength: 2 });
  const segundoApellidoField = useFormField('segundoApellido', 'persona', {});
  const numeroDocumentoField = useFormField('numeroDocumento', 'persona', { 
    required: true, 
    pattern: /^\d+$/, 
    minLength: 6, 
    maxLength: 12 
  });
  const emailField = useFormField('email', 'persona', { 
    required: true, 
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
  });
  const numeroContactoField = useFormField('numeroContacto', 'persona', { 
    required: true, 
    pattern: /^\d{10}$/ 
  });

  return (
    <div className="space-y-4">
      {/* 🔹 Nombres */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="nombres">
          Nombre (s) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nombres"
          name="nombres"
          value={nombresField.value}
          onChange={nombresField.handleChange}
          className={`${inputBaseClass} ${
            !nombresField.validation.isValid && nombresField.showValidationError ? 'border-red-500' : ''
          }`}
          required
        />
        {!nombresField.validation.isValid && nombresField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{nombresField.validation.message}</p>
        )}
      </div>

      {/* 🔹 Primer Apellido */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="primerApellido">
          Primer apellido <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="primerApellido"
          name="primerApellido"
          value={primerApellidoField.value}
          onChange={primerApellidoField.handleChange}
          className={`${inputBaseClass} ${
            !primerApellidoField.validation.isValid && primerApellidoField.showValidationError ? 'border-red-500' : ''
          }`}
          required
        />
        {!primerApellidoField.validation.isValid && primerApellidoField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{primerApellidoField.validation.message}</p>
        )}
      </div>

      {/* 🔹 Segundo Apellido */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="segundoApellido">
          Segundo apellido
        </label>
        <input
          type="text"
          id="segundoApellido"
          name="segundoApellido"
          value={segundoApellidoField.value}
          onChange={segundoApellidoField.handleChange}
          className={inputBaseClass}
        />
      </div>

      {/* 🔹 Número de Documento */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="numeroDocumento">
          Número de documento <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <select
            className="w-16 text-gray-700 font-medium border border-gray-300 rounded-md"
            name="tipoDocumento"
            value={formData.datosPersona?.tipoDocumento ?? 'CC'}
            onChange={(e) => {
              updateFormData({
                datosPersona: {
                  ...formData.datosPersona,
                  tipoDocumento: e.target.value
                }
              });
            }}
          >
            <option value="CC">CC.</option>
            <option value="CE">CE.</option>
            <option value="TI">TI.</option>
          </select>
          <input
            type="text"
            id="numeroDocumento"
            name="numeroDocumento"
            value={numeroDocumentoField.value}
            onChange={numeroDocumentoField.handleChange}
            className={`flex-1 ${inputBaseClass} ${
              !numeroDocumentoField.validation.isValid && numeroDocumentoField.showValidationError ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {!numeroDocumentoField.validation.isValid && numeroDocumentoField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{numeroDocumentoField.validation.message}</p>
        )}
      </div>

      {/* 🔹 Email */}
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
          className={`${inputBaseClass} ${
            !emailField.validation.isValid && emailField.showValidationError ? 'border-red-500' : ''
          }`}
          required
        />
        {!emailField.validation.isValid && emailField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{emailField.validation.message}</p>
        )}
      </div>

      {/* 🔹 Número de Contacto */}
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