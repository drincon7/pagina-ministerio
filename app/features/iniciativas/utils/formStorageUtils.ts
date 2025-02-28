'use client';

import { FormData } from '../types/formTypes';

// Claves para localStorage
export const STORAGE_KEYS = {
  // Datos completos
  FORM_DATA: 'iniciativas_form_data',
  
  // Datos por tipo de remitente
  TIPO_REMITENTE: 'iniciativas_tipo_remitente',
  PERSONA_DATA: 'iniciativas_persona_data',
  ENTIDAD_DATA: 'iniciativas_entidad_data',
  ORGANIZACION_DATA: 'iniciativas_organizacion_data',
  CURRENT_STEP: 'iniciativas_current_step',
  
  // IDs y radicados
  REMITENTE_ID: 'remitenteId', // Se mantiene para compatibilidad
  INICIATIVA_ID: 'iniciativaId', // Se mantiene para compatibilidad
  RADICADO: 'radicado', // Se mantiene para compatibilidad
  
  // Nuevas claves con prefijo consistente
  REMITENTE_ID_NEW: 'iniciativas_remitente_id',
  INICIATIVA_ID_NEW: 'iniciativas_iniciativa_id',
  RADICADO_NEW: 'iniciativas_radicado',
  
  // Datos del último envío exitoso
  LAST_SUCCESS_REMITENTE_ID: 'lastSuccessRemitenteId',
  LAST_SUCCESS_INICIATIVA_ID: 'lastSuccessIniciativaId',
  LAST_SUCCESS_RADICADO: 'lastSuccessRadicado',
  LAST_SUCCESS_TIMESTAMP: 'lastSuccessTimestamp',
  
  // Historial de envíos
  HISTORY: 'iniciativas_history'
};

/**
 * Guarda los datos completos del formulario en localStorage
 */
export const saveFormData = (formData: FormData): void => {
  try {
    // Guardar datos completos
    localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
    
    // Guardar también por partes para más robustez
    localStorage.setItem(STORAGE_KEYS.TIPO_REMITENTE, formData.tipoRemitente);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, formData.paso.toString());
    
    // Guardar datos específicos según tipo de remitente
    if (formData.tipoRemitente === 'persona' && formData.datosPersona) {
      localStorage.setItem(STORAGE_KEYS.PERSONA_DATA, JSON.stringify(formData.datosPersona));
      
      // Guardar IDs relevantes
      if (formData.datosPersona.remitenteId) {
        localStorage.setItem(STORAGE_KEYS.REMITENTE_ID, formData.datosPersona.remitenteId);
        localStorage.setItem(STORAGE_KEYS.REMITENTE_ID_NEW, formData.datosPersona.remitenteId);
      }
      
      if (formData.datosPersona.iniciativaId) {
        localStorage.setItem(STORAGE_KEYS.INICIATIVA_ID, formData.datosPersona.iniciativaId);
        localStorage.setItem(STORAGE_KEYS.INICIATIVA_ID_NEW, formData.datosPersona.iniciativaId);
      }
      
      if (formData.datosPersona.radicado) {
        localStorage.setItem(STORAGE_KEYS.RADICADO, formData.datosPersona.radicado.toString());
        localStorage.setItem(STORAGE_KEYS.RADICADO_NEW, formData.datosPersona.radicado.toString());
      }
    }
    else if (formData.tipoRemitente === 'entidad' && formData.datosEntidad) {
      localStorage.setItem(STORAGE_KEYS.ENTIDAD_DATA, JSON.stringify(formData.datosEntidad));
      
      // Guardar IDs relevantes
      if (formData.datosEntidad.remitenteId) {
        localStorage.setItem(STORAGE_KEYS.REMITENTE_ID, formData.datosEntidad.remitenteId);
        localStorage.setItem(STORAGE_KEYS.REMITENTE_ID_NEW, formData.datosEntidad.remitenteId);
      }
      
      if (formData.datosEntidad.iniciativaId) {
        localStorage.setItem(STORAGE_KEYS.INICIATIVA_ID, formData.datosEntidad.iniciativaId);
        localStorage.setItem(STORAGE_KEYS.INICIATIVA_ID_NEW, formData.datosEntidad.iniciativaId);
      }
      
      if (formData.datosEntidad.radicado) {
        localStorage.setItem(STORAGE_KEYS.RADICADO, formData.datosEntidad.radicado.toString());
        localStorage.setItem(STORAGE_KEYS.RADICADO_NEW, formData.datosEntidad.radicado.toString());
      }
    }
    else if (formData.tipoRemitente === 'organizacion' && formData.datosOrganizacion) {
      localStorage.setItem(STORAGE_KEYS.ORGANIZACION_DATA, JSON.stringify(formData.datosOrganizacion));
      
      // Guardar IDs relevantes
      if (formData.datosOrganizacion.remitenteId) {
        localStorage.setItem(STORAGE_KEYS.REMITENTE_ID, formData.datosOrganizacion.remitenteId);
        localStorage.setItem(STORAGE_KEYS.REMITENTE_ID_NEW, formData.datosOrganizacion.remitenteId);
      }
      
      if (formData.datosOrganizacion.iniciativaId) {
        localStorage.setItem(STORAGE_KEYS.INICIATIVA_ID, formData.datosOrganizacion.iniciativaId);
        localStorage.setItem(STORAGE_KEYS.INICIATIVA_ID_NEW, formData.datosOrganizacion.iniciativaId);
      }
      
      if (formData.datosOrganizacion.radicado) {
        localStorage.setItem(STORAGE_KEYS.RADICADO, formData.datosOrganizacion.radicado.toString());
        localStorage.setItem(STORAGE_KEYS.RADICADO_NEW, formData.datosOrganizacion.radicado.toString());
      }
    }
    
    console.log('✅ Datos guardados en localStorage correctamente', formData);
  } catch (error) {
    console.error('❌ Error al guardar datos en localStorage:', error);
  }
};

/**
 * Carga los datos del formulario desde localStorage
 */
export const loadFormData = (): FormData | null => {
  try {
    // Intentar cargar datos completos primero
    const storedFormData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    if (storedFormData) {
      const parsedData = JSON.parse(storedFormData) as FormData;
      console.log('✅ Datos cargados desde localStorage (completos)', parsedData);
      return parsedData;
    }
    
    // Si no hay datos completos, intentar reconstruir desde las partes
    const storedTipoRemitente = localStorage.getItem(STORAGE_KEYS.TIPO_REMITENTE) as FormData['tipoRemitente'] | null;
    if (!storedTipoRemitente) {
      return null; // No hay datos suficientes
    }
    
    // Inicializar con los datos básicos
    const formData: Partial<FormData> = {
      paso: parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_STEP) || '1'),
      tipoRemitente: storedTipoRemitente
    };
    
    // Cargar datos específicos según tipo de remitente
    if (storedTipoRemitente === 'persona') {
      const storedPersonaData = localStorage.getItem(STORAGE_KEYS.PERSONA_DATA);
      if (storedPersonaData) {
        formData.datosPersona = JSON.parse(storedPersonaData);
      } else {
        // Reconstruir con datos individuales
        const remitenteId = localStorage.getItem(STORAGE_KEYS.REMITENTE_ID) || 
                           localStorage.getItem(STORAGE_KEYS.REMITENTE_ID_NEW);
        
        const iniciativaId = localStorage.getItem(STORAGE_KEYS.INICIATIVA_ID) || 
                            localStorage.getItem(STORAGE_KEYS.INICIATIVA_ID_NEW);
        
        const radicado = localStorage.getItem(STORAGE_KEYS.RADICADO) || 
                        localStorage.getItem(STORAGE_KEYS.RADICADO_NEW);
        
        if (remitenteId || iniciativaId || radicado) {
          formData.datosPersona = {
            remitenteId: remitenteId || '',
            iniciativaId: iniciativaId || undefined,
            radicado: radicado ? parseInt(radicado) : undefined
          };
        }
      }
    }
    else if (storedTipoRemitente === 'entidad') {
      const storedEntidadData = localStorage.getItem(STORAGE_KEYS.ENTIDAD_DATA);
      if (storedEntidadData) {
        formData.datosEntidad = JSON.parse(storedEntidadData);
      } else {
        // Reconstruir con datos individuales
        const remitenteId = localStorage.getItem(STORAGE_KEYS.REMITENTE_ID) || 
                           localStorage.getItem(STORAGE_KEYS.REMITENTE_ID_NEW);
        
        const iniciativaId = localStorage.getItem(STORAGE_KEYS.INICIATIVA_ID) || 
                            localStorage.getItem(STORAGE_KEYS.INICIATIVA_ID_NEW);
        
        const radicado = localStorage.getItem(STORAGE_KEYS.RADICADO) || 
                        localStorage.getItem(STORAGE_KEYS.RADICADO_NEW);
        
        if (remitenteId || iniciativaId || radicado) {
          formData.datosEntidad = {
            remitenteId: remitenteId || '',
            iniciativaId: iniciativaId || undefined,
            radicado: radicado ? parseInt(radicado) : undefined
          };
        }
      }
    }
    else if (storedTipoRemitente === 'organizacion') {
      const storedOrganizacionData = localStorage.getItem(STORAGE_KEYS.ORGANIZACION_DATA);
      if (storedOrganizacionData) {
        formData.datosOrganizacion = JSON.parse(storedOrganizacionData);
      } else {
        // Reconstruir con datos individuales
        const remitenteId = localStorage.getItem(STORAGE_KEYS.REMITENTE_ID) || 
                           localStorage.getItem(STORAGE_KEYS.REMITENTE_ID_NEW);
        
        const iniciativaId = localStorage.getItem(STORAGE_KEYS.INICIATIVA_ID) || 
                            localStorage.getItem(STORAGE_KEYS.INICIATIVA_ID_NEW);
        
        const radicado = localStorage.getItem(STORAGE_KEYS.RADICADO) || 
                        localStorage.getItem(STORAGE_KEYS.RADICADO_NEW);
        
        if (remitenteId || iniciativaId || radicado) {
          formData.datosOrganizacion = {
            remitenteId: remitenteId || '',
            iniciativaId: iniciativaId || undefined,
            radicado: radicado ? parseInt(radicado) : undefined
          };
        }
      }
    }
    
    console.log('✅ Datos reconstruidos desde localStorage', formData);
    return formData as FormData;
  } catch (error) {
    console.error('❌ Error al cargar datos desde localStorage:', error);
    return null;
  }
};

/**
 * Guarda información de envío exitoso
 */
export const saveSuccessData = (
  remitenteId: string, 
  iniciativaId: string, 
  radicado: string | number
): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SUCCESS_REMITENTE_ID, remitenteId);
    localStorage.setItem(STORAGE_KEYS.LAST_SUCCESS_INICIATIVA_ID, iniciativaId);
    localStorage.setItem(STORAGE_KEYS.LAST_SUCCESS_RADICADO, radicado.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_SUCCESS_TIMESTAMP, new Date().toISOString());
    
    // Agregar al historial de envíos
    const historyItem = {
      remitenteId,
      iniciativaId,
      radicado: radicado.toString(),
      timestamp: new Date().toISOString()
    };
    
    // Cargar historial existente
    const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    
    // Añadir nuevo elemento al historial
    history.push(historyItem);
    
    // Limitar el historial a los últimos 10 elementos
    const limitedHistory = history.slice(-10);
    
    // Guardar historial actualizado
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limitedHistory));
    
    console.log('✅ Datos de éxito guardados en localStorage', historyItem);
  } catch (error) {
    console.error('❌ Error al guardar datos de éxito en localStorage:', error);
  }
};

/**
 * Limpia todos los datos del formulario en localStorage
 * @param preserveRemitente Si es true, mantiene los datos del remitente
 */
export const clearFormData = (preserveRemitente: boolean = false): void => {
  try {
    // Si queremos preservar el remitente, guardamos los datos antes de limpiar
    let remitenteId = '';
    let tipoRemitente = '';
    
    if (preserveRemitente) {
      tipoRemitente = localStorage.getItem(STORAGE_KEYS.TIPO_REMITENTE) || '';
      remitenteId = localStorage.getItem(STORAGE_KEYS.REMITENTE_ID) || 
                   localStorage.getItem(STORAGE_KEYS.REMITENTE_ID_NEW) || '';
    }
    
    // Limpiar todas las claves excepto historial
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.HISTORY && 
          !key.startsWith('lastSuccess')) { // Mantener el historial y datos de éxito
        localStorage.removeItem(key);
      }
    });
    
    // Si es necesario, restaurar datos del remitente
    if (preserveRemitente && remitenteId && tipoRemitente) {
      localStorage.setItem(STORAGE_KEYS.TIPO_REMITENTE, tipoRemitente);
      localStorage.setItem(STORAGE_KEYS.REMITENTE_ID, remitenteId);
      localStorage.setItem(STORAGE_KEYS.REMITENTE_ID_NEW, remitenteId);
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, '1'); // Volver al paso 1
      
      // Restaurar datos específicos del tipo de remitente
      if (tipoRemitente === 'persona') {
        localStorage.setItem(STORAGE_KEYS.PERSONA_DATA, JSON.stringify({ remitenteId }));
      }
      else if (tipoRemitente === 'entidad') {
        localStorage.setItem(STORAGE_KEYS.ENTIDAD_DATA, JSON.stringify({ remitenteId }));
      }
      else if (tipoRemitente === 'organizacion') {
        localStorage.setItem(STORAGE_KEYS.ORGANIZACION_DATA, JSON.stringify({ remitenteId }));
      }
    }
    
    console.log('🧹 Datos del formulario limpiados de localStorage');
  } catch (error) {
    console.error('❌ Error al limpiar datos del formulario en localStorage:', error);
  }
};

/**
 * Guarda un campo individual del formulario
 */
export const saveFormField = (
  fieldType: 'persona' | 'entidad' | 'organizacion',
  fieldName: string,
  value: any
): void => {
  try {
    // Cargar datos actuales
    const formData = loadFormData();
    if (!formData) {
      console.warn('⚠️ No hay datos del formulario para actualizar el campo');
      return;
    }
    
    // Actualizar el campo específico
    if (fieldType === 'persona' && formData.datosPersona) {
      formData.datosPersona = {
        ...formData.datosPersona,
        [fieldName]: value
      };
    }
    else if (fieldType === 'entidad' && formData.datosEntidad) {
      formData.datosEntidad = {
        ...formData.datosEntidad,
        [fieldName]: value
      };
    }
    else if (fieldType === 'organizacion' && formData.datosOrganizacion) {
      formData.datosOrganizacion = {
        ...formData.datosOrganizacion,
        [fieldName]: value
      };
    }
    
    // Guardar datos actualizados
    saveFormData(formData);
    console.log(`✅ Campo ${fieldName} guardado en localStorage`, value);
  } catch (error) {
    console.error(`❌ Error al guardar campo ${fieldName} en localStorage:`, error);
  }
};

/**
 * Comprueba si hay datos guardados en localStorage
 */
export const hasStoredFormData = (): boolean => {
  try {
    const storedFormData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    const storedTipoRemitente = localStorage.getItem(STORAGE_KEYS.TIPO_REMITENTE);
    
    return !!(storedFormData || storedTipoRemitente);
  } catch (error) {
    console.error('❌ Error al verificar datos en localStorage:', error);
    return false;
  }
};

export default {
  saveFormData,
  loadFormData,
  saveSuccessData,
  clearFormData,
  saveFormField,
  hasStoredFormData,
  STORAGE_KEYS
};