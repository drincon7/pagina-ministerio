// src/features/iniciativas/types/formTypes.ts

export type TipoRemitente = 'persona' | 'entidad' | 'organizacion';
export type TipoDocumento = 'CC' | 'CE' | 'TI' | 'NIT';
export type TipoProyecto = 'SOCIAL' | 'PRODUCTIVO' | 'INFRAESTRUCTURA';

// Interface para la localización
export interface Localizacion {
  departamento: string;
  ciudad: string;
}

// Interface para el paso 1 de persona (solo datos del formulario)
export interface PersonaStep1Data {
  remitenteId?: string;  // ID del remitente (para referencia, solo se usa en el frontend)
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  email: string;
  numeroContacto: string;
}

// Interface para el paso 2 de persona
export interface PersonaStep2Data {
  tipoProyecto: TipoProyecto;
  titulo: string;
  descripcion: string;
  localizaciones: Localizacion[];
  poblacionBeneficiada: string;
  valorTotal: string;
}

// Interface para los documentos
export interface DocumentoMetadata {
  nombre: string;
  tipo: string;
  tamaño: number;
}

export interface Documentos {
  cartaPresentacion: DocumentoMetadata | null;
  anexoTecnico: DocumentoMetadata | null;
  mgaNacional: DocumentoMetadata | null;
}

// Tipo para los datos combinados de persona
export type PersonaData = PersonaStep1Data & PersonaStep2Data & {
  documentos: Documentos;
};

// Interface principal del formulario
export interface FormData {
  tipoRemitente: TipoRemitente;
  paso: number;
  datosPersona: Partial<PersonaData>;
}

// Interface para el estado de validación
export interface ValidationField {
  isValid: boolean;
  message?: string;
}

export interface ValidationState {
  [key: string]: ValidationField;
}

// Interface para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Interface para el modelo de Remitente (según respuesta de la API)
export interface RemitenteResponse {
  identificacion: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  email: string;
  telefono: number;
  // No incluimos campos que son manejados por el backend
}