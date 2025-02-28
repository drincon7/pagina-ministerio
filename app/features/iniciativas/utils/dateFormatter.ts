// @/features/iniciativas/utils/dateFormatter.ts

/**
 * Formatea una fecha en formato local español colombiano
 * @param dateString - String de fecha, timestamp, o instancia de Date
 * @param defaultValue - Valor a mostrar si la fecha es inválida
 * @returns Fecha formateada como string (ej. "27 de febrero de 2025")
 */
export const formatDate = (
    dateString: string | Date | null | undefined,
    defaultValue: string = 'No especificada'
  ): string => {
    // Si la fecha es null o undefined, retornar valor por defecto
    if (dateString === null || dateString === undefined) {
      return defaultValue;
    }
    
    // Convertir a objeto Date
    let date: Date;
    
    if (dateString instanceof Date) {
      date = dateString;
    } else {
      date = new Date(dateString);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return defaultValue;
    }
    
    // Formatear la fecha en español colombiano
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  export default formatDate;