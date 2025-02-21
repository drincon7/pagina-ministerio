'use client';

import { useState } from 'react';
import { useFormContext } from '../../../context/FormContext';
import { useFormValidation } from '../../../hooks/useFormValidation';
import axios from 'axios';

const Step1: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { validationState } = useFormValidation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');

  // Clases base comunes
  const inputBaseClass = "w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500";
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";

  // Función de prueba directa a la API
  const testDirectAPI = async () => {
    setApiStatus('Probando conexión...');
    try {
      const response = await axios.get('https://13xv9sjf-8000.use2.devtunnels.ms/mie/api/remitente/');
      console.log('Respuesta de la API:', response.data);
      setApiStatus('Conexión exitosa! Ver consola para detalles');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error completo:', error);
        setApiStatus(`Error en la conexión: ${error.message}`);
      } else {
        console.error('Error desconocido:', error);
        setApiStatus('Error desconocido en la conexión');
      }
    }
  };

  // Función de prueba con un ID específico
  const testWithId = async () => {
    setApiStatus('Buscando remitente...');
    try {
      const response = await axios.get('https://13xv9sjf-8000.use2.devtunnels.ms/mie/api/remitente/?identificacion=10261858');
      console.log('Respuesta de búsqueda:', response.data);
      setApiStatus('Búsqueda exitosa! Ver consola para detalles');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error en búsqueda:', error);
        setApiStatus(`Error en la búsqueda: ${error.message}`);
      } else {
        console.error('Error desconocido en búsqueda:', error);
        setApiStatus('Error desconocido en la búsqueda');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      {/* Botones de prueba API */}
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={testDirectAPI}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Probar Conexión API
        </button>
        <button
          type="button"
          onClick={testWithId}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Probar Búsqueda
        </button>
      </div>

      {/* Estado de la API */}
      {apiStatus && (
        <div className="p-4 bg-gray-100 rounded-md mb-4">
          <p className="font-mono text-sm">{apiStatus}</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Nombres */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="nombres">
          Nombre (s)
        </label>
        <input
          type="text"
          id="nombres"
          name="nombres"
          value={formData.datosPersona?.nombres ?? ''}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState.nombres?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState.nombres?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.nombres.message}</p>
        )}
      </div>

      {/* Primer Apellido */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="primerApellido">
          Primer apellido
        </label>
        <input
          type="text"
          id="primerApellido"
          name="primerApellido"
          value={formData.datosPersona?.primerApellido ?? ''}
          onChange={handleChange}
          className={`${inputBaseClass} ${
            validationState.primerApellido?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState.primerApellido?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.primerApellido.message}</p>
        )}
      </div>

      {/* Segundo Apellido */}
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

      {/* Número de Documento */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="numeroDocumento">
          Número de documento
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
              validationState.numeroDocumento?.isValid === false ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {validationState.numeroDocumento?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.numeroDocumento.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className={labelBaseClass} htmlFor="email">
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.datosPersona?.email ?? ''}
          onChange={handleChange}
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
        <label className={labelBaseClass} htmlFor="numeroContacto">
          Número de contacto
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
              validationState.numeroContacto?.isValid === false ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {validationState.numeroContacto?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.numeroContacto.message}</p>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-2">
          <p>Cargando...</p>
        </div>
      )}
    </div>
  );
};

export default Step1;