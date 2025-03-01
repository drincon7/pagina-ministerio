'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useFormContext } from '../../../context/FormContext';
import type { DocumentoMetadata, Documentos } from '../../../types/formTypes';
import StepNavigation from '../../StepNavigation';
import api from '@/services/api/config';
import { IniciativaAPI } from '@/services/api/iniciativa';

// Definir interfaces para tipos de documentos requeridos
interface ApiResponse {
  data: Array<{
    id: number;
    secuencia: number;
    nombre_archivo: string;
    detalle: string;
    obligatorio: boolean;
    entidad: number;
    tipo_proyecto: number;
    tipo_ciduadano?: number;
    estado: number;
  }>;
}

interface DocumentState {
  id: number;
  nombre_archivo: string;
  file: File | null;
  isUploading: boolean;
  isUploaded: boolean;
  error: string | null;
  obligatorio: boolean;
  detalle: string;
  secuencia: number;
}

const Step3: React.FC = () => {
  const { 
    formData, 
    updateFormData,
    validationState,
    setValidationState
  } = useFormContext();

  const [documentosRequeridos, setDocumentosRequeridos] = useState<DocumentState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalObligatorios, setTotalObligatorios] = useState(0);
  const [uploadedObligatorios, setUploadedObligatorios] = useState(0);

  // Obtener datos de la iniciativa según el tipo de remitente
  const getIniciativaData = () => {
    switch(formData.tipoRemitente) {
      case 'persona':
        return formData.datosPersona;
      case 'entidad':
        return formData.datosEntidad;
      case 'organizacion':
        return formData.datosOrganizacion;
      default:
        return null;
    }
  };

  const iniciativaData = getIniciativaData();
  const iniciativaId = parseInt(iniciativaData?.iniciativaId || '0');
  const tipoProyecto = parseInt(iniciativaData?.tipoProyecto || '0');

  console.log("Iniciativa ID:", iniciativaId);
  console.log("Tipo Proyecto:", tipoProyecto);
  console.log("Tipo Remitente:", formData.tipoRemitente);

  // Cargar los documentos requeridos al iniciar el componente
  useEffect(() => {
    // Solo cargar si tenemos un ID de iniciativa válido
    if (iniciativaId <= 0 || tipoProyecto <= 0) {
      setError('No se pudo obtener información de la iniciativa');
      setIsLoading(false);
      return;
    }

    const loadDocumentosRequeridos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Obtener la entidad desde las variables de entorno o configuración
        const entidadId = parseInt(process.env.NEXT_PUBLIC_ENTIDAD_ID || '1');
        
        console.log(`Cargando documentos para entidad ${entidadId} y tipo de proyecto ${tipoProyecto}`);
        
        // Obtener los documentos requeridos para este tipo de proyecto
        const response = await api.get<ApiResponse>(`mie/api/documentos-proyecto/${entidadId}/${tipoProyecto}/`);
        
        console.log("Respuesta de API:", response.data);
        
        // Verificar que la respuesta tenga la estructura esperada con 'data'
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Filtrar documentos por tipo de ciudadano si es necesario
          let ciudadanoId: number | undefined;
          
          if (formData.tipoRemitente === 'persona') {
            ciudadanoId = 1; // ID para personas naturales
          } else if (formData.tipoRemitente === 'entidad') {
            ciudadanoId = 2; // ID para entidades
          } else if (formData.tipoRemitente === 'organizacion') {
            ciudadanoId = 3; // ID para organizaciones
          }
          
          console.log("Filtrando por tipo de ciudadano:", ciudadanoId);
          
          // Filtrar y mapear los documentos según el tipo de ciudadano o incluir todos si no tienen tipo_ciudadano
          const documentos = response.data.data
            .filter((doc) => {
              const incluir = !doc.tipo_ciduadano || doc.tipo_ciduadano === ciudadanoId;
              console.log(`Documento '${doc.nombre_archivo}' tipo_ciudadano:${doc.tipo_ciduadano} - incluir:${incluir}`);
              return incluir;
            })
            .sort((a, b) => a.secuencia - b.secuencia)
            .map((doc) => ({
              id: doc.id,
              nombre_archivo: doc.nombre_archivo,
              file: null,
              isUploading: false,
              isUploaded: false,
              error: null,
              obligatorio: doc.obligatorio,
              detalle: doc.detalle,
              secuencia: doc.secuencia
            }));
            
          console.log("Documentos filtrados y ordenados:", documentos);
            
          if (documentos.length === 0) {
            console.log('No se encontraron documentos para este tipo de proyecto después de filtrar');
            setError('No hay documentos configurados para este tipo de usuario y proyecto');
            setIsLoading(false);
            return;
          }
            
          // Contar documentos obligatorios
          const obligatorios = documentos.filter(doc => doc.obligatorio).length;
          setTotalObligatorios(obligatorios);
          
          console.log(`Se encontraron ${documentos.length} documentos, ${obligatorios} obligatorios`);
          
          // Cargar documentos ya subidos para mostrarlos como cargados
          if (iniciativaId > 0) {
            try {
              const docsResponse = await IniciativaAPI.getDocuments(iniciativaId);
              
              console.log("Documentos ya subidos:", docsResponse);
              
              // Marcar documentos ya subidos
              if (docsResponse && Array.isArray(docsResponse)) {
                let contadorObligatorios = 0;
                
                documentos.forEach((doc, index) => {
                  const docSubido = docsResponse.find(
                    uploaded => uploaded.documento_nombre === doc.nombre_archivo
                  );
                  
                  if (docSubido) {
                    documentos[index].isUploaded = true;
                    if (doc.obligatorio) contadorObligatorios++;
                    console.log(`Documento '${doc.nombre_archivo}' ya estaba subido`);
                  }
                });
                
                setUploadedObligatorios(contadorObligatorios);
                console.log(`${contadorObligatorios} documentos obligatorios ya subidos`);
              }
            } catch (err) {
              console.error('Error al cargar documentos subidos:', err);
              // No bloqueamos el flujo si hay error al cargar documentos subidos
            }
          }
          
          setDocumentosRequeridos(documentos);
        } else {
          console.error('Respuesta de API inesperada:', response.data);
          setError('No se encontraron documentos para este tipo de proyecto');
        }
      } catch (err) {
        console.error('Error al cargar documentos requeridos:', err);
        setError('Error al cargar los documentos requeridos. Intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentosRequeridos();
  }, [iniciativaId, tipoProyecto, formData.tipoRemitente]);

  // Validar este paso para el componente de navegación
  useEffect(() => {
    // Si todos los documentos obligatorios están subidos, el paso es válido
    const isValid = uploadedObligatorios >= totalObligatorios;
    
    // Actualizar el estado de validación
    setValidationState((prev) => ({
      ...prev,
      documentosObligatorios: {
        isValid,
        message: isValid ? '' : 'Debe subir todos los documentos obligatorios para continuar'
      }
    }));
    
    // Actualizar el almacenamiento local
    updateDocumentosEnFormData();
  }, [uploadedObligatorios, totalObligatorios, setValidationState]);

  // Guardar el estado de los documentos en el formulario
  const updateDocumentosEnFormData = useCallback(() => {
    // Crear un objeto Documentos con los documentos actuales
    const docsObj: Record<string, DocumentoMetadata | null> = documentosRequeridos.reduce((acc: Record<string, DocumentoMetadata | null>, doc) => {
      // Convertir nombre_archivo a una clave válida para el objeto Documentos
      const key = doc.nombre_archivo.replace(/[-_]/g, '');
      
      acc[key] = doc.isUploaded ? {
        nombre: doc.nombre_archivo,
        tipo: 'application/pdf', // valor por defecto
        tamaño: 0 // valor por defecto
      } : null;
      
      return acc;
    }, {});
    
    // Actualizar según el tipo de remitente
    if (formData.tipoRemitente === 'persona') {
      updateFormData({
        datosPersona: {
          ...formData.datosPersona,
          documentos: docsObj as Documentos
        }
      });
    } else if (formData.tipoRemitente === 'entidad') {
      updateFormData({
        datosEntidad: {
          ...formData.datosEntidad,
          documentos: docsObj as Documentos
        }
      });
    } else if (formData.tipoRemitente === 'organizacion') {
      updateFormData({
        datosOrganizacion: {
          ...formData.datosOrganizacion,
          documentos: docsObj as Documentos
        }
      });
    }
  }, [documentosRequeridos, formData, updateFormData]);

  // Validar archivo antes de subir
  const validateFile = (file: File): string | null => {
    if (file.size > 10 * 1024 * 1024) {
      return 'El archivo no debe superar los 10MB';
    }
    
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Solo se permiten archivos PDF o Word';
    }

    return null;
  };

  // Manejar la subida de un archivo
  const handleFileUpload = async (index: number, file: File) => {
    // Verificar que el índice sea válido
    if (index < 0 || index >= documentosRequeridos.length) {
      console.error(`Índice inválido: ${index}, longitud de documentos: ${documentosRequeridos.length}`);
      return;
    }

    console.log(`Subiendo archivo para documento: ${documentosRequeridos[index].nombre_archivo}`);
    
    // Validar el archivo
    const validationError = validateFile(file);
    if (validationError) {
      console.log(`Error de validación: ${validationError}`);
      const updatedDocs = [...documentosRequeridos];
      updatedDocs[index].error = validationError;
      setDocumentosRequeridos(updatedDocs);
      return;
    }

    // Actualizar estado para mostrar loading
    const updatedDocs = [...documentosRequeridos];
    updatedDocs[index].file = file;
    updatedDocs[index].isUploading = true;
    updatedDocs[index].error = null;
    setDocumentosRequeridos(updatedDocs);

    try {
      // Crear FormData para el archivo
      const formData = new FormData();
      formData.append('iniciativa', iniciativaId.toString());
      formData.append('documento', file);
      formData.append('documento_nombre', documentosRequeridos[index].nombre_archivo);
      formData.append('tipo_documento', '1'); // Asumiendo un valor por defecto

      console.log(`Enviando a API: iniciativa=${iniciativaId}, documento_nombre=${documentosRequeridos[index].nombre_archivo}`);
      
      // Subir el archivo
      await IniciativaAPI.uploadDocument(iniciativaId, formData);

      console.log('Documento subido exitosamente');
      
      // Actualizar estado a subido
      const wasUploaded = documentosRequeridos[index].isUploaded;
      
      updatedDocs[index].isUploading = false;
      updatedDocs[index].isUploaded = true;
      setDocumentosRequeridos(updatedDocs);

      // Incrementar contador si es obligatorio y no estaba ya subido
      if (updatedDocs[index].obligatorio && !wasUploaded) {
        console.log(`Incrementando contador de obligatorios (${uploadedObligatorios} -> ${uploadedObligatorios + 1})`);
        setUploadedObligatorios(prev => prev + 1);
      }
      
      // Actualizar datos en el formulario
      updateDocumentosEnFormData();
    } catch (err) {
      console.error('Error al subir archivo:', err);
      
      // Actualizar estado con error
      const updatedDocs = [...documentosRequeridos];
      updatedDocs[index].isUploading = false;
      updatedDocs[index].error = 'Error al subir el archivo. Intente nuevamente.';
      setDocumentosRequeridos(updatedDocs);
    }
  };

  // Manejar el arrastre de archivos (drag and drop)
  const handleDrop = useCallback((index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log(`Archivo arrastrado para el documento en índice ${index}`);
      handleFileUpload(index, file);
    }
  }, [handleFileUpload]);

  // Clases base comunes
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";

  // Componente para cada campo de carga de documentos
  const DocumentUploadField: React.FC<{
    index: number;
    documento: DocumentState;
  }> = ({ index, documento }) => (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between">
        <label className={labelBaseClass}>
          {documento.nombre_archivo.replace(/_/g, ' ')}
          {documento.obligatorio && <span className="text-red-500 ml-1">*</span>}
        </label>
        {documento.isUploaded && (
          <span className="text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>
      
      {documento.detalle && <p className="text-sm text-gray-600 mb-2">{documento.detalle}</p>}
      
      {!documento.isUploaded ? (
        <div
          className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-pink-500 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(index, e)}
        >
          <div className="space-y-1 text-center">
            {documento.isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                <p className="mt-2 text-sm text-gray-500">Subiendo archivo...</p>
              </div>
            ) : documento.file ? (
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-700">{documento.file.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newDocs = [...documentosRequeridos];
                    newDocs[index].file = null;
                    setDocumentosRequeridos(newDocs);
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-pink-600 hover:text-pink-500">
                    <span>Subir archivo</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          handleFileUpload(index, file);
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500">PDF o Word hasta 10MB</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-2 p-4 bg-green-50 text-green-700 rounded-md">
          <p className="text-sm">Documento cargado correctamente</p>
          <button
            type="button"
            onClick={() => {
              // Permitir reemplazar el documento
              const newDocs = [...documentosRequeridos];
              newDocs[index].isUploaded = false;
              if (newDocs[index].obligatorio) {
                setUploadedObligatorios(prev => prev - 1);
              }
              setDocumentosRequeridos(newDocs);
            }}
            className="mt-2 text-xs underline text-green-800"
          >
            Reemplazar documento
          </button>
        </div>
      )}
      
      {documento.error && (
        <p className="mt-2 text-sm text-red-600">{documento.error}</p>
      )}
    </div>
  );

  // Mostrar pantalla de carga
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p className="mt-4 text-gray-600">Cargando documentos requeridos...</p>
      </div>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-800">Error al cargar documentos</h3>
        <p className="mt-2 text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentos</h2>
      
      {/* Mensaje sobre documentos obligatorios */}
      <div className="p-4 bg-blue-50 text-blue-700 rounded-md mb-6">
        <p>
          Para completar su solicitud debe subir {totalObligatorios} documento{totalObligatorios !== 1 ? 's' : ''} obligatorio{totalObligatorios !== 1 ? 's' : ''}.
          {uploadedObligatorios > 0 && ` Ha subido ${uploadedObligatorios} de ${totalObligatorios}.`}
        </p>
        <p className="text-sm mt-1">
          Los documentos marcados con <span className="text-red-500">*</span> son obligatorios.
        </p>
      </div>
      
      {/* Lista de documentos */}
      {documentosRequeridos.length === 0 ? (
        <p className="text-gray-500">No hay documentos requeridos para este tipo de proyecto.</p>
      ) : (
        documentosRequeridos.map((documento, index) => (
          <DocumentUploadField
            key={documento.id}
            index={index}
            documento={documento}
          />
        ))
      )}
      
      {/* Mensaje si todos los documentos obligatorios están subidos */}
      {uploadedObligatorios >= totalObligatorios && totalObligatorios > 0 && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md mb-6">
          <p className="font-medium">¡Excelente! Ha subido todos los documentos obligatorios.</p>
          <p className="text-sm mt-1">
            Puede continuar con el siguiente paso.
          </p>
        </div>
      )}
      
      {/* Navegación entre pasos */}
      <StepNavigation />
    </div>
  );
};

export default Step3;