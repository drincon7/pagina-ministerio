// @/utils/currencyFormatter.ts

/**
 * Formatea un valor como moneda colombiana (COP)
 * @param value - El valor a formatear (número o string)
 * @param defaultValue - Valor a mostrar si el input es inválido (opcional)
 * @returns String con formato de moneda colombiana
 */
export const formatCurrency = (
    value: number | string | null | undefined,
    defaultValue: string = 'No especificado'
  ): string => {
    // Si el valor es null o undefined, retornar el valor por defecto
    if (value === null || value === undefined) {
      return defaultValue;
    }
    
    // Si el valor ya es un número, formatear directamente
    if (typeof value === 'number') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      }).format(value);
    }
    
    // Si es un string, intentar convertirlo a número
    if (typeof value === 'string') {
      // Limpiar el string de cualquier carácter que no sea dígito, punto o coma
      const cleanValue = value.replace(/[^\d.,]/g, '')
        // Reemplazar comas por puntos para facilitar la conversión
        .replace(/,/g, '.');
      
      const number = parseFloat(cleanValue);
      
      if (!isNaN(number)) {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0
        }).format(number);
      }
    }
    
    // Si llegamos aquí, el valor no se pudo convertir a número
    return defaultValue;
  };
  
  export default formatCurrency;