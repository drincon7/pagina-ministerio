'use client';

import { useState } from 'react';
import { useFormContext } from '../../../context/FormContext';
import { RemitenteService } from '@/services/api/remitente';

export const Step1 = () => {
  const { formData, updateFormData, updateValidation, nextStep } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializamos el estado local del formulario con los valores existentes
  const [formState, setFormState] = useState({
    numeroDocumento: formData.datosPersona.numeroDocumento || '',
    nombres: formData.datosPersona.nombres || '',
    primerApellido: formData.datosPersona.primerApellido || '',
    segundoApellido: formData.datosPersona.segundoApellido || '',
    email: formData.datosPersona.email || '',
    numeroContacto: formData.datosPersona.numeroContacto || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiamos la validación del campo cuando cambia
    updateValidation({
      [name]: { isValid: true, message: '' }
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log('Iniciando envío del formulario con datos:', formState);

    try {
      // Validar que el número de documento sea válido
      const numeroDocumento = parseInt(formState.numeroDocumento);
      if (isNaN(numeroDocumento)) {
        throw new Error('El número de documento debe ser un número válido');
      }

      // Buscar si el remitente ya existe
      console.log('Buscando remitente con número de documento:', numeroDocumento);
      const existingRemitente = await RemitenteService.findByIdentificacion(numeroDocumento);
      console.log('Respuesta de la API:', existingRemitente);

      if (existingRemitente) {
        // Si existe, actualizamos el formulario con los datos existentes
        updateFormData({
          datosPersona: {
            ...formData.datosPersona,
            numeroDocumento: existingRemitente.identificacion.toString(),
            nombres: existingRemitente.nombre,
            primerApellido: existingRemitente.primer_apellido,
            segundoApellido: existingRemitente.segundo_apellido || '',
            email: existingRemitente.email,
            numeroContacto: existingRemitente.telefono.toString(),
          }
        });
      } else {
        // Si no existe, actualizamos con los datos del formulario
        updateFormData({
          datosPersona: {
            ...formData.datosPersona,
            numeroDocumento: formState.numeroDocumento,
            nombres: formState.nombres.toUpperCase(),
            primerApellido: formState.primerApellido.toUpperCase(),
            segundoApellido: formState.segundoApellido.toUpperCase(),
            email: formState.email.toLowerCase(),
            numeroContacto: formState.numeroContacto,
          }
        });
      }

      // Avanzar al siguiente paso
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el formulario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700">
          Número de Documento *
        </label>
        <input
          type="text"
          id="numeroDocumento"
          name="numeroDocumento"
          value={formState.numeroDocumento}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="nombres" className="block text-sm font-medium text-gray-700">
          Nombres *
        </label>
        <input
          type="text"
          id="nombres"
          name="nombres"
          value={formState.nombres}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="primerApellido" className="block text-sm font-medium text-gray-700">
          Primer Apellido *
        </label>
        <input
          type="text"
          id="primerApellido"
          name="primerApellido"
          value={formState.primerApellido}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="segundoApellido" className="block text-sm font-medium text-gray-700">
          Segundo Apellido
        </label>
        <input
          type="text"
          id="segundoApellido"
          name="segundoApellido"
          value={formState.segundoApellido}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="numeroContacto" className="block text-sm font-medium text-gray-700">
          Número de Contacto *
        </label>
        <input
          type="tel"
          id="numeroContacto"
          name="numeroContacto"
          value={formState.numeroContacto}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Siguiente'}
        </button>
      </div>
    </form>
  );
};

export default Step1;