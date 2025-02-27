'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormularioIniciativas from './form';

// Mock de API para iniciativas mientras se implementa el servicio real
const IniciativaAPI = {
  findByRadicado: async (radicado: string) => {
    // Simulamos una llamada a la API con un tiempo de espera
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulamos una respuesta basada en el radicado
    if (radicado === '202501000001') {
      return {
        id: 1,
        radicado: 202501000001,
        titulo: 'Proyecto de ejemplo',
        fecha_creacion: '2025-01-15T10:30:00Z',
        estado: { nombre_estado: 'Recibido' }
      };
    } else if (radicado === '202501000002') {
      return {
        id: 2,
        radicado: 202501000002,
        titulo: 'Iniciativa de prueba',
        fecha_creacion: '2025-01-20T14:45:00Z',
        estado: { nombre_estado: 'Validado' }
      };
    }
    
    // Si no coincide con ninguno de los ejemplos, retornamos null
    return null;
  }
};

const IniciativasDashboard: React.FC = () => {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConsulta, setMostrarConsulta] = useState(false);
  const [radicado, setRadicado] = useState('');
  const [iniciativa, setIniciativa] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Manejar la consulta de radicado
  const handleConsultarRadicado = async () => {
    if (!radicado.trim()) {
      setError('Por favor ingrese un número de radicado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resultado = await IniciativaAPI.findByRadicado(radicado);
      setIniciativa(resultado);
      setLoading(false);
    } catch (err) {
      console.error('Error al consultar radicado:', err);
      setError('No se encontró ninguna iniciativa con el radicado proporcionado');
      setIniciativa(null);
      setLoading(false);
    }
  };

  // Mostrar el detalle de la iniciativa
  const irAlDetalle = (id: number) => {
    router.push(`/iniciativas/${id}`);
  };

  // Renderizado condicional de los resultados de búsqueda
  const renderResultado = () => {
    if (loading) {
      return <div className="text-center py-4">Cargando...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    if (iniciativa) {
      return (
        <div className="bg-white rounded-lg border border-pink-200 p-6 mt-4 shadow-sm">
          <h3 className="font-bold text-xl mb-2">Iniciativa encontrada</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Radicado:</p>
              <p className="font-medium">{iniciativa.radicado}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado:</p>
              <p className="font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  iniciativa.estado.nombre_estado === 'Recibido' ? 'bg-blue-100 text-blue-800' :
                  iniciativa.estado.nombre_estado === 'Validado' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {iniciativa.estado.nombre_estado}
                </span>
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Título:</p>
              <p className="font-medium">{iniciativa.titulo}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Fecha de creación:</p>
              <p className="font-medium">
                {new Date(iniciativa.fecha_creacion).toLocaleDateString('es-CO')}
              </p>
            </div>
            <div className="col-span-2 mt-3">
              <button
                onClick={() => irAlDetalle(iniciativa.id)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition-colors w-full"
              >
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Si el formulario está activo, mostrarlo
  if (mostrarFormulario) {
    return (
      <div className="min-h-[calc(100vh-600px)]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => setMostrarFormulario(false)}
            className="text-pink-500 hover:text-pink-700 flex items-center gap-2 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al inicio
          </button>
        </div>
        <FormularioIniciativas />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[calc(100vh-600px)]">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Sistema de Gestión de Iniciativas</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Bienvenido al sistema de gestión de iniciativas. Puede crear una nueva iniciativa o consultar el estado de una iniciativa existente.
        </p>
      </div>

      {!mostrarConsulta ? (
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Tarjeta para Crear Iniciativa */}
          <div 
            className="bg-white rounded-lg border border-pink-200 p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setMostrarFormulario(true)}
          >
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Crear nueva iniciativa</h2>
              <p className="text-gray-600 text-base text-center mb-6">
                Registre una nueva iniciativa en el sistema y obtenga un número de radicado único.
              </p>
              <button 
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-md transition-colors text-lg"
                onClick={() => setMostrarFormulario(true)}
              >
                Crear
              </button>
            </div>
          </div>

          {/* Tarjeta para Consultar Iniciativa */}
          <div 
            className="bg-white rounded-lg border border-pink-200 p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setMostrarConsulta(true)}
          >
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Consultar iniciativa</h2>
              <p className="text-gray-600 text-base text-center mb-6">
                Verifique el estado de una iniciativa utilizando su número de radicado.
              </p>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md transition-colors text-lg"
                onClick={() => setMostrarConsulta(true)}
              >
                Consultar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-pink-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Consultar Iniciativa</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {
                setMostrarConsulta(false);
                setIniciativa(null);
                setError(null);
                setRadicado('');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-bold text-sm mb-2">
              Número de Radicado
            </label>
            <div className="flex">
              <input
                type="text"
                value={radicado}
                onChange={(e) => setRadicado(e.target.value)}
                placeholder="Ingrese el número de radicado"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={handleConsultarRadicado}
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-r-md transition-colors disabled:bg-pink-300"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>
          
          {renderResultado()}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setMostrarConsulta(false)}
              className="text-pink-500 hover:text-pink-700 underline"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IniciativasDashboard;