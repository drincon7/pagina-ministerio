// @/features/iniciativas/components/IniciativaCard.tsx

import React, { useState } from 'react';
import { Iniciativa } from '@/services/types/iniciativa';
import { formatCurrency } from '@/features/iniciativas/utils/currencyFormatter';
import formatDate from '@/features/iniciativas/utils/dateFormatter';
import IniciativaDetalleModal from './IniciativaDetalleModal';

interface IniciativaCardProps {
  iniciativa: Iniciativa; // Nunca será null porque el componente solo se renderiza cuando hay iniciativa
  onVerDetalles?: (id: number) => void; // Ahora es opcional, ya que mostraremos un modal
  className?: string;
}

/**
 * Componente para mostrar los datos principales de una iniciativa
 */
const IniciativaCard: React.FC<IniciativaCardProps> = ({ 
  iniciativa, 
  onVerDetalles,
  className = '' 
}) => {
  // Estado para controlar la visibilidad del modal
  const [modalVisible, setModalVisible] = useState(false);
  
  // Función para abrir el modal
  const abrirModal = () => {
    setModalVisible(true);
  };
  
  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalVisible(false);
  };
  // Determinar el color de fondo según el estado
  const getStatusColor = (estado: string): string => {
    // Verificar que estado no sea undefined antes de llamar a toLowerCase
    if (!estado) {
      return 'bg-gray-200 text-gray-700'; // Color por defecto si no hay estado
    }
    
    switch (estado.toLowerCase()) {
      case 'recibido':
        return 'bg-blue-100 text-blue-800';
      case 'validado':
        return 'bg-green-100 text-green-800';
      case 'en revisión':
        return 'bg-yellow-100 text-yellow-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      case 'aprobado':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-pink-200 p-6 shadow-sm ${className}`}>
      <h3 className="font-bold text-xl mb-2 text-gray-800">Iniciativa: {iniciativa.titulo || 'Sin título'}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Radicado:</p>
          <p className="font-medium text-gray-800">{iniciativa.radicado || 'Sin radicado'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Estado:</p>
          <p className="font-medium">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(iniciativa.estado?.nombre_estado || '')}`}>
              {iniciativa.estado?.nombre_estado || 'Sin estado'}
            </span>
          </p>
        </div>
        
        <div className="col-span-2">
          <p className="text-sm text-gray-600">Tipo de proyecto:</p>
          <p className="font-medium text-gray-800">{iniciativa.tipo_proyecto?.tipo_proyecto || 'No especificado'}</p>
        </div>
        
        {iniciativa.descripcion && (
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Descripción:</p>
            <p className="font-medium text-gray-800 line-clamp-2">{iniciativa.descripcion}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm text-gray-600">Valor total:</p>
          <p className="font-medium text-gray-800">
            {formatCurrency(iniciativa.valor_total)}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Fecha de creación:</p>
          <p className="font-medium text-gray-800">{formatDate(iniciativa.fecha_creacion)}</p>
        </div>
        
        {iniciativa.responsable && (
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Responsable:</p>
            <p className="font-medium text-gray-800">{iniciativa.responsable?.nombre || 'Sin asignar'}</p>
          </div>
        )}
        
        <div className="col-span-2 mt-3">
          <button
            onClick={abrirModal}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition-colors w-full"
          >
            Ver detalles completos
          </button>
        </div>
      </div>
      
      {/* Modal de detalles */}
      {modalVisible && (
        <IniciativaDetalleModal 
          iniciativa={iniciativa} 
          onClose={cerrarModal} 
        />
      )}
    </div>
  );
};

export default IniciativaCard;