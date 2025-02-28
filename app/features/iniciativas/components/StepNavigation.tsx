'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from '../context/FormContext';
import { RemitenteAPI } from '@/services/api/remitente';
import { IniciativaAPI } from '@/services/api/iniciativa';
import { useFormStorage } from '../hooks/useFormStorage';

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
    validateCurrentStep,
    validationState
  } = useFormContext();
  
  // Estados locales para controlar UI
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  // Loguear información relevante solo cuando cambia el paso o validación
  useEffect(() => {
    console.log('Step Navigation - Current Step:', formData.paso);
    console.log('Is Step Valid:', isCurrentStepValid);
    console.log('Tipo de Remitente:', formData.tipoRemitente);
    console.log('Validation State:', validationState);
  }, [formData.paso, isCurrentStepValid, formData.tipoRemitente, validationState]);

  /**
   * Comprueba si los campos requeridos están presentes y son válidos
   * @returns boolean - Verdadero si todos los campos son válidos
   */
  const validateRequiredFields = (fields: string[]): boolean => {
    console.log('Validando campos:', fields);
    
    // Forzar validación actual antes de verificar campos
    const isValid = validateCurrentStep();
    
    if (!isValid) {
      let mensajeError = 'Por favor complete todos los campos obligatorios correctamente';
      
      // Revisar si hay mensajes específicos de error para mostrar
      const camposConError = fields.filter(field => 
        !validationState[field]?.isValid && validationState[field]?.message
      );
      
      if (camposConError.length > 0) {
        const primerCampoError = camposConError[0];
        mensajeError = validationState[primerCampoError]?.message || mensajeError;
      }
      
      setError(mensajeError);
      setLoading(false);
      return false;
    }
    
    return true;
  };

  /**
   * Guarda los datos del paso actual en la API
   * @returns Promise<boolean> - True si se guardó correctamente, false en caso contrario
   */
  const saveCurrentStepData = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Determinar qué guardar según el paso actual
      if (formData.paso === 1) {
        setApiStatus('Guardando datos del remitente...');
        
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
      } 
      else if (formData.paso === 2) {
        setApiStatus('Guardando datos de la iniciativa...');
        return await handleIniciativaData();
      }
      
      // Si no es un paso que requiera guardar datos
      setLoading(false);
      return true;
    } catch (err: unknown) {
      return handleError(err);
    }
  };

  /**
   * Maneja el envío de datos de iniciativa
   */
  const handleIniciativaData = async (): Promise<boolean> => {
    try {
      // Determinar tipo de remitente y preparar datos para API
      let iniciativaData;
      let remitenteId;
      
      // Validar campos según tipo de remitente
      if (formData.tipoRemitente === 'persona') {
        // Verificar campos requeridos para persona
        const requiredFields = ['tipoProyecto', 'titulo', 'descripcion', 'poblacionBeneficiada', 'valorTotal'];
        if (!validateRequiredFields(requiredFields)) return false;
        
        remitenteId = formData.datosPersona?.remitenteId;
        if (!remitenteId) {
          setError('Error: No se encontró el ID del remitente. Por favor complete el paso 1.');
          setLoading(false);
          return false;
        }
        
        // Preparar datos para la API conforme a la interfaz IniciativaCreateDTO
        iniciativaData = {
          entidad: parseInt(process.env.NEXT_PUBLIC_ENTIDAD_ID || '1'),
          radicado_por: parseInt(remitenteId),
          tipo_proyecto: formData.datosPersona?.tipoProyecto || '',
          titulo: formData.datosPersona?.titulo || '',
          descripcion: formData.datosPersona?.descripcion || '',
          poblacion_beneficiada: formData.datosPersona?.poblacionBeneficiada || '',
          valor_total: formData.datosPersona?.valorTotal || '',
          creado_desde: 'persona',
          radicado: null // Enviar null para que el backend genere automáticamente
        };
      } 
      else if (formData.tipoRemitente === 'entidad') {
        // Verificar campos requeridos para entidad
        const requiredFields = ['tipoProyecto', 'titulo', 'descripcion', 'poblacionBeneficiada', 'valorTotal'];
        if (!validateRequiredFields(requiredFields)) return false;
        
        remitenteId = formData.datosEntidad?.remitenteId;
        if (!remitenteId) {
          setError('Error: No se encontró el ID del remitente. Por favor complete el paso 1.');
          setLoading(false);
          return false;
        }
        
        // Preparar datos para la API conforme a la interfaz IniciativaCreateDTO
        iniciativaData = {
          entidad: parseInt(process.env.NEXT_PUBLIC_ENTIDAD_ID || '1'),
          radicado_por: parseInt(remitenteId),
          tipo_proyecto: formData.datosEntidad?.tipoProyecto || '',
          titulo: formData.datosEntidad?.titulo || '',
          descripcion: formData.datosEntidad?.descripcion || '',
          poblacion_beneficiada: formData.datosEntidad?.poblacionBeneficiada || '',
          valor_total: formData.datosEntidad?.valorTotal || '',
          creado_desde: 'entidad',
          radicado: null // Enviar null para que el backend genere automáticamente
        };
      }
      else if (formData.tipoRemitente === 'organizacion') {
        // Verificar campos requeridos para organización
        const requiredFields = ['tipoProyecto', 'titulo', 'descripcion', 'poblacionBeneficiada', 'valorTotal'];
        if (!validateRequiredFields(requiredFields)) return false;
        
        remitenteId = formData.datosOrganizacion?.remitenteId;
        if (!remitenteId) {
          setError('Error: No se encontró el ID del remitente. Por favor complete el paso 1.');
          setLoading(false);
          return false;
        }
        
        // Preparar datos para la API conforme a la interfaz IniciativaCreateDTO
        iniciativaData = {
          entidad: parseInt(process.env.NEXT_PUBLIC_ENTIDAD_ID || '1'),
          radicado_por: parseInt(remitenteId),
          tipo_proyecto: formData.datosOrganizacion?.tipoProyecto || '',
          titulo: formData.datosOrganizacion?.titulo || '',
          descripcion: formData.datosOrganizacion?.descripcion || '',
          poblacion_beneficiada: formData.datosOrganizacion?.poblacionBeneficiada || '',
          valor_total: formData.datosOrganizacion?.valorTotal || '',
          creado_desde: 'organizacion',
          radicado: null // Enviar null para que el backend genere automáticamente
        };
      } else {
        setError('Tipo de remitente no válido');
        setLoading(false);
        return false;
      }
      
      // Enviar datos al API
      const response = await IniciativaAPI.create(iniciativaData);
      
      // Manejar la respuesta según el tipo de remitente
      setApiStatus('¡Datos de la iniciativa guardados correctamente!');
      console.log('Iniciativa creada:', response);
      
      if (response && response.id) {
        if (formData.tipoRemitente === 'persona') {
          updateFormData({
            datosPersona: {
              ...formData.datosPersona,
              iniciativaId: response.id.toString(),
              radicado: response.radicado
            }
          });
        } else if (formData.tipoRemitente === 'entidad') {
          updateFormData({
            datosEntidad: {
              ...formData.datosEntidad,
              iniciativaId: response.id.toString(),
              radicado: response.radicado
            }
          });
        } else if (formData.tipoRemitente === 'organizacion') {
          updateFormData({
            datosOrganizacion: {
              ...formData.datosOrganizacion,
              iniciativaId: response.id.toString(),
              radicado: response.radicado
            }
          });
        }
      }
      
      setSuccess(true);
      setLoading(false);
      return true;
    } catch (error) {
      return handleError(error);
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
      if (response && response.data && response.data.id && !formData.datosPersona?.remitenteId) {
        updateFormData({
          datosPersona: {
            ...formData.datosPersona,
            remitenteId: response.data.id.toString()
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
      if (response && response.data && response.data.id && !formData.datosEntidad?.remitenteId) {
        updateFormData({
          datosEntidad: {
            ...formData.datosEntidad,
            remitenteId: response.data.id.toString()
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
      if (response && response.data && response.data.id && !formData.datosOrganizacion?.remitenteId) {
        updateFormData({
          datosOrganizacion: {
            ...formData.datosOrganizacion,
            remitenteId: response.data.id.toString()
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
    } else if (err instanceof Error) {
      setError(err.message || 'Error al procesar la solicitud');
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

    // Forzar validación antes de continuar
    const stepValid = validateCurrentStep();
    
    // Si el paso actual no es válido, no continuamos
    if (!stepValid) {
      setError('Por favor complete todos los campos correctamente antes de continuar');
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
    const stepValid = validateCurrentStep();
    
    if (!stepValid) {
      setError('Por favor complete todos los campos correctamente antes de enviar');
      return;
    }
    
    const saveSuccess = await saveCurrentStepData();
    
    if (saveSuccess) {
      // Aquí puedes implementar la lógica de envío final del formulario
      console.log('Formulario completado:', formData);
      setApiStatus('¡Formulario enviado con éxito!');
      setSuccess(true);
      
      // Cuando se completa el formulario, se podría mostrar un modal de confirmación
      // o redirigir a una página de éxito
      const completadoMensaje = formData.tipoRemitente === 'persona' && formData.datosPersona?.radicado
        ? `Iniciativa registrada con éxito. Su número de radicado es: ${formData.datosPersona.radicado}`
        : formData.tipoRemitente === 'entidad' && formData.datosEntidad?.radicado
        ? `Iniciativa registrada con éxito. Su número de radicado es: ${formData.datosEntidad.radicado}`
        : formData.tipoRemitente === 'organizacion' && formData.datosOrganizacion?.radicado
        ? `Iniciativa registrada con éxito. Su número de radicado es: ${formData.datosOrganizacion.radicado}`
        : 'Iniciativa registrada con éxito';
        
      // Mostrar alerta con el número de radicado
      setTimeout(() => {
        alert(completadoMensaje);
        
        // Preguntar si desea registrar otra iniciativa
        const registrarOtra = confirm("¿Desea registrar otra iniciativa?");
        
        if (registrarOtra) {
          // Limpiar formulario pero conservar datos del remitente
          const tipoRemitente = formData.tipoRemitente;
          let remitenteId = '';
          
          if (tipoRemitente === 'persona' && formData.datosPersona?.remitenteId) {
            remitenteId = formData.datosPersona.remitenteId;
          } else if (tipoRemitente === 'entidad' && formData.datosEntidad?.remitenteId) {
            remitenteId = formData.datosEntidad.remitenteId;
          } else if (tipoRemitente === 'organizacion' && formData.datosOrganizacion?.remitenteId) {
            remitenteId = formData.datosOrganizacion.remitenteId;
          }
          
          // Reset formulario pero conservar tipo y remitente
          updateFormData({
            paso: 1,
            tipoRemitente,
            datosPersona: tipoRemitente === 'persona' ? { remitenteId } : undefined,
            datosEntidad: tipoRemitente === 'entidad' ? { remitenteId } : undefined,
            datosOrganizacion: tipoRemitente === 'organizacion' ? { remitenteId } : undefined
          });
          
          setSuccess(false);
        } else {
          // Si no quiere registrar otra, limpiar todo
          // Aquí podrías redirigir a una página de inicio o de confirmación
        }
      }, 500);
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

      {/* Mensaje de éxito cuando se completa el formulario */}
      {success && (
        <div className="p-4 bg-green-100 text-green-800 rounded-md mb-4">
          <p className="font-bold text-lg">¡Iniciativa registrada con éxito!</p>
          {formData.tipoRemitente === 'persona' && formData.datosPersona?.radicado && (
            <p className="mt-2">Número de radicado: <span className="font-mono font-semibold">{formData.datosPersona.radicado}</span></p>
          )}
          {formData.tipoRemitente === 'entidad' && formData.datosEntidad?.radicado && (
            <p className="mt-2">Número de radicado: <span className="font-mono font-semibold">{formData.datosEntidad.radicado}</span></p>
          )}
          {formData.tipoRemitente === 'organizacion' && formData.datosOrganizacion?.radicado && (
            <p className="mt-2">Número de radicado: <span className="font-mono font-semibold">{formData.datosOrganizacion.radicado}</span></p>
          )}
          <p className="mt-1 text-sm">Por favor guarde este número para futuras consultas.</p>
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
            type="button"
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
            type="button"
          >
            {loading ? "Procesando..." : "Finalizar y enviar"}
          </button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;