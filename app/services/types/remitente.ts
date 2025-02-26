// @/services/api/types/remitente.ts

export interface Remitente {
  id: number;
  identificacion: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  nombre_entidad: string | null;
  email: string;
  telefono: number;
  creado_desde: string;
  fecha_creacion: string;
  fecha_act: string;
  tipo: number;
  usuario_act: string | null;
  estado: number;
}

export interface RemitenteResponse {
  data: Remitente[];
}

export interface CreateRemitenteDTO {
  identificacion: number;
  nombre: string | null;
  primer_apellido: string | null;
  segundo_apellido?: string | null;
  nombre_entidad?: string | null;
  email: string;
  telefono: number;
  creado_desde: string;
  tipo: number;
}

// Definiciones de tipos para el formulario (frontend)
export interface PersonaData {
  remitenteId?: string | null;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
  email: string;
  numeroContacto: string;
}

export interface EntidadData {
  remitenteId?: string | null
  nombre: string;
  nit: string;
  email: string;
  telefono: string;
}

export interface OrganizacionData {
  remitenteId?: string | null;
  nombreOrganizacion: string;
  razonOrganizacion: string;
  email: string;
  numeroContacto: string;
}