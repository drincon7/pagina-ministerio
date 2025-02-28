// @/features/iniciativas/hooks/useIniciativaQuery.ts

import { useState } from 'react';
import { IniciativaAPI } from '@/services/api/iniciativa';
import { Iniciativa } from '@/services/types/iniciativa';

interface UseIniciativaQueryResult {
  iniciativa: Iniciativa | null;
  loading: boolean;
  error: string | null;
  fetchByRadicado: (radicado: string | number) => Promise<void>;
  fetchById: (id: string | number) => Promise<void>;
  reset: () => void;
}

/**
 * Hook personalizado para consultar iniciativas
 * @param entidadId ID de la entidad (por defecto se obtiene de las variables de entorno)
 */
export const useIniciativaQuery = (
  defaultEntidadId?: number
): UseIniciativaQueryResult => {
  const [iniciativa, setIniciativa] = useState<Iniciativa | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener el ID de entidad desde las variables de entorno o usar el valor por defecto
  const entidadId = defaultEntidadId || 
    parseInt(process.env.NEXT_PUBLIC_ENTIDAD_ID || '1');

  /**
   * Consultar iniciativa por número de radicado
   */
  const fetchByRadicado = async (radicado: string | number): Promise<void> => {
    if (!radicado || (typeof radicado === 'string' && !radicado.trim())) {
      setError('Por favor ingrese un número de radicado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await IniciativaAPI.findByRadicado(radicado, entidadId);
      
      if (result) {
        setIniciativa(result);
      } else {
        setError('No se encontró ninguna iniciativa con el radicado proporcionado');
        setIniciativa(null);
      }
    } catch (err) {
      console.error('Error al consultar iniciativa por radicado:', err);
      setError('Ocurrió un error al consultar la iniciativa. Por favor intente de nuevo más tarde.');
      setIniciativa(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Consultar iniciativa por ID
   */
  const fetchById = async (id: string | number): Promise<void> => {
    if (!id) {
      setError('Se requiere un ID de iniciativa válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await IniciativaAPI.findById(id, entidadId);
      
      if (result) {
        setIniciativa(result);
      } else {
        setError('No se encontró ninguna iniciativa con el ID proporcionado');
        setIniciativa(null);
      }
    } catch (err) {
      console.error('Error al consultar iniciativa por ID:', err);
      setError('Ocurrió un error al consultar la iniciativa. Por favor intente de nuevo más tarde.');
      setIniciativa(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetear estados
   */
  const reset = (): void => {
    setIniciativa(null);
    setLoading(false);
    setError(null);
  };

  return {
    iniciativa,
    loading,
    error,
    fetchByRadicado,
    fetchById,
    reset
  };
};

export default useIniciativaQuery;