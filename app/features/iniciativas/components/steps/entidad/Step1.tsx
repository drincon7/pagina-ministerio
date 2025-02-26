'use client';

import { useEffect } from 'react';
import { useFormContext } from '../../../context/FormContext';
import { useFormValidation } from '../../../hooks/useFormValidation';
import StepNavigation from '../../StepNavigation';

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
    formData.datosEntidad?.nombre,
    formData.datosEntidad?.nit,
    formData.datosEntidad?.email,
    formData.datosEntidad?.telefono,
    validateCurrentStep
  ]);
  
  // Validar los datos iniciales al montar el componente
  useEffect(() => {
    validateCurrentStep();
  }, [validateCurrentStep]);

  // Manejo de cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    const updatedEntidadData = {
      ...formData.datosEntidad,
      [name]: value,
    };

    updateFormData({
      datosEntidad: updatedEntidadData
    });
  };

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
          value={formData.datosEntidad?.nombre ?? ''}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState.nombre?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState.nombre?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.nombre.message}</p>
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
            value={formData.datosEntidad?.nit ?? ''}
            onChange={handleChange}
            placeholder="Número de NIT"
            className={`flex-1 ${inputBaseClass} ${
              validationState.nit?.isValid === false ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {validationState.nit?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.nit.message}</p>
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
          value={formData.datosEntidad?.email ?? ''}
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
            value={formData.datosEntidad?.telefono ?? ''}
            onChange={handleChange}
            placeholder="Ej: 10090292929"
            className={`flex-1 ${inputBaseClass} ${
              validationState.telefono?.isValid === false ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {validationState.telefono?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.telefono.message}</p>
        )}
      </div>

      {/* Navegación entre pasos */}
      <StepNavigation/>
    </div>
  );
};

export default Step1;