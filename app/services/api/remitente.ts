// @/services/api/remitente.ts
import api from '@/services/api/config';
import { 
  Remitente, 
  RemitenteResponse, 
  CreateRemitenteDTO,
  PersonaData,
  EntidadData,
  OrganizacionData 
} from '@/services/types/remitente';

// Ruta base correcta según urls.py
const REMITENTE_BASE_PATH = 'mie/api/remitente';

export const RemitenteAPI = {
  // Obtener todos los remitentes
  findAll: async (): Promise<Remitente[]> => {
    try {
      const response = await api.get<RemitenteResponse>(`${REMITENTE_BASE_PATH}/`);
      return response.data.data || [];
    } catch (error: unknown) {
      console.error('Error al obtener remitentes:', error);
      throw error;
    }
  },

  // Buscar remitente por identificación - ajustado a la ruta correcta
  findByIdentificacion: async (identificacion: string | number): Promise<Remitente | null> => {
    try {
      // La API espera la identificación como parte de la URL
      const response = await api.get<{data: Remitente}>(`${REMITENTE_BASE_PATH}/${identificacion}`);
      return response.data.data || null;
    } catch (error: unknown) {
      // Usar type narrowing para manejar el error
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number } };
        if (apiError.response && apiError.response.status === 404) {
          return null; // No encontrado, retornar null sin error
        }
      }
      console.error('Error al buscar remitente:', error);
      throw error;
    }
  },

  // Guardar datos de persona (tipo 1)
  saveStep1Data: async (datosPersona: Partial<PersonaData>): Promise<any> => {
    try {
      // Verificar campos obligatorios
      if (!datosPersona.numeroDocumento || !datosPersona.nombres || !datosPersona.primerApellido || !datosPersona.email) {
        throw new Error("Faltan datos obligatorios: número de documento, nombre, primer apellido o email");
      }
      
      // Convertir a tipos correctos
      const identificacion = parseInt(datosPersona.numeroDocumento);
      const telefono = datosPersona.numeroContacto ? parseInt(datosPersona.numeroContacto) : 0;
      
      if (isNaN(identificacion)) {
        throw new Error("El número de documento debe ser numérico");
      }
      
      // Mapear al formato que espera la API según models.py
      const remitenteData: CreateRemitenteDTO = {
        identificacion: identificacion,
        tipo: 1, // Tipo persona
        nombre: datosPersona.nombres.toUpperCase(),
        primer_apellido: datosPersona.primerApellido.toUpperCase(),
        segundo_apellido: datosPersona.segundoApellido ? datosPersona.segundoApellido.toUpperCase() : null,
        nombre_entidad: null, // Enviar null para personas
        email: datosPersona.email.toLowerCase(),
        telefono: telefono,
        creado_desde: "web"
      };
      
      console.log('Datos a enviar:', remitenteData);
      
      // Si hay un ID existente, hacemos una actualización
      if (datosPersona.remitenteId) {
        // Según la API, para actualizar solo enviamos email y teléfono
        const response = await api.post(`${REMITENTE_BASE_PATH}/${datosPersona.remitenteId}`, {
          email: datosPersona.email.toLowerCase(),
          telefono: telefono
        });
        return response.data;
      } else {
        // Nuevo registro
        const response = await api.post(`${REMITENTE_BASE_PATH}/`, remitenteData);
        return response.data;
      }
    } catch (error: unknown) {
      console.error('Error al guardar datos:', error);
      throw error;
    }
  },

  // Guardar datos de entidad (tipo 2)
  saveEntidadData: async (datosEntidad: Partial<EntidadData>): Promise<any> => {
    try {
      // Verificar campos obligatorios
      if (!datosEntidad.nit || !datosEntidad.nombre || !datosEntidad.email) {
        throw new Error("Faltan datos obligatorios para la entidad");
      }
      
      // Limpiar el NIT y convertir a número
      const nitLimpio = datosEntidad.nit.replace(/\D/g, '');
      const identificacion = parseInt(nitLimpio);
      const telefono = datosEntidad.telefono ? parseInt(datosEntidad.telefono) : 0;
      
      if (isNaN(identificacion)) {
        throw new Error("El NIT debe ser numérico");
      }
      
      // Mapear al formato que espera la API
      const remitenteData: CreateRemitenteDTO = {
        identificacion: identificacion,
        tipo: 2, // Tipo entidad
        nombre: null,
        primer_apellido: null,
        segundo_apellido: null,
        nombre_entidad: datosEntidad.nombre.toUpperCase(),
        email: datosEntidad.email.toLowerCase(),
        telefono: telefono,
        creado_desde: "web"
      };
      
      console.log('Datos a enviar:', remitenteData);
      
      // Si hay un ID existente, hacemos una actualización
      if (datosEntidad.remitenteId) {
        // Según la API, para actualizar solo enviamos email y teléfono
        const response = await api.post(`${REMITENTE_BASE_PATH}/${datosEntidad.remitenteId}`, {
          email: datosEntidad.email.toLowerCase(),
          telefono: telefono
        });
        return response.data;
      } else {
        // Nuevo registro
        const response = await api.post(`${REMITENTE_BASE_PATH}/`, remitenteData);
        return response.data;
      }
    } catch (error: unknown) {
      console.error('Error al guardar datos de entidad:', error);
      throw error;
    }
  },

  // Guardar datos de organización (tipo 3)
  saveOrganizacionData: async (datosOrganizacion: Partial<OrganizacionData>): Promise<any> => {
    try {
      // Verificar campos obligatorios
      if (!datosOrganizacion.razonOrganizacion || !datosOrganizacion.nombreOrganizacion || !datosOrganizacion.email) {
        throw new Error("Faltan datos obligatorios para la organización");
      }
      
      // Convertir a tipos correctos
      const nitLimpio = datosOrganizacion.razonOrganizacion.replace(/\D/g, '');
      const identificacion = parseInt(nitLimpio);
      const telefono = datosOrganizacion.numeroContacto ? parseInt(datosOrganizacion.numeroContacto) : 0;
      
      if (isNaN(identificacion)) {
        throw new Error("La razón social debe ser numérica");
      }
      
      // Mapear al formato que espera la API
      const remitenteData: CreateRemitenteDTO = {
        identificacion: identificacion,
        tipo: 3, // Tipo organización
        nombre: null,
        primer_apellido: null,
        segundo_apellido: null,
        nombre_entidad: datosOrganizacion.nombreOrganizacion.toUpperCase(),
        email: datosOrganizacion.email.toLowerCase(),
        telefono: telefono,
        creado_desde: "web"
      };
      
      console.log('Datos a enviar:', remitenteData);
      
      // Si hay un ID existente, hacemos una actualización
      if (datosOrganizacion.remitenteId) {
        // Según la API, para actualizar solo enviamos email y teléfono
        const response = await api.post(`${REMITENTE_BASE_PATH}/${datosOrganizacion.remitenteId}`, {
          email: datosOrganizacion.email.toLowerCase(),
          telefono: telefono
        });
        return response.data;
      } else {
        // Nuevo registro
        const response = await api.post(`${REMITENTE_BASE_PATH}/`, remitenteData);
        return response.data;
      }
    } catch (error: unknown) {
      console.error('Error al guardar datos de organización:', error);
      throw error;
    }
  },

  // Mantener este método para compatibilidad
  updateRemitente: async (identificacion: number, datosPersona: Partial<PersonaData>): Promise<any> => {
    try {
      // Convertir a tipos correctos
      const idNum = parseInt(String(identificacion));
      const telefono = datosPersona.numeroContacto ? parseInt(datosPersona.numeroContacto) : 0;
      
      const remitenteData = {
        email: datosPersona.email?.toLowerCase(),
        telefono: telefono
      };
      
      // Según la API en views.py, para actualizar solo se usan email y teléfono
      const response = await api.post(`${REMITENTE_BASE_PATH}/${idNum}`, remitenteData);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al actualizar remitente:', error);
      throw error;
    }
  }
};

export const RemitenteService = RemitenteAPI;
export default RemitenteAPI;