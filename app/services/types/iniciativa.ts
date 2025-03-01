export interface Estado {
  id: number;
  nombre_estado: string;
}

export interface Remitente {
  id: number;
  identificacion: number;
  nombre: string | null;
  primer_apellido: string | null;
  segundo_apellido: string | null;
  nombre_entidad: string | null;
  email: string;
  telefono: number;
}

export interface TipoProyecto {
  id: number;
  tipo_proyecto: string;
}

export interface PoblacionObjetivo {
  id: number;
  poblacion_objetivo: string;
}

export interface Clasificacion {
  id: number;
  id_clasificacion: number;
  clasificacion: string;
}

export interface Viceministerio {
  id: number;
  viceministerio: string;
}

export interface Iniciativa {
  id: number;
  radicado: number;
  radicado_por: Remitente | null;
  entidad: number;
  tipo_proyecto: TipoProyecto;
  titulo: string;
  descripcion: string;
  poblacion_beneficiada: number;
  valor_total: number;
  fecha_creacion: string;
  creado_desde: string;
  poblacion_objetivo: PoblacionObjetivo | null;
  responsable: any | null;
  fecha_verificacion: string | null;
  estado: Estado;
  aspectos?: any[];
  clasificaciones?: Clasificacion[];
  viceministerios?: Viceministerio[];
}

export interface IniciativaResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Iniciativa[];
}

// Actualizada para incluir 'entidad' como propiedad
export interface IniciativaCreateDTO {
  entidad: number;                // Oficina o entidad ID
  radicado_por: number;           // ID del remitente
  tipo_proyecto: number | string;
  titulo: string;
  descripcion: string;
  poblacion_beneficiada: number | string;
  poblacion_objetivo?: number;
  valor_total: number | string;
  creado_desde: string;           // 'web', 'persona', 'entidad', 'organizacion'
  radicado?: number | null;       // Generado automáticamente por el backend
}

export interface IniciativaUpdateDTO {
  titulo?: string;
  descripcion?: string;
  poblacion_beneficiada?: number;
  poblacion_objetivo?: number;
  valor_total?: number;
  tipo_proyecto?: number;
}
export interface DocumentoMetadata {
    id: number;
    nombre_archivo: string;
    subido: boolean;
    obligatorio: boolean;
  }