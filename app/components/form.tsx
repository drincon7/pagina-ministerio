'use client';

import React from 'react';
import { FormProvider, useFormContext } from '../features/iniciativas/context/FormContext';

// Importación de los componentes de paso
import Step1Persona from '../features/iniciativas/components/steps/persona/Step1';
import Step2Persona from '../features/iniciativas/components/steps/persona/Step2';
import Step3Persona from '../features/iniciativas/components/steps/persona/Step3';

import Step1Entidad from '../features/iniciativas/components/steps/entidad/Step1';
import Step2Entidad from '../features/iniciativas/components/steps/entidad/Step2';

import Step1Organizacion from '../features/iniciativas/components/steps/organizacion/Step1';
import Step2Organizacion from '../features/iniciativas/components/steps/organizacion/Step2';

// Componente interno que maneja la lógica de renderizado de pasos
const FormularioContenido: React.FC = () => {
  const { formData, updateFormData } = useFormContext();

  // Manejador para el cambio de tipo de remitente
  const handleTipoRemitenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({
      tipoRemitente: e.target.value as 'persona' | 'entidad' | 'organizacion',
      paso: 1
    });
  };

  // Renderizado del paso actual según el tipo de remitente
  const renderPasoActual = () => {
    // Primero verificamos el tipo de remitente
    if (formData.tipoRemitente === 'persona') {
      switch (formData.paso) {
        case 1:
          return <Step1Persona />;
        case 2:
          return <Step2Persona />;
        case 3:
          return <Step3Persona />;
        default:
          return <Step1Persona />;
      }
    } else if (formData.tipoRemitente === 'entidad') {
      // Para entidad, también verificamos el paso
      switch (formData.paso) {
        case 1:
          return <Step1Entidad />;
        case 2:
          return <Step2Entidad />;
        default:
          return <Step1Entidad />;
      }
    } else if (formData.tipoRemitente === 'organizacion') {
      // Para organización, también verificamos el paso
      switch (formData.paso) {
        case 1:
          return <Step1Organizacion />;
        case 2:
          // Temporalmente reusamos Step1 hasta que tengas Step2
          return <Step2Organizacion />;
        default:
          return <Step1Organizacion />;
      }
    }
    
    return null; // En caso de que ninguna condición se cumpla
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Indicador de pasos */}
      <div className="flex items-center justify-center gap-12 mb-8">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${
            formData.paso === 1 ? 'bg-pink-500 text-white' : 'bg-gray-300'
          } flex items-center justify-center font-bold text-sm`}>
            1
          </div>
          <span className="text-xs mt-1 text-gray-600">Datos del remitente</span>
        </div>
        <div className="flex-1 h-px bg-gray-300"></div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${
            formData.paso === 2 ? 'bg-pink-500 text-white' : 'bg-gray-300'
          } flex items-center justify-center font-bold text-sm`}>
            2
          </div>
          <span className="text-xs mt-1 text-gray-600">Datos de la iniciativa</span>
        </div>
        <div className="flex-1 h-px bg-gray-300"></div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${
            formData.paso === 3 ? 'bg-pink-500 text-white' : 'bg-gray-300'
          } flex items-center justify-center font-bold text-sm`}>
            3
          </div>
          <span className="text-xs mt-1 text-gray-600">Documentos</span>
        </div>
      </div>
      
      {/* Contenido del formulario */}
      <div className="bg-white rounded-lg border border-pink-200 p-6">
        <h2 className="text-2xl font-bold text-pink-500 mb-6">
          {formData.paso === 1 ? 'Datos del remitente' : 'Datos de la iniciativa'}
        </h2>

        {/* Selector de tipo de remitente (solo visible en el paso 1) */}
        {formData.paso === 1 && (
          <div className="mb-6">
            <label className="block text-gray-700 font-bold text-sm mb-2">
              Tipo de remitente
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipoRemitente"
                  value="persona"
                  checked={formData.tipoRemitente === 'persona'}
                  onChange={handleTipoRemitenteChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 font-medium">Persona Natural</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipoRemitente"
                  value="entidad"
                  checked={formData.tipoRemitente === 'entidad'}
                  onChange={handleTipoRemitenteChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 font-medium">Entidad Pública</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipoRemitente"
                  value="organizacion"
                  checked={formData.tipoRemitente === 'organizacion'}
                  onChange={handleTipoRemitenteChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 font-medium">Organización Privada</span>
              </label>
            </div>
          </div>
        )}

        {/* Renderizado del paso actual */}
        {renderPasoActual()}
      </div>
    </div>
  );
};

// Componente principal que provee el contexto
const FormularioIniciativas: React.FC = () => {
  return (
    <FormProvider>
      <FormularioContenido />
    </FormProvider>
  );
};

export default FormularioIniciativas;