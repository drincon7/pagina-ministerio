'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from '../../../context/FormContext';
import StepNavigation from '../../StepNavigation';

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

  // Efecto para validar los datos del formulario cuando hay cambios significativos
  useEffect(() => {
    // Usamos un timeout para reducir las validaciones mientras el usuario escribe
    const validationTimeout = setTimeout(() => {
      validateCurrentStep();
    }, 300);
    
    return () => clearTimeout(validationTimeout);
  }, [
    formData.datosPersona?.numeroDocumento,
    formData.datosPersona?.nombres,
    formData.datosPersona?.primerApellido,
    formData.datosPersona?.email,
    formData.datosPersona?.numeroContacto,
    validateCurrentStep
  ]);
  
  // Validar los datos iniciales al montar el componente
  useEffect(() => {
    validateCurrentStep();
  }, [validateCurrentStep]);

  // Manejo de cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    const updatedPersonaData = {
      ...formData.datosPersona,
      [name]: value,
    };

    updateFormData({
      datosPersona: updatedPersonaData
    });
  };

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
          value={formData.datosPersona?.nombres ?? ''}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState?.nombres?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState?.nombres?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.nombres.message}</p>
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
          value={formData.datosPersona?.primerApellido ?? ''}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState?.primerApellido?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState?.primerApellido?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.primerApellido.message}</p>
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
          value={formData.datosPersona?.segundoApellido ?? ''}
          onChange={handleChange}
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
            onChange={handleChange}
          >
            <option value="CC">CC.</option>
            <option value="CE">CE.</option>
            <option value="TI">TI.</option>
          </select>
          <input
            type="text"
            id="numeroDocumento"
            name="numeroDocumento"
            value={formData.datosPersona?.numeroDocumento ?? ''}
            onChange={handleChange}
            className={`flex-1 ${inputBaseClass} ${
              validationState?.numeroDocumento?.isValid === false ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {validationState?.numeroDocumento?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.numeroDocumento.message}</p>
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
          value={formData.datosPersona?.email ?? ''}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState?.email?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState?.email?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.email.message}</p>
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
            value={formData.datosPersona?.numeroContacto ?? ''}
            onChange={handleChange}
            className={`flex-1 ${inputBaseClass} ${
              validationState?.numeroContacto?.isValid === false ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {validationState?.numeroContacto?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.numeroContacto.message}</p>
        )}
      </div>

      {/* Navegación entre pasos */}
      <StepNavigation/>
    </div>
  );
};

export default Step1;