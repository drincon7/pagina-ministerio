'use client';

import { useState } from 'react';

/**
 * Hook personalizado para manejar las llamadas a la API y los errores
 * @returns Funciones y estados para interactuar con la API
 */
export const useApiService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  /**
   * Realiza una petición GET a la API
   * 
   * @param {string} url - URL a la que se realizará la petición
   * @returns {Promise<{success: boolean, data: any}>} - Resultado de la petición
   */
  const apiGet = async (url) => {
    try {
      setIsLoading(true);
      setShowError(false);

      const response = await fetch(url);
      return handleApiResponse(response);
    } catch (error) {
      handleError(error);
      return { success: false, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realiza una petición POST a la API
   * 
   * @param {string} url - URL a la que se realizará la petición
   * @param {object} data - Datos a enviar en el cuerpo de la petición
   * @returns {Promise<{success: boolean, data: any}>} - Resultado de la petición
   */
  const apiPost = async (url, data) => {
    try {
      setIsLoading(true);
      setShowError(false);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return handleApiResponse(response);
    } catch (error) {
      handleError(error);
      return { success: false, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Procesa la respuesta de la API y maneja los errores
   * 
   * @param {Response} response - Respuesta del fetch
   * @returns {Promise<{success: boolean, data: any}>} - Datos procesados
   */
  const handleApiResponse = async (response) => {
    try {
      const data = await response.json();

      if (!response.ok) {
        let errorMsg = 'Ocurrió un error procesando la solicitud';
        
        if (data.error) {
          errorMsg = typeof data.error === 'string' 
            ? data.error 
            : 'Error en la solicitud';
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.detail) {
          errorMsg = data.detail;
        }
        
        setErrorMessage(errorMsg);
        setShowError(true);
        return { success: false, data };
      }
      
      setShowError(false);
      return { success: true, data };
    } catch (error) {
      handleError(error);
      return { success: false, data: null };
    }
  };

  /**
   * Maneja errores generales
   * 
   * @param {Error} error - Error capturado
   */
  const handleError = (error) => {
    setErrorMessage(`Error: ${error.message}`);
    setShowError(true);
  };

  /**
   * Limpia los errores y mensajes
   */
  const clearErrors = () => {
    setShowError(false);
    setErrorMessage('');
  };

  return {
    isLoading,
    errorMessage,
    showError,
    apiGet,
    apiPost,
    clearErrors
  };
};

/**
 * Componente para mostrar mensajes de error
 */
export const ErrorMessage = ({ show, message }) => {
  if (!show) return null;
  
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4" role="alert">
      <p className="font-bold text-red-700">Error</p>
      <p className="text-red-700">{message}</p>
    </div>
  );
};