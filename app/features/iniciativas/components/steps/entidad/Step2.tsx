'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from '../../../context/FormContext';
import StepNavigation from '../../StepNavigation';
import { IniciativaAPI } from '@/services/api/iniciativa';

// Interfaces para los datos que vienen de la API
interface TipoProyecto {
  id: number;
  tipo_proyecto: string;
}

interface PoblacionObjetivo {
  id: number;
  poblacion_objetivo: string;
}

const Step2: React.FC = () => {
  const { formData, updateFormData, validationState } = useFormContext();
  const datosEntidad = formData.datosEntidad;

  // Estados para las opciones de los selects
  const [tiposProyecto, setTiposProyecto] = useState<TipoProyecto[]>([]);
  const [poblacionesObjetivo, setPoblacionesObjetivo] = useState<PoblacionObjetivo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado local para mantener el valor sin formatear durante la edición
  const [valorTotalRaw, setValorTotalRaw] = useState<string>(datosEntidad?.valorTotal || '');

  // Clases base comunes
  const inputBaseClass = "w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500";
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";

  // Cargar las opciones desde la API al montar el componente
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Obtener el ID de la entidad desde variables de entorno
        const entidadId = process.env.NEXT_PUBLIC_ENTIDAD_ID || '1';
        
        // Cargar tipos de proyecto
        const tiposResponse = await IniciativaAPI.findAllTiposProyecto(entidadId);
        setTiposProyecto(tiposResponse);
        
        // Cargar poblaciones objetivo
        const poblacionesResponse = await IniciativaAPI.findAllPoblacionesObjetivo(entidadId);
        setPoblacionesObjetivo(poblacionesResponse);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error al cargar opciones:', err);
        setError('No se pudieron cargar los datos. Por favor, recargue la página.');
        setIsLoading(false);
      }
    };
    
    fetchOptions();
  }, []);

  // Función para formatear el valor como moneda
  const formatCurrency = (value: string | undefined): string => {
    if (!value) return '';
    
    // Eliminar caracteres no numéricos
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Formatear con separador de miles
    return new Intl.NumberFormat('es-CO').format(parseInt(numericValue) || 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Procesamiento especial para el valor total (solo permitir números)
    if (name === 'valorTotal') {
      // Eliminar cualquier carácter que no sea un número
      const numericValue = value.replace(/[^0-9]/g, '');
      setValorTotalRaw(numericValue);
      
      updateFormData({
        datosEntidad: {
          ...datosEntidad,
          [name]: numericValue,
        }
      });
      return;
    }
    
    // Para el resto de los campos
    updateFormData({
      datosEntidad: {
        ...datosEntidad,
        [name]: value,
      }
    });
  };

  // Al perder el foco, formatear el valor y actualizar el estado local
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === 'valorTotal') {
      const formatted = formatCurrency(valorTotalRaw);
      setValorTotalRaw(formatted);
    }
  };

  // Mostrar indicador de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-md flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-pink-500"></div>
        <span className="text-gray-700">Cargando opciones...</span>
      </div>
    );
  }

  // Mostrar mensaje de error si ocurrió un problema
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 underline"
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
          {tiposProyecto.map(tipo => (
            <option key={tipo.id} value={tipo.id}>
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
            <option key={poblacion.id} value={poblacion.id}>
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
            value={valorTotalRaw}
            onChange={handleChange}
            onBlur={handleBlur}
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
