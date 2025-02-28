// @/services/api/documentos.ts
import api from '@/services/api/config';

export interface DocumentoRequerido {
  id: number;
  secuencia: number;
  nombre_archivo: string;
  detalle: string;
  obligatorio: boolean;
  entidad: number;
  tipo_proyecto: number;
  tipo_ciduadano?: number; // Opcional según la respuesta del API
  estado: number;
}

export const DocumentosAPI = {
  /**
   * Obtener todos los documentos requeridos para un tipo de proyecto específico
   * @param entidadId ID de la entidad
   * @param tipoProyectoId ID del tipo de proyecto
   */
  getDocumentosRequeridos: async (entidadId: number, tipoProyectoId: number): Promise<DocumentoRequerido[]> => {
    try {
      const response = await api.get<DocumentoRequerido[]>(`mie/api/documentos-proyecto/${entidadId}/${tipoProyectoId}/`);
      return response.data || [];
    } catch (error: unknown) {
      console.error('Error al obtener documentos requeridos:', error);
      throw error;
    }
  }
};

export default DocumentosAPI;