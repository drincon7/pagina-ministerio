// @/services/api/iniciativa.ts
import api from '@/services/api/config';
import { 
  Iniciativa, 
  IniciativaResponse, 
  IniciativaCreateDTO, 
  IniciativaUpdateDTO,
  TipoProyecto,
  PoblacionObjetivo
} from '@/services/types/iniciativa';

// Ruta base correcta según la definición de urls.py
const INICIATIVA_BASE_PATH = 'mie/api/iniciativas';

export const IniciativaAPI = {
  /**
   * Obtener todas las iniciativas de una entidad
   * @param entidadId ID de la entidad
   */
  findAll: async (entidadId: number = 1): Promise<Iniciativa[]> => {
    try {
      const response = await api.get<IniciativaResponse>(`${INICIATIVA_BASE_PATH}/${entidadId}/`);
      return response.data.results || [];
    } catch (error: unknown) {
      console.error('Error al obtener iniciativas:', error);
      throw error;
    }
  },

  /**
   * Buscar iniciativa por ID
   * @param id ID de la iniciativa
   * @param entidadId ID de la entidad
   */
  findById: async (id: string | number, entidadId: number = 1): Promise<Iniciativa | null> => {
    try {
      const response = await api.get<Iniciativa>(`${INICIATIVA_BASE_PATH}/${entidadId}/${id}/`);
      return response.data || null;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number } };
        if (apiError.response && apiError.response.status === 404) {
          return null; // No encontrado, retornar null sin error
        }
      }
      console.error('Error al buscar iniciativa por ID:', error);
      throw error;
    }
  },

  /**
   * Buscar iniciativa por número de radicado
   * @param radicado Número de radicado
   * @param entidadId ID de la entidad
   */
  findByRadicado: async (radicado: string | number, entidadId: number = 1): Promise<Iniciativa | null> => {
    try {
      // La API de iniciativas permite buscar por radicado directamente en la URL
      const response = await api.get<Iniciativa>(`${INICIATIVA_BASE_PATH}/${entidadId}/${radicado}/`);
      return response.data || null;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number } };
        if (apiError.response && apiError.response.status === 404) {
          return null; // No encontrado, retornar null sin error
        }
      }
      console.error('Error al buscar iniciativa por radicado:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva iniciativa
   * @param iniciativaData Datos de la iniciativa a crear
   * @param entidadId ID de la entidad (por defecto 1)
   */
  create: async (iniciativaData: IniciativaCreateDTO): Promise<Iniciativa> => {
    try {
      // La ruta correcta es 'mie/api/iniciativas/1/' donde 1 es el ID de la entidad
      const entidadId = iniciativaData.entidad || parseInt(process.env.NEXT_PUBLIC_ENTIDAD_ID || '1');
      
      // Asegurarse de que los tipos de datos sean correctos
      const dataToSend = {
        ...iniciativaData,
        radicado_por: parseInt(String(iniciativaData.radicado_por)),
        entidad: entidadId, 
        tipo_proyecto: typeof iniciativaData.tipo_proyecto === 'string' 
          ? parseInt(iniciativaData.tipo_proyecto) 
          : iniciativaData.tipo_proyecto,
        poblacion_beneficiada: typeof iniciativaData.poblacion_beneficiada === 'string' 
          ? parseInt(iniciativaData.poblacion_beneficiada) 
          : iniciativaData.poblacion_beneficiada,
        valor_total: typeof iniciativaData.valor_total === 'string' 
          ? parseFloat(iniciativaData.valor_total) 
          : iniciativaData.valor_total,
        radicado: null // Asegurarse de que sea null para que el backend lo genere
      };
      
      console.log('Enviando datos a la API:', dataToSend);
      
      // Usar la entidad en la URL
      const response = await api.post<Iniciativa>(`${INICIATIVA_BASE_PATH}/${entidadId}/`, dataToSend);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al crear iniciativa:', error);
      throw error;
    }
  },

  /**
   * Actualizar una iniciativa existente
   * @param radicado Número de radicado de la iniciativa
   * @param data Datos a actualizar
   * @param entidadId ID de la entidad
   */
  update: async (radicado: string | number, data: IniciativaUpdateDTO, entidadId: number = 1): Promise<Iniciativa> => {
    try {
      // La API espera un POST para actualizar, con el radicado en la URL
      const response = await api.post<Iniciativa>(`${INICIATIVA_BASE_PATH}/${entidadId}/${radicado}/`, data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al actualizar iniciativa:', error);
      throw error;
    }
  },

    /**
     * Obtener todos los documentos de una iniciativa
     * @param iniciativaId ID de la iniciativa
     */
    getDocuments: async (iniciativaId: number): Promise<any[]> => {
        try {
          const response = await api.get(`${INICIATIVA_BASE_PATH}/${iniciativaId}/documentos/`);
          return response.data || [];
        } catch (error: unknown) {
          console.error('Error al obtener documentos:', error);
          return []; // Retornar array vacío en caso de error para no romper el flujo
        }
      },
    
  /**
   * Subir un documento asociado a una iniciativa
   * @param iniciativaId ID de la iniciativa
   * @param formData Datos del formulario con el documento
   */
  uploadDocument: async (iniciativaId: number, formData: FormData): Promise<any> => {
    try {
      const response = await api.post(
        `${INICIATIVA_BASE_PATH}/${iniciativaId}/documentos/`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data;
    } catch (error: unknown) {
      console.error('Error al subir documento:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los tipos de proyecto para una entidad específica
   * @param entidadId ID de la entidad
   */
  findAllTiposProyecto: async (entidadId: string | number = 1): Promise<TipoProyecto[]> => {
    try {
      // Usar el endpoint correcto basado en las URLs de tu backend
      const response = await api.get<{ data: TipoProyecto[] }>(`mie/api/tipo-proyecto/${entidadId}`);
      return response.data.data || [];
    } catch (error: unknown) {
      console.error('Error al obtener tipos de proyecto:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las poblaciones objetivo para una entidad específica
   * @param entidadId ID de la entidad
   */
  findAllPoblacionesObjetivo: async (entidadId: string | number = 1): Promise<PoblacionObjetivo[]> => {
    try {
      // Usar el endpoint correcto basado en las URLs de tu backend
      const response = await api.get<{ data: PoblacionObjetivo[] }>(`mie/api/poblacion-objetivo/${entidadId}`);
      return response.data.data || [];
    } catch (error: unknown) {
      console.error('Error al obtener poblaciones objetivo:', error);
      throw error;
    }
  }
};

export const IniciativaService = IniciativaAPI;
export default IniciativaAPI;