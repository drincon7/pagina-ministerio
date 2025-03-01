// Definiciones de tipos para el formulario de iniciativas

// Interfaz para el resultado de validación
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Estado de validación del formulario
export interface ValidationState {
  [key: string]: ValidationResult | undefined;
}

// Interfaces para documentos
export interface DocumentoMetadata {
  nombre: string;
  tipo: string;
  tamaño: number;
}

export interface Documentos {
  cartaPresentacion?: DocumentoMetadata | null;
  anexoTecnico?: DocumentoMetadata | null;
  mgaNacional?: DocumentoMetadata | null;
  [key: string]: DocumentoMetadata | null | undefined;
}

// Datos parciales para persona
export interface PersonaDataPartial {
  remitenteId?: string;
  iniciativaId?: string; // ID de la iniciativa creada
  radicado?: number;     // Número de radicado generado por el sistema
  tipoDocumento?: string;
  numeroDocumento?: string;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  email?: string;
  numeroContacto?: string;
  tipoProyecto?: string;
  titulo?: string;
  descripcion?: string;
  poblacionBeneficiada?: string;
  valorTotal?: string;
  documentos?: Documentos; // Añadido para documentos
}

// Datos parciales para entidad
export interface EntidadDataPartial {
  remitenteId?: string;
  iniciativaId?: string; // ID de la iniciativa creada
  radicado?: number;     // Número de radicado generado por el sistema
  nombre?: string;
  nit?: string;
  email?: string;
  telefono?: string;
  tipoProyecto?: string;
  titulo?: string;
  descripcion?: string;
  poblacionBeneficiada?: string;
  valorTotal?: string;
  documentos?: Documentos; // Añadido para documentos
}

// Datos parciales para organización
export interface OrganizacionDataPartial {
  remitenteId?: string;
  iniciativaId?: string; // ID de la iniciativa creada
  radicado?: number;     // Número de radicado generado por el sistema
  nombreOrganizacion?: string;
  razonOrganizacion?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  email?: string;
  numeroContacto?: string;
  tipoProyecto?: string;
  titulo?: string;
  descripcion?: string;
  poblacionBeneficiada?: string;
  valorTotal?: string;
  documentos?: Documentos; // Añadido para documentos
}

// Estructura completa de datos del formulario
export interface FormData {
  paso: number;
  tipoRemitente: 'persona' | 'entidad' | 'organizacion';
  datosPersona?: PersonaDataPartial;
  datosEntidad?: EntidadDataPartial;
  datosOrganizacion?: OrganizacionDataPartial;
}