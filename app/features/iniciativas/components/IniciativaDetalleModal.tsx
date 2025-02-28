// @/features/iniciativas/components/IniciativaDetalleModal.tsx

import React, { useEffect, useState } from 'react';
import { Iniciativa } from '@/services/types/iniciativa';
import { formatCurrency } from '@/features/iniciativas/utils/currencyFormatter';
import formatDate from '@/features/iniciativas/utils/dateFormatter';
import { IniciativaAPI } from '@/services/api/iniciativa';

interface IniciativaDetalleModalProps {
  iniciativa: Iniciativa;
  onClose: () => void;
}

const IniciativaDetalleModal: React.FC<IniciativaDetalleModalProps> = ({ 
  iniciativa, 
  onClose 
}) => {
  // Estado para los documentos
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [cargandoDocumentos, setCargandoDocumentos] = useState(false);
  const [errorDocumentos, setErrorDocumentos] = useState<string | null>(null);

  // Cargar documentos al abrir el modal
  useEffect(() => {
    const cargarDocumentos = async () => {
      if (!iniciativa.id) return;
      
      setCargandoDocumentos(true);
      setErrorDocumentos(null);
      
      try {
        const docs = await IniciativaAPI.getDocuments(iniciativa.id);
        setDocumentos(Array.isArray(docs) ? docs : []);
      } catch (error) {
        setErrorDocumentos('No se pudieron cargar los documentos adjuntos.');
      } finally {
        setCargandoDocumentos(false);
      }
    };
    
    cargarDocumentos();
  }, [iniciativa.id]);
  
  // Agregar un event listener para cerrar el modal con la tecla Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    // Bloquear el scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Restaurar el scroll cuando el modal se cierra
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Determinar el color de fondo según el estado
  const getStatusColor = (estado: string): string => {
    if (!estado) {
      return 'bg-gray-200 text-gray-700';
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
    <>
      {/* Overlay (fondo oscuro) */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal (contenido) - Detener la propagación de clicks para evitar que se cierre al hacer clic en el contenido */}
        <div 
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 z-50 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabecera del modal */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Detalles de la Iniciativa</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido del modal */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{iniciativa.titulo || 'Sin título'}</h3>
              
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-600 mr-2">Estado:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(iniciativa.estado?.nombre_estado || '')}`}>
                  {iniciativa.estado?.nombre_estado || 'Sin estado'}
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Radicado:</p>
                <p className="font-medium text-gray-800">{iniciativa.radicado || 'Sin radicado'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Fecha de creación:</p>
                <p className="font-medium text-gray-800">{formatDate(iniciativa.fecha_creacion)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Tipo de proyecto:</p>
                <p className="font-medium text-gray-800">{iniciativa.tipo_proyecto?.tipo_proyecto || 'No especificado'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Valor total:</p>
                <p className="font-medium text-gray-800">{formatCurrency(iniciativa.valor_total)}</p>
              </div>
              
              {iniciativa.poblacion_objetivo && (
                <div>
                  <p className="text-sm text-gray-600">Población objetivo:</p>
                  <p className="font-medium text-gray-800">{iniciativa.poblacion_objetivo.poblacion_objetivo}</p>
                </div>
              )}
              
              {iniciativa.responsable && (
                <div>
                  <p className="text-sm text-gray-600">Responsable:</p>
                  <p className="font-medium text-gray-800">{iniciativa.responsable?.nombre || 'Sin asignar'}</p>
                </div>
              )}
            </div>
            
            {iniciativa.descripcion && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Descripción:</p>
                <p className="text-gray-800">{iniciativa.descripcion}</p>
              </div>
            )}
            
            {/* Sección de clasificaciones */}
            {iniciativa.clasificaciones && iniciativa.clasificaciones.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Clasificaciones:</p>
                <div className="flex flex-wrap gap-2">
                  {iniciativa.clasificaciones.map((clasificacion) => (
                    <span 
                      key={clasificacion.id} 
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {clasificacion.clasificacion}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sección de viceministerios */}
            {iniciativa.viceministerios && iniciativa.viceministerios.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Viceministerios:</p>
                <div className="flex flex-wrap gap-2">
                  {iniciativa.viceministerios.map((viceministerio) => (
                    <span 
                      key={viceministerio.id} 
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {viceministerio.viceministerio}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sección de documentos adjuntos */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Documentos adjuntos:</p>
              
              {cargandoDocumentos ? (
                <div className="text-gray-500 text-center py-4">Cargando documentos...</div>
              ) : errorDocumentos ? (
                <div className="text-red-500 text-sm">{errorDocumentos}</div>
              ) : documentos.length === 0 ? (
                <div className="text-gray-500 italic">No hay documentos adjuntos.</div>
              ) : (
                <div className="space-y-2">
                  {documentos.map((doc, index) => (
                    <div 
                      key={doc.id || index} 
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {doc.documento_nombre || doc.nombre || `Documento ${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.fecha_carga ? formatDate(doc.fecha_carga, 'Sin fecha') : 'Sin fecha'}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={doc.documento || doc.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center"
                        download
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descargar
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Pie del modal */}
          <div className="border-t p-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IniciativaDetalleModal;