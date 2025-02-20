'use client';

import React from 'react';
import { useFormContext } from '../../../context/FormContext';
import { useFormValidation } from '../../../hooks/useFormValidation';
import type { PersonaStep2Data, FormData, TipoProyecto } from '../../../types/formTypes';

const Step2: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { validationState } = useFormValidation();

  // Clases base comunes
  const inputBaseClass = "w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500";
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const updatedPersonaData = {
      ...formData.datosPersona,
      [name]: value,
    };

    const newFormData: Partial<FormData> = {
      datosPersona: updatedPersonaData
    };

    updateFormData(newFormData);
  };

  const handleLocationChange = (index: number, field: 'departamento' | 'ciudad', value: string) => {
    const updatedLocalizaciones = [...(formData.datosPersona?.localizaciones || [])];
    updatedLocalizaciones[index] = {
      ...updatedLocalizaciones[index],
      [field]: value,
    };

    const updatedPersonaData = {
      ...formData.datosPersona,
      localizaciones: updatedLocalizaciones,
    };

    updateFormData({
      datosPersona: updatedPersonaData
    });
  };

  const handleAddLocation = () => {
    const updatedPersonaData = {
      ...formData.datosPersona,
      localizaciones: [
        ...(formData.datosPersona?.localizaciones || []),
        { departamento: '', ciudad: '' }
      ],
    };

    updateFormData({
      datosPersona: updatedPersonaData
    });
  };

  const handleRemoveLocation = (index: number) => {
    const updatedLocalizaciones = [...(formData.datosPersona?.localizaciones || [])];
    updatedLocalizaciones.splice(index, 1);

    const updatedPersonaData = {
      ...formData.datosPersona,
      localizaciones: updatedLocalizaciones,
    };

    updateFormData({
      datosPersona: updatedPersonaData
    });
  };

  return (
    <div className="space-y-4">
      {/* Tipo de proyecto */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="tipoProyecto">
          Tipo de proyecto
        </label>
        <select
          id="tipoProyecto"
          name="tipoProyecto"
          value={formData.datosPersona?.tipoProyecto ?? 'SOCIAL'}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState.tipoProyecto?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        >
          <option value="SOCIAL">SOCIAL</option>
          <option value="PRODUCTIVO">PRODUCTIVO</option>
          <option value="INFRAESTRUCTURA">INFRAESTRUCTURA</option>
        </select>
        {validationState.tipoProyecto?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.tipoProyecto.message}</p>
        )}
      </div>

      {/* Título de la iniciativa */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="titulo">
          Título de la iniciativa
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.datosPersona?.titulo ?? ''}
          onChange={handleChange}
          maxLength={100}
          className={`${inputBaseClass} ${
            validationState.titulo?.isValid === false ? 'border-red-500' : ''
          }`}
          placeholder="Campo de texto (máximo 100 caracteres)"
          required
        />
        {validationState.titulo?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.titulo.message}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {formData.datosPersona?.titulo?.length ?? 0}/100 caracteres
        </p>
      </div>

      {/* Descripción de la iniciativa */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="descripcion">
          Descripción de la iniciativa
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.datosPersona?.descripcion ?? ''}
          onChange={handleChange}
          maxLength={500}
          className={`${inputBaseClass} h-32 resize-none ${
            validationState.descripcion?.isValid === false ? 'border-red-500' : ''
          }`}
          placeholder="Área de texto para resumir la iniciativa (máximo 500 caracteres)"
          required
        />
        {validationState.descripcion?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.descripcion.message}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {formData.datosPersona?.descripcion?.length ?? 0}/500 caracteres
        </p>
      </div>

      {/* Localizaciones */}
      <div className="mb-4">
        <label className={labelBaseClass}>
          Localización
        </label>
        <p className="text-sm text-gray-600 mb-2">
          Indica todas las localidades donde se desarrollará la iniciativa. 
          Si abarca más de un municipio o localidad, asegúrate de incluirlas todas.
        </p>
        
        {formData.datosPersona?.localizaciones?.map((loc, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">Localización {index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveLocation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelBaseClass}>Departamento</label>
                <select
                  value={loc.departamento}
                  onChange={(e) => handleLocationChange(index, 'departamento', e.target.value)}
                  className={inputBaseClass}
                  required
                >
                  <option value="">Seleccione departamento</option>
                  {/* Aquí irían las opciones de departamentos */}
                  <option value="CUNDINAMARCA">Cundinamarca</option>
                  <option value="ANTIOQUIA">Antioquia</option>
                  {/* ... más departamentos */}
                </select>
              </div>
              <div>
                <label className={labelBaseClass}>Ciudad</label>
                <select
                  value={loc.ciudad}
                  onChange={(e) => handleLocationChange(index, 'ciudad', e.target.value)}
                  className={inputBaseClass}
                  required
                >
                  <option value="">Seleccione ciudad</option>
                  {/* Aquí irían las opciones de ciudades filtradas por departamento */}
                  <option value="BOGOTA">Bogotá</option>
                  <option value="MEDELLIN">Medellín</option>
                  {/* ... más ciudades */}
                </select>
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddLocation}
          className="flex items-center text-pink-500 hover:text-pink-600 mt-2"
        >
          <span className="mr-2">+</span>
          Añadir localización
        </button>
      </div>

      {/* Población beneficiada */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="poblacionBeneficiada">
          Población beneficiada
        </label>
        <select
          id="poblacionBeneficiada"
          name="poblacionBeneficiada"
          value={formData.datosPersona?.poblacionBeneficiada ?? ''}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState.poblacionBeneficiada?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        >
          <option value="">Seleccione población</option>
          <option value="infantil">Infantil</option>
          <option value="diversidad">Diversidad de género</option>
          <option value="adultoMayor">Adulto mayor</option>
        </select>
        {validationState.poblacionBeneficiada?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.poblacionBeneficiada.message}</p>
        )}
      </div>

      {/* Valor total */}
      <div className="mb-6">
        <label className={labelBaseClass} htmlFor="valorTotal">
          Valor total
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="text"
            id="valorTotal"
            name="valorTotal"
            value={formData.datosPersona?.valorTotal ?? ''}
            onChange={handleChange}
            className={`${inputBaseClass} pl-8 ${
              validationState.valorTotal?.isValid === false ? 'border-red-500' : ''
            }`}
            placeholder="Valor en pesos COP"
            required
          />
        </div>
        {validationState.valorTotal?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.valorTotal.message}</p>
        )}
      </div>
    </div>
  );
};

export default Step2;