// @/services/api/iniciativa.ts
import api from '@/services/api/config';
import { Iniciativa, IniciativaResponse } from '@/services/api/types/iniciativa';

// Ruta base correcta según urls.py
const INICIATIVA_BASE_PATH = 'mie/api/iniciativas';

export const IniciativaAPI = {
  // Obtener todas las iniciativas
  findAll: async (): Promise<Iniciativa[]> => {
    try {
      const response = await api.get<IniciativaResponse>(`${INICIATIVA_BASE_PATH}/`);
      return response.data.results || [];
    } catch (error: unknown) {
      console.error('Error al obtener iniciativas:', error);
      throw error;
    }
  },

  // Buscar iniciativa por ID
  findById: async (id: string | number): Promise<Iniciativa | null> => {
    try {
      const response = await api.get<Iniciativa>(`${INICIATIVA_BASE_PATH}/${id}/`);
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

  // Buscar iniciativa por número de radicado
  findByRadicado: async (radicado: string | number): Promise<Iniciativa | null> => {
    try {
      // Para buscar por radicado, usaremos un parámetro de filtro
      const response = await api.get<IniciativaResponse>(`${INICIATIVA_BASE_PATH}/`, {
        params: { radicado: radicado }
      });
      
      // Si hay resultados, tomar el primero (debería ser único)
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0];
      }
      
      return null;
    } catch (error: unknown) {
      console.error('Error al buscar iniciativa por radicado:', error);
      throw error;
    }
  },

  // Crear una nueva iniciativa
  create: async (data: any): Promise<Iniciativa> => {
    try {
      const response = await api.post<Iniciativa>(`${INICIATIVA_BASE_PATH}/`, data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al crear iniciativa:', error);
      throw error;
    }
  },

  // Actualizar una iniciativa existente
  update: async (id: string | number, data: any): Promise<Iniciativa> => {
    try {
      const response = await api.put<Iniciativa>(`${INICIATIVA_BASE_PATH}/${id}/`, data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al actualizar iniciativa:', error);
      throw error;
    }
  },

  // Eliminar una iniciativa
  delete: async (id: string | number): Promise<void> => {
    try {
      await api.delete(`${INICIATIVA_BASE_PATH}/${id}/`);
    } catch (error: unknown) {
      console.error('Error al eliminar iniciativa:', error);
      throw error;
    }
  }
};

export const IniciativaService = IniciativaAPI;
export default IniciativaAPI;