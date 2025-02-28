'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormularioIniciativas from './form';
import { useIniciativaQuery } from '@/features/iniciativas/hooks/useIniciativaQuery';
import IniciativaCard from '@/features/iniciativas/components/IniciativaCard';

const IniciativasDashboard: React.FC = () => {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConsulta, setMostrarConsulta] = useState(false);
  const [radicado, setRadicado] = useState('');
  
  // Utilizamos el hook personalizado para manejar la consulta de iniciativas
  const { 
    iniciativa, 
    loading, 
    error, 
    fetchByRadicado, 
    reset 
  } = useIniciativaQuery();

  // Manejar la consulta de radicado usando el hook
  const handleConsultarRadicado = async () => {
    if (!radicado.trim()) {
      return;
    }
    
    await fetchByRadicado(radicado);
  };

  // Mostrar el detalle de la iniciativa
  const irAlDetalle = (id: number) => {
    router.push(`/iniciativas/${id}`);
  };

  // Renderizado condicional de los resultados de búsqueda
  const renderResultado = () => {
    if (loading) {
      return <div className="text-center py-4 text-neutral-900">Cargando...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    if (iniciativa) {
      return (
        <IniciativaCard 
          iniciativa={iniciativa} 
          onVerDetalles={irAlDetalle} 
          className="mt-4" 
        />
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
            className="bg-white rounded-lg border border-pink-200 p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
            onClick={() => setMostrarFormulario(true)}
          >
            <div className="flex flex-col items-center justify-center p-6 flex-grow">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Crear nueva iniciativa</h2>
              <p className="text-gray-600 text-base text-center mb-6">
                Registre una nueva iniciativa en el sistema y obtenga un número de radicado único.
              </p>
              <div className="mt-auto w-full flex justify-center">
                <button 
                  className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-md transition-colors text-lg w-40"
                  onClick={() => setMostrarFormulario(true)}
                >
                  Crear
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta para Consultar Iniciativa */}
          <div 
            className="bg-white rounded-lg border border-pink-200 p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
            onClick={() => setMostrarConsulta(true)}
          >
            <div className="flex flex-col items-center justify-center p-6 flex-grow">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Consultar iniciativa</h2>
              <p className="text-gray-600 text-base text-center mb-6">
                Verifique el estado de una iniciativa utilizando su número de radicado.
              </p>
              <div className="mt-auto w-full flex justify-center">
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md transition-colors text-lg w-40"
                  onClick={() => setMostrarConsulta(true)}
                >
                  Consultar
                </button>
              </div>
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
                reset();
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
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-black"
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
              onClick={() => {
                setMostrarConsulta(false);
                reset();
                setRadicado('');
              }}
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