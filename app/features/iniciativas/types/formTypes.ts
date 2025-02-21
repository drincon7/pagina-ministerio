export type TipoRemitente = 'persona' | 'entidad' | 'organizacion';
export type TipoDocumento = 'CC' | 'CE' | 'TI' | 'NIT';
export type TipoProyecto = 'SOCIAL' | 'PRODUCTIVO' | 'INFRAESTRUCTURA';

// Interface para el paso 1 de persona
export interface PersonaStep1Data {
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  tipoDocumento: 'CC' | 'CE' | 'TI';
  numeroDocumento: string;
  email: string;
  numeroContacto: string;
}

// Interface para el paso 2 de persona
export interface PersonaStep2Data {
  tipoProyecto: TipoProyecto;
  titulo: string;
  descripcion: string;
  localizaciones: Array<{
    departamento: string;
    ciudad: string;
  }>;
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

export interface PersonaStep3Data {
  documentos: Documentos;
}

// Interface para el paso 1 de Entidad
export interface EntidadStep1Data {
  nombres: string;  
  tipoDocumento: 'NIT' | 'CE' | 'TI';
  razinSocial: string;
  email: string;
  numeroContacto: string;
}

// Interface para el paso 1 de Organizacion
export interface OrganizacionStep1Data {
  nombres: string;  
  tipoDocumento: 'NIT' | 'CE' | 'TI';
  razinSocial: string;
  email: string;
  numeroContacto: string;
}

// Tipo para los datos combinados de persona
export type PersonaData = PersonaStep1Data & PersonaStep2Data & {
  documentos?: Documentos;
};

// Interface principal del formulario
export interface FormData {
  tipoRemitente: TipoRemitente;
  paso: number;
  datosPersona: Partial<PersonaData>;
  datosEntidad?: any; // Añadir tipos específicos cuando se implementen
  datosOrganizacion?: any; // Añadir tipos específicos cuando se implementen
}

// Interface para el estado de validación
export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    message?: string;
  };
}