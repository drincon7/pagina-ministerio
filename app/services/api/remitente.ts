import api from './config';
import { RemitenteResponse, CreateRemitenteDTO, Remitente } from '../types/remitente';

export const RemitenteService = {
  // Buscar remitente por identificación
  findByIdentificacion: async (identificacion: number): Promise<Remitente | null> => {
    try {
      console.log('Buscando remitente con identificación:', identificacion);
      const url = `/mie/api/remitente/?identificacion=${identificacion}`;
      console.log('URL completa:', process.env.NEXT_PUBLIC_API_URL + url);
      
      const response = await api.get<RemitenteResponse>(url);
      console.log('Respuesta de la API:', response.data);
      
      return response.data.data.length > 0 ? response.data.data[0] : null;
    } catch (error) {
      console.error('Error detallado al buscar remitente:', {
        error,
        identificacion,
        url: `/mie/api/remitente/?identificacion=${identificacion}`,
      });
      throw error;
    }
  },

  // Crear un nuevo remitente
  create: async (remitente: CreateRemitenteDTO): Promise<Remitente> => {
    console.log('Creando nuevo remitente:', remitente);
    const response = await api.post<Remitente>('/mie/api/remitente/', remitente);
    return response.data;
  },

  // Actualizar un remitente
  update: async (id: number, remitente: Partial<CreateRemitenteDTO>): Promise<Remitente> => {
    console.log('Actualizando remitente:', { id, remitente });
    const response = await api.patch<Remitente>(`/mie/api/remitente/${id}/`, remitente);
    return response.data;
  },
};