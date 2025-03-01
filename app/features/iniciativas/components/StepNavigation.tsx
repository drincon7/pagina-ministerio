'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from '../context/FormContext';
import StatusMessage from '@/components/StatusMessage';
import NavigationButtons from '@/components/NavigationButtons';
import FormSubmissionService from '@/services/formSubmissionService';

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
   * Maneja el envío de datos de persona
   */
  const handlePersonaData = async (): Promise<boolean> => {
    // Verificar si todos los campos requeridos son válidos
    const requiredFields = ['nombres', 'primerApellido', 'numeroDocumento', 'email', 'numeroContacto'];
    if (!validateRequiredFields(requiredFields)) {
      return false;
    }

    try {
      // Usar el servicio para manejar la llamada a la API
      const response = await FormSubmissionService.savePersonaData(formData);
      
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

    try {
      // Usar el servicio para manejar la llamada a la API
      const response = await FormSubmissionService.saveEntidadData(formData);
      
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

    try {
      // Usar el servicio para manejar la llamada a la API
      const response = await FormSubmissionService.saveOrganizacionData(formData);
      
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
   * Maneja el envío de datos de iniciativa
   */
  const handleIniciativaData = async (): Promise<boolean> => {
    try {
      // Validar campos según tipo de remitente
      if (formData.tipoRemitente === 'persona') {
        // Verificar campos requeridos para persona
        const requiredFields = ['tipoProyecto', 'titulo', 'descripcion', 'poblacionBeneficiada', 'valorTotal'];
        if (!validateRequiredFields(requiredFields)) return false;
      } 
      else if (formData.tipoRemitente === 'entidad') {
        // Verificar campos requeridos para entidad
        const requiredFields = ['tipoProyecto', 'titulo', 'descripcion', 'poblacionBeneficiada', 'valorTotal'];
        if (!validateRequiredFields(requiredFields)) return false;
      }
      else if (formData.tipoRemitente === 'organizacion') {
        // Verificar campos requeridos para organización
        const requiredFields = ['tipoProyecto', 'titulo', 'descripcion', 'poblacionBeneficiada', 'valorTotal'];
        if (!validateRequiredFields(requiredFields)) return false;
      }
      
      // Enviar datos usando el servicio
      const response = await FormSubmissionService.saveIniciativaData(formData);
      
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
  
  // Determinar el número de radicado según el tipo de remitente
  const getCurrentRadicado = () => {
    if (formData.tipoRemitente === 'persona' && formData.datosPersona?.radicado) {
      return formData.datosPersona.radicado;
    } 
    if (formData.tipoRemitente === 'entidad' && formData.datosEntidad?.radicado) {
      return formData.datosEntidad.radicado;
    }
    if (formData.tipoRemitente === 'organizacion' && formData.datosOrganizacion?.radicado) {
      return formData.datosOrganizacion.radicado;
    }
    return undefined;
  };

  return (
    <div className="flex flex-col mt-6">
      {/* Componente de mensajes de estado */}
      <StatusMessage 
        apiStatus={apiStatus}
        error={error}
        onErrorClose={() => setError(null)}
        isSuccess={success}
        radicado={getCurrentRadicado()}
      />

      {/* Botones de navegación */}
      <NavigationButtons 
        currentStep={formData.paso}
        isLastStep={isLastStep()}
        isCurrentStepValid={isCurrentStepValid}
        loading={loading}
        onPrevious={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default StepNavigation;