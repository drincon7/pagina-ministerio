'use client';

import { useEffect, useCallback } from 'react';
import { FormData } from '../types/formTypes';

// Claves para localStorage
const STORAGE_KEYS = {
  FORM_DATA: 'iniciativas_form_data',
  REMITENTE_TYPE: 'remitenteType',
  REMITENTE_ID: 'remitenteId',
  INICIATIVA_ID: 'iniciativaId',
  RADICADO: 'radicado'
};

/**
 * Hook personalizado para manejar la persistencia del formulario en localStorage
 */
export const useFormStorage = (
  formData: FormData, 
  updateFormData: (updates: Partial<FormData>) => void
) => {
  /**
   * Guarda los datos del formulario en localStorage
   */
  const saveFormToStorage = useCallback(() => {
    try {
      // Persistir todos los datos del formulario
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
      
      // Guardar el tipo de remitente para acceso rápido
      if (formData.tipoRemitente) {
        localStorage.setItem(STORAGE_KEYS.REMITENTE_TYPE, formData.tipoRemitente);
      }
      
      // Guardar IDs según el tipo de remitente
      if (formData.tipoRemitente === 'persona' && formData.datosPersona) {
        // Guardar ID del remitente si existe
        if (formData.datosPersona.remitenteId) {
          localStorage.setItem(STORAGE_KEYS.REMITENTE_ID, formData.datosPersona.remitenteId);
        }
        
        // Guardar ID de iniciativa si existe
        if (formData.datosPersona.iniciativaId) {
          localStorage.setItem(STORAGE_KEYS.INICIATIVA_ID, formData.datosPersona.iniciativaId);
        }
        
        // Guardar número de radicado si existe
        if (formData.datosPersona.radicado) {
          localStorage.setItem(STORAGE_KEYS.RADICADO, String(formData.datosPersona.radicado));
        }
      } 
      else if (formData.tipoRemitente === 'entidad' && formData.datosEntidad) {
        // Guardar ID del remitente si existe
        if (formData.datosEntidad.remitenteId) {
          localStorage.setItem(STORAGE_KEYS.REMITENTE_ID, formData.datosEntidad.remitenteId);
        }
        
        // Guardar ID de iniciativa si existe
        if (formData.datosEntidad.iniciativaId) {
          localStorage.setItem(STORAGE_KEYS.INICIATIVA_ID, formData.datosEntidad.iniciativaId);
        }
        
        // Guardar número de radicado si existe
        if (formData.datosEntidad.radicado) {
          localStorage.setItem(STORAGE_KEYS.RADICADO, String(formData.datosEntidad.radicado));
        }
      }
      else if (formData.tipoRemitente === 'organizacion' && formData.datosOrganizacion) {
        // Guardar ID del remitente si existe
        if (formData.datosOrganizacion.remitenteId) {
          localStorage.setItem(STORAGE_KEYS.REMITENTE_ID, formData.datosOrganizacion.remitenteId);
        }
        
        // Guardar ID de iniciativa si existe
        if (formData.datosOrganizacion.iniciativaId) {
          localStorage.setItem(STORAGE_KEYS.INICIATIVA_ID, formData.datosOrganizacion.iniciativaId);
        }
        
        // Guardar número de radicado si existe
        if (formData.datosOrganizacion.radicado) {
          localStorage.setItem(STORAGE_KEYS.RADICADO, String(formData.datosOrganizacion.radicado));
        }
      }
      
      console.log('✅ Datos guardados en localStorage correctamente', formData);
    } catch (error) {
      console.error('❌ Error al guardar en localStorage:', error);
    }
  }, [formData]);

  /**
   * Carga los datos almacenados en localStorage
   */
  const loadFormFromStorage = useCallback(() => {
    try {
      // Intentar cargar los datos completos del formulario
      const storedData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData) as FormData;
        
        // Actualizar los datos del formulario
        updateFormData(parsedData);
        console.log('✅ Datos cargados desde localStorage', parsedData);
        return true;
      }
      
      // Si no hay datos completos, intentar cargar por partes
      const storedType = localStorage.getItem(STORAGE_KEYS.REMITENTE_TYPE) as FormData['tipoRemitente'] | null;
      const storedRemitenteId = localStorage.getItem(STORAGE_KEYS.REMITENTE_ID);
      const storedIniciativaId = localStorage.getItem(STORAGE_KEYS.INICIATIVA_ID);
      const storedRadicado = localStorage.getItem(STORAGE_KEYS.RADICADO);
      
      if (storedType && storedRemitenteId) {
        const updates: Partial<FormData> = {
          tipoRemitente: storedType
        };
        
        // Actualizar datos según el tipo de remitente
        if (storedType === 'persona') {
          updates.datosPersona = {
            remitenteId: storedRemitenteId,
            iniciativaId: storedIniciativaId || undefined,
            radicado: storedRadicado ? Number(storedRadicado) : undefined
          };
        } 
        else if (storedType === 'entidad') {
          updates.datosEntidad = {
            remitenteId: storedRemitenteId,
            iniciativaId: storedIniciativaId || undefined,
            radicado: storedRadicado ? Number(storedRadicado) : undefined
          };
        }
        else if (storedType === 'organizacion') {
          updates.datosOrganizacion = {
            remitenteId: storedRemitenteId,
            iniciativaId: storedIniciativaId || undefined,
            radicado: storedRadicado ? Number(storedRadicado) : undefined
          };
        }
        
        updateFormData(updates);
        console.log('✅ Datos parciales cargados desde localStorage', updates);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error al cargar desde localStorage:', error);
      return false;
    }
  }, [updateFormData]);

  /**
   * Limpia los datos del formulario del localStorage
   */
  const clearFormStorage = useCallback(() => {
    try {
      // Limpiar todas las claves relacionadas con el formulario
      localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
      localStorage.removeItem(STORAGE_KEYS.REMITENTE_TYPE);
      localStorage.removeItem(STORAGE_KEYS.REMITENTE_ID);
      localStorage.removeItem(STORAGE_KEYS.INICIATIVA_ID);
      localStorage.removeItem(STORAGE_KEYS.RADICADO);
      
      console.log('🧹 Datos del formulario eliminados de localStorage');
    } catch (error) {
      console.error('❌ Error al limpiar localStorage:', error);
    }
  }, []);

  // Guardar datos automáticamente cuando cambian
  useEffect(() => {
    // Solo guardar si tenemos un tipo de remitente seleccionado
    if (formData.tipoRemitente) {
      saveFormToStorage();
    }
  }, [formData, saveFormToStorage]);

  return {
    saveFormToStorage,
    loadFormFromStorage,
    clearFormStorage
  };
};

export default useFormStorage;