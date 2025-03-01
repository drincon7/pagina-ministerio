'use client';

import { FormData } from '@/features/iniciativas/types/formTypes';
import { RemitenteAPI } from '@/services/api/remitente';
import { IniciativaAPI } from '@/services/api/iniciativa';

/**
 * Servicio para manejar el envío de datos del formulario
 */
export const FormSubmissionService = {
  /**
   * Guarda los datos del remitente tipo persona
   */
  savePersonaData: async (formData: FormData) => {
    // Verificar que existe datos de persona
    if (!formData.datosPersona) {
      throw new Error('No hay datos de persona para enviar');
    }

    // Preparar datos de persona
    const personaData = {
      tipoDocumento: formData.datosPersona.tipoDocumento || 'CC',
      numeroDocumento: formData.datosPersona.numeroDocumento || '',
      nombres: formData.datosPersona.nombres || '',
      primerApellido: formData.datosPersona.primerApellido || '',
      segundoApellido: formData.datosPersona.segundoApellido,
      email: formData.datosPersona.email || '',
      numeroContacto: formData.datosPersona.numeroContacto || '',
      remitenteId: formData.datosPersona.remitenteId || null
    };

    // Enviar datos al API - el backend determina si crear o actualizar
    return await RemitenteAPI.saveStep1Data(personaData);
  },

  /**
   * Guarda los datos del remitente tipo entidad
   */
  saveEntidadData: async (formData: FormData) => {
    // Verificar que existe datos de entidad
    if (!formData.datosEntidad) {
      throw new Error('No hay datos de entidad para enviar');
    }

    // Preparar datos de entidad
    const entidadData = {
      nombre: formData.datosEntidad.nombre || '',
      nit: formData.datosEntidad.nit || '',
      email: formData.datosEntidad.email || '',
      telefono: formData.datosEntidad.telefono || '',
      remitenteId: formData.datosEntidad.remitenteId || null
    };

    // Enviar datos al API - el backend determina si crear o actualizar
    return await RemitenteAPI.saveEntidadData(entidadData);
  },

  /**
   * Guarda los datos del remitente tipo organización
   */
  saveOrganizacionData: async (formData: FormData) => {
    // Verificar que existe datos de organización
    if (!formData.datosOrganizacion) {
      throw new Error('No hay datos de organización para enviar');
    }

    // Preparar datos de organización
    const organizacionData = {
      nombreOrganizacion: formData.datosOrganizacion.nombreOrganizacion || '',
      razonOrganizacion: formData.datosOrganizacion.razonOrganizacion || '',
      email: formData.datosOrganizacion.email || '',
      numeroContacto: formData.datosOrganizacion.numeroContacto || '',
      remitenteId: formData.datosOrganizacion.remitenteId || null
    };

    // Enviar datos al API - el backend determina si crear o actualizar
    return await RemitenteAPI.saveOrganizacionData(organizacionData);
  },

  /**
   * Guarda los datos de la iniciativa
   */
  saveIniciativaData: async (formData: FormData) => {
    // Determinar tipo de remitente y preparar datos para API
    let iniciativaData;
    let remitenteId;
    
    // Preparar datos según tipo de remitente
    if (formData.tipoRemitente === 'persona' && formData.datosPersona) {
      remitenteId = formData.datosPersona.remitenteId;
      if (!remitenteId) {
        throw new Error('No se encontró el ID del remitente. Por favor complete el paso 1.');
      }
      
      iniciativaData = {
        entidad: parseInt(process.env.NEXT_PUBLIC_ENTIDAD_ID || '1'),
        radicado_por: parseInt(remitenteId),
        tipo_proyecto: formData.datosPersona.tipoProyecto || '',
        titulo: formData.datosPersona.titulo || '',
        descripcion: formData.datosPersona.descripcion || '',
        poblacion_beneficiada: formData.datosPersona.poblacionBeneficiada || '',
        valor_total: formData.datosPersona.valorTotal || '',
        creado_desde: 'persona',
        radicado: null // Enviar null para que el backend genere automáticamente
      };
    } 
    else if (formData.tipoRemitente === 'entidad' && formData.datosEntidad) {
      remitenteId = formData.datosEntidad.remitenteId;
      if (!remitenteId) {
        throw new Error('No se encontró el ID del remitente. Por favor complete el paso 1.');
      }
      
      iniciativaData = {
        entidad: parseInt(process.env.NEXT_PUBLIC_ENTIDAD_ID || '1'),
        radicado_por: parseInt(remitenteId),
        tipo_proyecto: formData.datosEntidad.tipoProyecto || '',
        titulo: formData.datosEntidad.titulo || '',
        descripcion: formData.datosEntidad.descripcion || '',
        poblacion_beneficiada: formData.datosEntidad.poblacionBeneficiada || '',
        valor_total: formData.datosEntidad.valorTotal || '',
        creado_desde: 'entidad',
        radicado: null 
      };
    }
    else if (formData.tipoRemitente === 'organizacion' && formData.datosOrganizacion) {
      remitenteId = formData.datosOrganizacion.remitenteId;
      if (!remitenteId) {
        throw new Error('No se encontró el ID del remitente. Por favor complete el paso 1.');
      }
      
      iniciativaData = {
        entidad: parseInt(process.env.NEXT_PUBLIC_ENTIDAD_ID || '1'),
        radicado_por: parseInt(remitenteId),
        tipo_proyecto: formData.datosOrganizacion.tipoProyecto || '',
        titulo: formData.datosOrganizacion.titulo || '',
        descripcion: formData.datosOrganizacion.descripcion || '',
        poblacion_beneficiada: formData.datosOrganizacion.poblacionBeneficiada || '',
        valor_total: formData.datosOrganizacion.valorTotal || '',
        creado_desde: 'organizacion',
        radicado: null
      };
    } else {
      throw new Error('Tipo de remitente no válido');
    }
    
    // Enviar datos al API
    return await IniciativaAPI.create(iniciativaData);
  }
};

export default FormSubmissionService;