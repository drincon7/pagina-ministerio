'use client';

import { useState } from 'react';
import { useFormContext } from '../../../context/FormContext';
import { useFormValidation } from '../../../hooks/useFormValidation';
// Importar el servicio como un objeto de funciones
import { RemitenteAPI } from '@/services/api/remitente';
import StepNavigation from '../../StepNavigation';

const Step1: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { validationState, validateCurrentStep } = useFormValidation();
  const [loading, setLoading] = useState<boolean>(false);
  // Corregido: definir error como string | null en lugar de solo null
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Clases base comunes
  const inputBaseClass = "w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500";
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";
  const buttonBaseClass = "px-4 py-2 rounded-md text-white font-medium transition-colors";

  // 🔹 Función para enviar datos a la API
  const handleSaveData = async (): Promise<void> => {
    // Validar campos del formulario
    validateCurrentStep();
    
    // Verificar si todos los campos requeridos son válidos
    const requiredFields = ['nombres', 'primerApellido', 'numeroDocumento', 'email', 'numeroContacto'];
    const allValid = requiredFields.every(field => validationState[field]?.isValid === true);

    if (!allValid) {
      // Corregido: ahora setError acepta strings
      setError('Por favor complete todos los campos obligatorios correctamente');
      return;
    }

    setLoading(true);
    setError(null);
    setSaveSuccess(false);
    setApiStatus('Enviando datos...');

    try {
      // Si tenemos un remitenteId, actualizamos el registro existente
      if (formData.datosPersona?.remitenteId) {
        const response = await RemitenteAPI.updateRemitente(
          parseInt(formData.datosPersona.remitenteId as string), 
          formData.datosPersona
        );
        
        setApiStatus('¡Datos actualizados correctamente!');
        console.log('Remitente actualizado:', response);
      } else {
        // Crear un nuevo registro
        const response = await RemitenteAPI.saveStep1Data(formData.datosPersona);
        
        setApiStatus('¡Datos guardados correctamente!');
        console.log('Nuevo remitente creado:', response);
        
        // Guardamos el ID del remitente para referencia
        if (response && response.id) {
          updateFormData({
            datosPersona: {
              ...formData.datosPersona,
              remitenteId: response.id.toString()
            }
          });
        }
      }
      
      setSaveSuccess(true);
    } catch (err: unknown) {
      // Corregido: tipado correcto para manejo de error
      console.error('Error al enviar datos:', err);
      
      // Utilizamos type narrowing para manejar diferentes tipos de errores
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as { response?: { data?: { message?: string } } };
        setError(apiError.response?.data?.message || 'Error al enviar los datos');
      } else {
        setError('Error al procesar la solicitud');
      }
      
      setApiStatus('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Función para buscar remitente por documento
  const handleSearchByDocument = async (): Promise<void> => {
    const { numeroDocumento } = formData.datosPersona;
    
    if (!numeroDocumento) {
      // Corregido: ahora setError acepta strings
      setError('Ingrese un número de documento para buscar');
      return;
    }
    
    setLoading(true);
    setApiStatus('Buscando...');
    
    try {
      const remitente = await RemitenteAPI.findByIdentificacion(parseInt(numeroDocumento as string));
      
      if (remitente) {
        // Mapear los datos de la API al formato del formulario
        updateFormData({
          datosPersona: {
            remitenteId: remitente.id.toString(),
            nombres: remitente.nombre,
            primerApellido: remitente.primer_apellido,
            segundoApellido: remitente.segundo_apellido || '',
            email: remitente.email,
            numeroContacto: remitente.telefono.toString(),
            tipoDocumento: formData.datosPersona.tipoDocumento || 'CC', // Mantenemos el tipo de documento seleccionado
            numeroDocumento: remitente.identificacion.toString()
          }
        });
        
        setApiStatus(`Remitente encontrado: ${remitente.nombre} ${remitente.primer_apellido}`);
      } else {
        setApiStatus('No se encontró ningún remitente con ese documento');
      }
    } catch (err: unknown) {
      // Corregido: tipado correcto para manejo de error
      console.error('Error al buscar remitente:', err);
      setError('Error al buscar remitente');
      setApiStatus('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  // Corregido: tipado correcto para el evento
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
      {/* 🔹 Estado de la API y mensajes */}
      {apiStatus && (
        <div className={`p-4 rounded-md mb-4 ${saveSuccess ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          <p className="font-mono text-sm">{apiStatus}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-sm underline mt-2"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* 🔹 Número de Documento con botón de búsqueda */}
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
              validationState.numeroDocumento?.isValid === false ? 'border-red-500' : ''
            }`}
            required
          />
          <button
            type="button"
            onClick={handleSearchByDocument}
            disabled={loading || !formData.datosPersona?.numeroDocumento}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 rounded-md"
          >
            Buscar
          </button>
        </div>
        {validationState.numeroDocumento?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.numeroDocumento.message}</p>
        )}
        {formData.datosPersona?.remitenteId && (
          <p className="text-blue-600 text-sm mt-1">
            Remitente existente (ID: {formData.datosPersona.remitenteId})
          </p>
        )}
      </div>

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
            validationState.nombres?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState.nombres?.message && (
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
            validationState.primerApellido?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState.primerApellido?.message && (
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
            validationState.email?.isValid === false ? 'border-red-500' : ''
          }`}
          required
        />
        {validationState.email?.message && (
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
              validationState.numeroContacto?.isValid === false ? 'border-red-500' : ''
            }`}
            required
          />
        </div>
        {validationState.numeroContacto?.message && (
          <p className="text-red-500 text-sm mt-1">{validationState.numeroContacto.message}</p>
        )}
      </div>

      {/* 🔹 Botón de guardar */}
      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={handleSaveData}
          disabled={loading}
          className={`${buttonBaseClass} ${
            formData.datosPersona?.remitenteId
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-green-600 hover:bg-green-700'
          } disabled:opacity-50`}
        >
          {loading 
            ? 'Procesando...' 
            : formData.datosPersona?.remitenteId 
              ? 'Actualizar datos' 
              : 'Guardar datos'
          }
        </button>
      </div>

      {/* Navegación entre pasos */}
      <StepNavigation/>
    </div>
  );
};

export default Step1;