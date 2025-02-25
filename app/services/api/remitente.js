// @/services/api/remitente.js
import api from '@/services/api/config';

// Ruta base para los endpoints de remitente
const REMITENTE_BASE_PATH = '/mie/api/remitente';

// Funciones auxiliares para la API de remitentes
export const RemitenteAPI = {
  // Obtener todos los remitentes
  findAll: async () => {
    try {
      const response = await api.get(`${REMITENTE_BASE_PATH}/`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener remitentes:', error);
      throw error;
    }
  },

  // Buscar remitente por identificación
  findByIdentificacion: async (identificacion) => {
    try {
      const response = await api.get(`${REMITENTE_BASE_PATH}/identificacion/${identificacion}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error al buscar remitente:', error);
      throw error;
    }
  },

  // Guardar nuevos datos de remitente
  saveStep1Data: async (datosPersona) => {
    try {
      console.log('Datos originales a enviar:', datosPersona);
      
      // Verificar si los campos necesarios existen
      if (!datosPersona.numeroDocumento || !datosPersona.nombres || !datosPersona.primerApellido) {
        throw new Error("Faltan datos obligatorios: número de documento, nombre o primer apellido");
      }
      
      // Asegurarnos de que los tipos de datos sean correctos
      const identificacion = parseInt(datosPersona.numeroDocumento);
      const telefono = parseInt(datosPersona.numeroContacto);
      
      if (isNaN(identificacion)) {
        throw new Error("El número de documento debe ser numérico");
      }
      
      if (isNaN(telefono)) {
        throw new Error("El número de contacto debe ser numérico");
      }
      
      // Mapear datos del formulario al formato exacto que espera la API
      const remitenteData = {
        identificacion: identificacion,
        nombre: datosPersona.nombres.toUpperCase(), // La API parece esperar nombres en mayúsculas
        primer_apellido: datosPersona.primerApellido.toUpperCase(),
        segundo_apellido: datosPersona.segundoApellido ? datosPersona.segundoApellido.toUpperCase() : null,
        email: datosPersona.email.toLowerCase(), // correos electrónicos en minúsculas
        telefono: telefono,
        creado_desde: "web",
        tipo: 1  // Tipo de remitente (1 = persona, según vimos en los datos)
      };
      
      console.log('Datos formateados a enviar:', remitenteData);
      
      // Añadimos estructura de datos si es necesario
      const payload = {
        data: remitenteData
      };
      
      // Intentar primero con estructura "data"
      try {
        const response = await api.post(`${REMITENTE_BASE_PATH}/`, payload);
        return response.data;
      } catch (structureError) {
        console.log('Error con estructura "data", intentando enviar datos directamente:', structureError);
        
        // Si falla, intentar enviando los datos directamente
        const directResponse = await api.post(`${REMITENTE_BASE_PATH}/`, remitenteData);
        return directResponse.data;
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      throw error;
    }
  },

  // Actualizar un remitente existente
  updateRemitente: async (id, datosPersona) => {
    try {
      // Asegurarnos de que los tipos de datos sean correctos
      const identificacion = parseInt(datosPersona.numeroDocumento);
      const telefono = parseInt(datosPersona.numeroContacto);
      
      const remitenteData = {
        identificacion: identificacion,
        nombre: datosPersona.nombres.toUpperCase(),
        primer_apellido: datosPersona.primerApellido.toUpperCase(),
        segundo_apellido: datosPersona.segundoApellido ? datosPersona.segundoApellido.toUpperCase() : null,
        email: datosPersona.email.toLowerCase(),
        telefono: telefono
      };
      
      // Probar con estructura envolvente "data"
      try {
        const response = await api.put(`${REMITENTE_BASE_PATH}/${id}`, { data: remitenteData });
        return response.data;
      } catch (structureError) {
        // Si falla, intentar sin estructura
        const directResponse = await api.put(`${REMITENTE_BASE_PATH}/${id}`, remitenteData);
        return directResponse.data;
      }
    } catch (error) {
      console.error('Error al actualizar remitente:', error);
      throw error;
    }
  }
};

// Para mantener compatibilidad con código existente
export const RemitenteService = RemitenteAPI;
export default RemitenteAPI;