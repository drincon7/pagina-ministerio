'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from '../../../context/FormContext';
import StepNavigation from '../../StepNavigation';
import { IniciativaAPI } from '@/services/api/iniciativa';
import { useFormField } from '../../../hooks/useFormField';

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
  const { formData } = useFormContext();

  // Estados para las opciones de los selects
  const [tiposProyecto, setTiposProyecto] = useState<TipoProyecto[]>([]);
  const [poblacionesObjetivo, setPoblacionesObjetivo] = useState<PoblacionObjetivo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Usar el hook useFormField para cada campo
  const tipoProyectoField = useFormField('tipoProyecto', 'persona', { required: true });
  const tituloField = useFormField('titulo', 'persona', { 
    required: true, 
    minLength: 5, 
    maxLength: 100 
  });
  const descripcionField = useFormField('descripcion', 'persona', { 
    required: true, 
    minLength: 10, 
    maxLength: 500 
  });
  const poblacionBeneficiadaField = useFormField('poblacionBeneficiada', 'persona', { required: true });
  const valorTotalField = useFormField('valorTotal', 'persona', { 
    required: true, 
    pattern: /^\d+(\.\d+)?$/ 
  });

  // Estado local para mantener el valor sin formatear durante la edición
  const [valorTotalRaw, setValorTotalRaw] = useState<string>(valorTotalField.value);

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

  // Al perder el foco, formatear el valor y actualizar el estado local
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === 'valorTotal') {
      const formatted = formatCurrency(valorTotalRaw);
      setValorTotalRaw(formatted);
    }
  };

  // Manejador especial para el campo valorTotal
  const handleValorTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Eliminar cualquier carácter que no sea número
    const numericValue = newValue.replace(/[^0-9]/g, '');
    setValorTotalRaw(numericValue);
    
    // Llamar al handleChange original del campo
    valorTotalField.updateValue(numericValue);
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
          value={tipoProyectoField.value}
          onChange={tipoProyectoField.handleChange}
          className={`${inputBaseClass} ${
            !tipoProyectoField.validation.isValid && tipoProyectoField.showValidationError ? 'border-red-500' : ''
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
        {!tipoProyectoField.validation.isValid && tipoProyectoField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{tipoProyectoField.validation.message}</p>
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
          value={tituloField.value}
          onChange={tituloField.handleChange}
          maxLength={100}
          className={`${inputBaseClass} ${
            !tituloField.validation.isValid && tituloField.showValidationError ? 'border-red-500' : ''
          }`}
          placeholder="Campo de texto (máximo 100 caracteres)"
          required
        />
        {!tituloField.validation.isValid && tituloField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{tituloField.validation.message}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {tituloField.value.length}/100 caracteres
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
          value={descripcionField.value}
          onChange={descripcionField.handleChange}
          maxLength={500}
          className={`${inputBaseClass} h-32 resize-none ${
            !descripcionField.validation.isValid && descripcionField.showValidationError ? 'border-red-500' : ''
          }`}
          placeholder="Área de texto para resumir la iniciativa (máximo 500 caracteres)"
          required
        />
        {!descripcionField.validation.isValid && descripcionField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{descripcionField.validation.message}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {descripcionField.value.length}/500 caracteres
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
          value={poblacionBeneficiadaField.value}
          onChange={poblacionBeneficiadaField.handleChange}
          className={`${inputBaseClass} ${
            !poblacionBeneficiadaField.validation.isValid && poblacionBeneficiadaField.showValidationError ? 'border-red-500' : ''
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
        {!poblacionBeneficiadaField.validation.isValid && poblacionBeneficiadaField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{poblacionBeneficiadaField.validation.message}</p>
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
            onChange={handleValorTotalChange}
            onBlur={handleBlur}
            className={`${inputBaseClass} pl-8 ${
              !valorTotalField.validation.isValid && valorTotalField.showValidationError ? 'border-red-500' : ''
            }`}
            placeholder="Valor en pesos COP"
            required
          />
        </div>
        {!valorTotalField.validation.isValid && valorTotalField.showValidationError && (
          <p className="text-red-500 text-sm mt-1">{valorTotalField.validation.message}</p>
        )}
      </div>

      <StepNavigation />
    </div>
  );
};

export default Step2;