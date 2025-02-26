'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from '../context/FormContext';
import { RemitenteAPI } from '@/services/api/remitente';

/**
 * Componente de navegación entre pasos del formulario
 * Gestiona la validación, envío de datos y transición entre pasos
 */
const StepNavigation: React.FC = () => {
  const { 
    formData,
    updateFormData,
    nextStep, 
    prevStep,
    isCurrentStepValid,
    validationState
  } = useFormContext();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');

  // Loguear información relevante solo cuando cambia el paso
  useEffect(() => {
    console.log('Step Navigation - Current Step:', formData.paso);
    console.log('Is Step Valid:', isCurrentStepValid);
    console.log('Tipo de Remitente:', formData.tipoRemitente);
  }, [formData.paso, isCurrentStepValid, formData.tipoRemitente]);

  /**
   * Guarda los datos del paso actual en la API
   * @returns Promise<boolean> - True si se guardó correctamente, false en caso contrario
   */
  const saveCurrentStepData = async (): Promise<boolean> => {
    // Si no estamos en el primer paso, simplemente continuamos
    if (formData.paso !== 1) {
      return true;
    }

    setLoading(true);
    setError(null);
    setApiStatus('Guardando datos...');

    try {
      // Manejo según tipo de remitente
      if (formData.tipoRemitente === 'persona') {
        return await handlePersonaData();
      } 
      else if (formData.tipoRemitente === 'entidad') {
        return await handleEntidadData();
      } 
      else if (formData.tipoRemitente === 'organizacion') {
        return await handleOrganizacionData();
      }
      
      setLoading(false);
      return true;
    } catch (err: unknown) {
      return handleError(err);
    }
  };

  /**
   * Maneja el envío de datos de persona
   */
  const handlePersonaData = async (): Promise<boolean> => {
    // Verificar si todos los campos requeridos son válidos
    const requiredFields = ['nombres', 'primerApellido', 'numeroDocumento', 'email', 'numeroContacto'];
    if (!validateRequiredFields(requiredFields)) {
      return false;
    }

    // Preparar datos de persona
    const personaData = {
      tipoDocumento: formData.datosPersona?.tipoDocumento || 'CC',
      numeroDocumento: formData.datosPersona?.numeroDocumento || '',
      nombres: formData.datosPersona?.nombres || '',
      primerApellido: formData.datosPersona?.primerApellido || '',
      segundoApellido: formData.datosPersona?.segundoApellido,
      email: formData.datosPersona?.email || '',
      numeroContacto: formData.datosPersona?.numeroContacto || '',
      remitenteId: formData.datosPersona?.remitenteId || null
    };

    try {
      // Enviar datos al API - el backend determina si crear o actualizar
      const response = await RemitenteAPI.saveStep1Data(personaData);
      
      setApiStatus('¡Datos guardados correctamente!');
      console.log('Datos de persona enviados:', response);
      
      // Guardar el ID del remitente para referencia si es necesario
      if (response && response.id && !formData.datosPersona?.remitenteId) {
        updateFormData({
          datosPersona: {
            ...formData.datosPersona,
            remitenteId: response.id.toString()
          }
        });
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      return handleError(error);
    }
  };

  /**
   * Maneja el envío de datos de entidad
   */
  const handleEntidadData = async (): Promise<boolean> => {
    // Verificar si todos los campos requeridos son válidos
    const requiredFields = ['nombre', 'nit', 'email', 'telefono'];
    if (!validateRequiredFields(requiredFields)) {
      return false;
    }

    // Preparar datos de entidad
    const entidadData = {
      nombre: formData.datosEntidad?.nombre || '',
      nit: formData.datosEntidad?.nit || '',
      email: formData.datosEntidad?.email || '',
      telefono: formData.datosEntidad?.telefono || '',
      remitenteId: formData.datosEntidad?.remitenteId || null
    };

    try {
      // Enviar datos al API - el backend determina si crear o actualizar
      const response = await RemitenteAPI.saveEntidadData(entidadData);
      
      setApiStatus('¡Datos guardados correctamente!');
      console.log('Datos de entidad enviados:', response);
      
      // Guardar el ID del remitente para referencia si es necesario
      if (response && response.id && !formData.datosEntidad?.remitenteId) {
        updateFormData({
          datosEntidad: {
            ...formData.datosEntidad,
            remitenteId: response.id.toString()
          }
        });
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      return handleError(error);
    }
  };

  /**
   * Maneja el envío de datos de organización
   */
  const handleOrganizacionData = async (): Promise<boolean> => {
    // Verificar si todos los campos requeridos son válidos
    const requiredFields = ['nombreOrganizacion', 'razonOrganizacion', 'email', 'numeroContacto'];
    if (!validateRequiredFields(requiredFields)) {
      return false;
    }

    // Preparar datos de organización
    const organizacionData = {
      nombreOrganizacion: formData.datosOrganizacion?.nombreOrganizacion || '',
      razonOrganizacion: formData.datosOrganizacion?.razonOrganizacion || '',
      email: formData.datosOrganizacion?.email || '',
      numeroContacto: formData.datosOrganizacion?.numeroContacto || '',
      remitenteId: formData.datosOrganizacion?.remitenteId || null
    };

    try {
      // Enviar datos al API - el backend determina si crear o actualizar
      const response = await RemitenteAPI.saveOrganizacionData(organizacionData);
      
      setApiStatus('¡Datos guardados correctamente!');
      console.log('Datos de organización enviados:', response);
      
      // Guardar el ID del remitente para referencia si es necesario
      if (response && response.id && !formData.datosOrganizacion?.remitenteId) {
        updateFormData({
          datosOrganizacion: {
            ...formData.datosOrganizacion,
            remitenteId: response.id.toString()
          }
        });
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      return handleError(error);
    }
  };

  /**
   * Valida que todos los campos requeridos sean válidos
   * @param fields Array de nombres de campos a validar
   * @returns boolean - True si todos los campos son válidos
   */
  const validateRequiredFields = (fields: string[]): boolean => {
    const allValid = fields.every(field => validationState[field]?.isValid === true);

    if (!allValid) {
      setError('Por favor complete todos los campos obligatorios correctamente');
      setLoading(false);
      return false;
    }
    
    return true;
  };

  /**
   * Maneja los errores de las peticiones API
   * @param err Error capturado
   * @returns boolean - Siempre devuelve false en caso de error
   */
  const handleError = (err: unknown): boolean => {
    console.error('Error al enviar datos:', err);
    
    // Utilizamos type narrowing para manejar diferentes tipos de errores
    if (err && typeof err === 'object' && 'response' in err) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(apiError.response?.data?.message || 'Error al enviar los datos');
    } else {
      setError('Error al procesar la solicitud');
    }
    
    setApiStatus('Error al procesar la solicitud');
    setLoading(false);
    return false;
  };

  /**
   * Manejador del botón "Siguiente"
   */
  const handleNext = async () => {
    console.log('Handle Next clicked', {
      currentStep: formData.paso,
      isValid: isCurrentStepValid,
      tipoRemitente: formData.tipoRemitente
    });

    // Si el paso actual no es válido, no continuamos
    if (!isCurrentStepValid) {
      return;
    }

    // Intentar guardar los datos a la API antes de avanzar
    const saveSuccess = await saveCurrentStepData();
    
    // Solo avanzar si la operación de guardado fue exitosa o no era necesaria
    if (saveSuccess) {
      // Limpiamos los mensajes de estado para el siguiente paso
      setApiStatus('');
      setError(null);
      nextStep();
    }
  };

  /**
   * Manejador del botón "Volver"
   */
  const handlePrev = () => {
    console.log('Handle Previous clicked', {
      currentStep: formData.paso
    });
    
    // Limpiar mensajes de estado al regresar
    setApiStatus('');
    setError(null);
    prevStep();
  };

  /**
   * Manejador del botón "Finalizar y enviar"
   */
  const handleSubmit = async () => {
    // Validar y guardar el último paso
    const saveSuccess = await saveCurrentStepData();
    
    if (saveSuccess) {
      // Aquí puedes implementar la lógica de envío final del formulario
      console.log('Formulario completado:', formData);
      setApiStatus('¡Formulario enviado con éxito!');
      // Ejemplo: llamada a API, redirección, etc.
    }
  };

  /**
   * Determina si estamos en el último paso del formulario
   * @returns boolean - True si estamos en el último paso
   */
  const isLastStep = () => {
    switch (formData.tipoRemitente) {
      case 'persona':
        return formData.paso === 3;
      case 'entidad':
      case 'organizacion':
        return formData.paso === 2;
      default:
        return false;
    }
  };

  return (
    <div className="flex flex-col mt-6">
      {/* Mostrar mensajes de estado y errores */}
      {apiStatus && (
        <div className={`p-4 rounded-md mb-4 ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
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

      {/* Botones de navegación */}
      <div className="flex justify-between">
        {formData.paso > 1 && (
          <button
            onClick={handlePrev}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
            disabled={loading}
            aria-label="Volver al paso anterior"
          >
            Volver
          </button>
        )}
        
        {!isLastStep() ? (
          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid || loading}
            className={`px-6 py-2 rounded-md ml-auto transition-colors ${
              isCurrentStepValid && !loading
                ? "bg-pink-500 text-white hover:bg-pink-600" 
                : "bg-pink-300 text-white cursor-not-allowed"
            }`}
            aria-label="Continuar al siguiente paso"
          >
            {loading ? "Procesando..." : "Siguiente"}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isCurrentStepValid || loading}
            className={`px-6 py-2 rounded-md ml-auto transition-colors ${
              isCurrentStepValid && !loading
                ? "bg-pink-500 text-white hover:bg-pink-600" 
                : "bg-pink-300 text-white cursor-not-allowed"
            }`}
            aria-label="Finalizar el formulario"
          >
            {loading ? "Procesando..." : "Finalizar y enviar"}
          </button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;