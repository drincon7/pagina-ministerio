'use client';

import React, { useCallback, useState } from 'react';
import { useFormContext } from '../../../context/FormContext';
import { useFormValidation } from '../../../hooks/useFormValidation';
import type { DocumentoMetadata, Documentos } from '../../../types/formTypes';
import StepNavigation from '../../StepNavigation';

type DocumentKey = keyof Documentos;

interface DocumentState {
  file: File | null;
  isUploading: boolean;
  error: string | null;
}

type DocumentStates = {
  [K in DocumentKey]: DocumentState;
};

const Step3: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { validationState } = useFormValidation();

  const [documents, setDocuments] = useState<DocumentStates>({
    cartaPresentacion: { file: null, isUploading: false, error: null },
    anexoTecnico: { file: null, isUploading: false, error: null },
    mgaNacional: { file: null, isUploading: false, error: null }
  });

  // Clases base comunes
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";

  const handleFileChange = useCallback((documentType: DocumentKey, file: File | null) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: {
        file,
        isUploading: false,
        error: null
      }
    }));

    const documentMetadata: DocumentoMetadata | null = file ? {
      nombre: file.name,
      tipo: file.type,
      tamaño: file.size
    } : null;

    const currentDocumentos = formData.datosPersona?.documentos || {
      cartaPresentacion: null,
      anexoTecnico: null,
      mgaNacional: null
    };

    const updatedPersonaData = {
      ...formData.datosPersona,
      documentos: {
        ...currentDocumentos,
        [documentType]: documentMetadata
      }
    };

    updateFormData({
      datosPersona: updatedPersonaData
    });
  }, [formData.datosPersona, updateFormData]);

  const validateFile = (file: File): string | null => {
    if (file.size > 10 * 1024 * 1024) {
      return 'El archivo no debe superar los 10MB';
    }
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return 'Solo se permiten archivos PDF o Word';
    }

    return null;
  };

  const handleDrop = useCallback((documentType: DocumentKey, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setDocuments(prev => ({
          ...prev,
          [documentType]: { ...prev[documentType], error }
        }));
        return;
      }
      handleFileChange(documentType, file);
    }
  }, [handleFileChange]);

  const DocumentUploadField: React.FC<{
    title: string;
    type: DocumentKey;
    description?: string;
  }> = ({ title, type, description }) => (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
      <label className={labelBaseClass}>{title}</label>
      {description && <p className="text-sm text-gray-600 mb-2">{description}</p>}
      
      <div
        className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-pink-500 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(type, e)}
      >
        <div className="space-y-1 text-center">
          {documents[type].file ? (
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-700">{documents[type].file.name}</span>
              <button
                type="button"
                onClick={() => handleFileChange(type, null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Eliminar
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
                        const error = validateFile(file);
                        if (error) {
                          setDocuments(prev => ({
                            ...prev,
                            [type]: { ...prev[type], error }
                          }));
                          return;
                        }
                        handleFileChange(type, file);
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
      {documents[type].error && (
        <p className="mt-2 text-sm text-red-600">{documents[type].error}</p>
      )}
      {validationState[type]?.message && (
        <p className="mt-2 text-sm text-red-600">{validationState[type].message}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentos</h2>

      <DocumentUploadField
        title="Carta de presentación del proyecto"
        type="cartaPresentacion"
        description="Documento que describe el proyecto y sus objetivos principales"
      />

      <DocumentUploadField
        title="Anexo técnico"
        type="anexoTecnico"
        description="Detalles técnicos y especificaciones del proyecto"
      />

      <DocumentUploadField
        title="MGA Nacional"
        type="mgaNacional"
        description="Metodología General Ajustada para proyectos de inversión pública"
      />
      <StepNavigation />
    </div>
  );
};

export default Step3;