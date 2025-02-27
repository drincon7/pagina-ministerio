'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from '../../../context/FormContext';
import { EntidadDataPartial } from '../../../types/formTypes';
import StepNavigation from '../../StepNavigation';
import { TipoProyecto, PoblacionObjetivo } from '@/services/types/iniciativa';
import { IniciativaAPI } from '@/services/api/iniciativa';

const Step2: React.FC = () => {
  const { formData, updateFormData, validationState } = useFormContext();
  const datosEntidad = formData.datosEntidad as EntidadDataPartial;
  
  // Estados para almacenar las opciones obtenidas desde la API
  const [tiposProyectos, setTiposProyectos] = useState<TipoProyecto[]>([]);
  const [poblacionesObjetivo, setPoblacionesObjetivo] = useState<PoblacionObjetivo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener datos de la API al montar el componente
  useEffect(() => {
    const fetchOptionsData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Obtener tipos de proyectos desde la API
        const tiposProyectoData = await IniciativaAPI.findAllTiposProyecto();
        setTiposProyectos(tiposProyectoData);
        
        // Obtener poblaciones objetivo desde la API
        const poblacionesObjetivoData = await IniciativaAPI.findAllPoblacionesObjetivo();
        setPoblacionesObjetivo(poblacionesObjetivoData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar opciones:', err);
        setError('Error al cargar opciones. Por favor, recargue la página.');
        setLoading(false);
      }
    };
    
    fetchOptionsData();
  }, []);

  // Clases base comunes
  const inputBaseClass = "w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500";
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const updatedEntidadData: Partial<EntidadDataPartial> = {
      ...datosEntidad,
      [name]: value,
    };

    updateFormData({
      datosEntidad: updatedEntidadData
    });
  };

  // Formatear valor numérico para mostrar en formato de moneda
  const formatCurrency = (value: string) => {
    // Eliminar caracteres no numéricos excepto el punto
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Formatear con separadores de miles
    return numericValue ? new Intl.NumberFormat('es-CO').format(parseFloat(numericValue)) : '';
  };

  // Manejar cambios en el campo de valor total
  const handleValorTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Eliminar caracteres no numéricos excepto el punto
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Actualizar el valor en el estado del formulario
    const updatedEntidadData: Partial<EntidadDataPartial> = {
      ...datosEntidad,
      valorTotal: numericValue
    };

    updateFormData({
      datosEntidad: updatedEntidadData
    });
  };

  if (loading) {
    return <div className="text-center py-6">Cargando opciones...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

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
          value={datosEntidad?.tipoProyecto || ''}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState.tipoProyecto?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        >
          <option value="">Seleccione un tipo de proyecto</option>
          {tiposProyectos.map(tipo => (
            <option key={tipo.id} value={tipo.id.toString()}>
              {tipo.tipo_proyecto}
            </option>
          ))}
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
          value={datosEntidad?.titulo || ''}
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
          {(datosEntidad?.titulo?.length || 0)}/100 caracteres
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
          value={datosEntidad?.descripcion || ''}
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
          {(datosEntidad?.descripcion?.length || 0)}/500 caracteres
        </p>
      </div>

      {/* Población beneficiada */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="poblacionBeneficiada">
          Población beneficiada
        </label>
        <select
          id="poblacionBeneficiada"
          name="poblacionBeneficiada"
          value={datosEntidad?.poblacionBeneficiada || ''}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState.poblacionBeneficiada?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        >
          <option value="">Seleccione población</option>
          {poblacionesObjetivo.map(poblacion => (
            <option key={poblacion.id} value={poblacion.id.toString()}>
              {poblacion.poblacion_objetivo}
            </option>
          ))}
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
            value={formatCurrency(datosEntidad?.valorTotal || '')}
            onChange={handleValorTotalChange}
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

      <StepNavigation />
    </div>
  );
};

export default Step2;