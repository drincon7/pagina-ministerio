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
  
  // Para cuando necesitemos crear un nuevo remitente
  export interface CreateRemitenteDTO {
    identificacion: number;
    nombre: string;
    primer_apellido: string;
    segundo_apellido?: string;
    nombre_entidad?: string;
    email: string;
    telefono: number;
    tipo: number;
  }