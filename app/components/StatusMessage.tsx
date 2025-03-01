'use client';

import React from 'react';

interface StatusMessageProps {
  apiStatus: string;
  error: string | null;
  onErrorClose: () => void;
  isSuccess: boolean;
  radicado?: string | number;
}

/**
 * Componente para mostrar mensajes de estado, errores y éxito
 */
const StatusMessage: React.FC<StatusMessageProps> = ({
  apiStatus,
  error,
  onErrorClose,
  isSuccess,
  radicado
}) => {
  if (!apiStatus && !error && !isSuccess) return null;

  return (
    <div className="flex flex-col mt-4 mb-4">
      {/* Mensaje de API */}
      {apiStatus && (
        <div className={`p-4 rounded-md mb-4 ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          <p className="font-mono text-sm">{apiStatus}</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          <p>{error}</p>
          <button 
            onClick={onErrorClose}
            className="text-sm underline mt-2"
            type="button"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Mensaje de éxito */}
      {isSuccess && (
        <div className="p-4 bg-green-100 text-green-800 rounded-md mb-4">
          <p className="font-bold text-lg">¡Iniciativa registrada con éxito!</p>
          {radicado && (
            <p className="mt-2">Número de radicado: <span className="font-mono font-semibold">{radicado}</span></p>
          )}
          <p className="mt-1 text-sm">Por favor guarde este número para futuras consultas.</p>
        </div>
      )}
    </div>
  );
};

export default StatusMessage;