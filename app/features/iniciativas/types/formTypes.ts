// Tipo de datos para la sección de persona
export interface PersonaData {
  remitenteId?: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
  email: string;
  numeroContacto: string;
}

// Tipo de datos con campos opcionales para uso en componentes
export interface PersonaDataPartial {
  remitenteId?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  email?: string;
  numeroContacto?: string;
}

// Tipo de datos para la sección de entidad
export interface EntidadData {
  remitenteId?: string;
  nombre: string;
  nit: string;
  direccion: string;
  email: string;
  telefono: string;
}

// Tipo de datos con campos opcionales para uso en componentes
export interface EntidadDataPartial {
  remitenteId?: string;
  nombre?: string;
  nit?: string;
  direccion?: string;
  email?: string;
  telefono?: string;
}

// Tipo de datos para la sección de organización
export interface OrganizacionData {
  remitenteId?: string;
  nombreOrganizacion: string;
  razonOrganizacion: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  numeroContacto: string;
}

// Tipo de datos con campos opcionales para uso en componentes
export interface OrganizacionDataPartial {
  remitenteId?: string;
  nombreOrganizacion?: string;
  razonOrganizacion?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  email?: string;
  numeroContacto?: string;
}

// Tipo de datos completo del formulario
export interface FormData {
  paso: number;
  tipoRemitente: 'persona' | 'entidad' | 'organizacion';
  datosPersona?: PersonaDataPartial;
  datosEntidad?: EntidadDataPartial;
  datosOrganizacion?: OrganizacionDataPartial;
}

// Tipos para la validación
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface ValidationState {
  [key: string]: ValidationResult;
}