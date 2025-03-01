'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from '../context/FormContext';
import StatusMessage from '@/components/StatusMessage';
import NavigationButtons from '@/components/NavigationButtons';
import { useApiService, ErrorMessage } from '@/features/iniciativas/utils/api-service';

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
  
  // Usar el servicio API centralizado
  const { 
    isLoading, 
    errorMessage, 
    showError, 
    apiGet, 
    apiPost, 
    clearErrors 
  } = useApiService();
  
  // Estados locales para controlar UI (mantenemos algunos que son específicos)
  const [error, setError] = useState<string | null>(null);
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
      // Usar el nuevo método apiPost en lugar de FormSubmissionService directamente
      const payload = {
        identificacion: formData.datosPersona?.numeroDocumento,
        nombres: formData.datosPersona?.nombres,
        primer_apellido: formData.datosPersona?.primerApellido,
        segundo_apellido: formData.datosPersona?.segundoApellido,
        email: formData.datosPersona?.email,
        telefono: formData.datosPersona?.numeroContacto,
        tipo: 1, // Tipo persona
      };
      
      const { success, data } = await apiPost('/api/remitente/', payload);
      
      if (success && data && data.data && data.data.id) {
        // Guardar el ID del remitente para referencia si es necesario
        updateFormData({
          datosPersona: {
            ...formData.datosPersona,
            remitenteId: data.data.id.toString()
          }
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error al enviar datos de persona:', error);
      return false;
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
      // Preparar payload para la API de entidades
      const payload = {
        // Adaptar según la estructura esperada por tu API
        nombre: formData.datosEntidad?.nombre,
        nit: formData.datosEntidad?.nit,
        email: formData.datosEntidad?.email,
        telefono: formData.datosEntidad?.telefono,
        // Otros campos relevantes
      };
      
      const { success, data } = await apiPost('/api/entidad/', payload);
      
      if (success && data && data.data && data.data.id) {
        updateFormData({
          datosEntidad: {
            ...formData.datosEntidad,
            remitenteId: data.data.id.toString()
          }
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error al enviar datos de entidad:', error);
      return false;
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
      // Preparar payload para la API de organizaciones
      const payload = {
        // Adaptar según la estructura esperada por tu API
        nombre_organizacion: formData.datosOrganizacion?.nombreOrganizacion,
        razon_organizacion: formData.datosOrganizacion?.razonOrganizacion,
        email: formData.datosOrganizacion?.email,
        telefono: formData.datosOrganizacion?.numeroContacto,
        // Otros campos relevantes
      };
      
      const { success, data } = await apiPost('/api/organizacion/', payload);
      
      if (success && data && data.data && data.data.id) {
        updateFormData({
          datosOrganizacion: {
            ...formData.datosOrganizacion,
            remitenteId: data.data.id.toString()
          }
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error al enviar datos de organización:', error);
      return false;
    }
  };

  // Define una interfaz para el payload con todas las propiedades posibles
  interface IniciativaPayload {
    radicado_por?: string;
    entidad: number;
    tipo_proyecto?: string;
    titulo?: string;
    descripcion?: string;
    poblacion_beneficiada?: string;
    valor_total?: string;
    creado_desde: string;
  }
  
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
      
      // Preparar payload según el tipo de remitente
      const entidadId = 1; // Usar el ID de entidad apropiado
      
      // Inicializar con el tipo explícito
      const payload: IniciativaPayload = {
        entidad: entidadId,
        creado_desde: 'web'
      };
      
      if (formData.tipoRemitente === 'persona' && formData.datosPersona) {
        payload.radicado_por = formData.datosPersona.remitenteId;
        payload.tipo_proyecto = formData.datosPersona.tipoProyecto || '';
        payload.titulo = formData.datosPersona.titulo || '';
        payload.descripcion = formData.datosPersona.descripcion || '';
        payload.poblacion_beneficiada = formData.datosPersona.poblacionBeneficiada || '';
        payload.valor_total = formData.datosPersona.valorTotal || '';
      } else if (formData.tipoRemitente === 'entidad' && formData.datosEntidad) {
        payload.radicado_por = formData.datosEntidad.remitenteId;
        payload.tipo_proyecto = formData.datosEntidad.tipoProyecto || '';
        payload.titulo = formData.datosEntidad.titulo || '';
        payload.descripcion = formData.datosEntidad.descripcion || '';
        payload.poblacion_beneficiada = formData.datosEntidad.poblacionBeneficiada || '';
        payload.valor_total = formData.datosEntidad.valorTotal || '';
      } else if (formData.tipoRemitente === 'organizacion' && formData.datosOrganizacion) {
        payload.radicado_por = formData.datosOrganizacion.remitenteId;
        payload.tipo_proyecto = formData.datosOrganizacion.tipoProyecto || '';
        payload.titulo = formData.datosOrganizacion.titulo || '';
        payload.descripcion = formData.datosOrganizacion.descripcion || '';
        payload.poblacion_beneficiada = formData.datosOrganizacion.poblacionBeneficiada || '';
        payload.valor_total = formData.datosOrganizacion.valorTotal || '';
      }
      
      // Enviar datos usando el servicio API centralizado
      const { success, data } = await apiPost(`/api/iniciativas/${entidadId}/`, payload);
      
      if (success && data && data.id) {
        if (formData.tipoRemitente === 'persona') {
          updateFormData({
            datosPersona: {
              ...formData.datosPersona,
              iniciativaId: data.id.toString(),
              radicado: data.radicado
            }
          });
        } else if (formData.tipoRemitente === 'entidad') {
          updateFormData({
            datosEntidad: {
              ...formData.datosEntidad,
              iniciativaId: data.id.toString(),
              radicado: data.radicado
            }
          });
        } else if (formData.tipoRemitente === 'organizacion') {
          updateFormData({
            datosOrganizacion: {
              ...formData.datosOrganizacion,
              iniciativaId: data.id.toString(),
              radicado: data.radicado
            }
          });
        }
      }
      
      setSuccess(true);
      return success;
    } catch (error) {
      console.error('Error al enviar datos de iniciativa:', error);
      return false;
    }
  };

  /**
   * Guarda los datos del paso actual en la API
   * @returns Promise<boolean> - True si se guardó correctamente, false en caso contrario
   */
  const saveCurrentStepData = async (): Promise<boolean> => {
    clearErrors(); // Limpiar errores previos
    setError(null);

    try {
      // Determinar qué guardar según el paso actual
      if (formData.paso === 1) {
        // No mostrar mensaje de "Guardando datos del remitente..."
        
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
        // No mostrar mensaje de "Guardando datos de la iniciativa..."
        return await handleIniciativaData();
      }
      
      // Si no es un paso que requiera guardar datos
      return true;
    } catch (err: unknown) {
      console.error('Error al guardar datos:', err);
      setError(err instanceof Error ? err.message : 'Error al procesar la solicitud');
      return false;
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
      setError(null);
      clearErrors(); // Limpiar errores del servicio API
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
    setError(null);
    clearErrors(); // Limpiar errores del servicio API
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
      {/* Mostrar mensaje de error del servicio API */}
      <ErrorMessage show={showError} message={errorMessage} />
      
      {/* Componente de mensajes de estado (mantenemos para otros mensajes) */}
      <StatusMessage 
        apiStatus={''} // Ya no necesitamos mostrar "guardando datos..." o "datos guardados"
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
        loading={isLoading} // Ahora usamos isLoading del servicio API
        onPrevious={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default StepNavigation;