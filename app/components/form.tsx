'use client';

import React, { useState } from 'react';

// Tipos de remitente
type TipoRemitente = 'persona' | 'entidad' | 'organizacion';

// Interface para el estado del formulario
interface FormData {
  tipoRemitente: TipoRemitente;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  nombreEntidad?: string;
  razonSocial?: string;
  nombreOrganizacion?: string;
  razonOrganizacion?:string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  numeroContacto: string;
  paso: number;
}

const FormularioIniciativas: React.FC = () => {
  // Clase base para inputs
  const inputBaseClass = "w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500";
  
  // Clase base para labels
  const labelBaseClass = "block text-gray-700 font-bold text-sm mb-1";
  // Estado inicial del formulario
  const [formData, setFormData] = useState<FormData>({
    tipoRemitente: 'persona',
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    nombreEntidad: '',
    nombreOrganizacion: '',    
    razonSocial: '',
    razonOrganizacion: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    email: '',
    numeroContacto: '',
    paso: 1,
  });

  // Manejador de cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador de cambio de paso
  const handleNext = () => {
    setFormData(prev => ({
      ...prev,
      paso: prev.paso + 1
    }));
  };

  // Renderizado condicional de campos según tipo de remitente
  const renderCamposSegunTipo = () => {
    switch (formData.tipoRemitente) {
      case 'persona':
        return (
          <>
            <div className="mb-4">
              <label className={labelBaseClass} htmlFor="nombres">
                Nombre (s)
              </label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className={inputBaseClass}               
              />
            </div>
            <div className="mb-4">
              <label className={labelBaseClass} htmlFor="primerApellido">
                Primer apellido
              </label>
              <input
                type="text"
                id="primerApellido"
                name="primerApellido"
                value={formData.primerApellido}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"                
              />
            </div>
            <div className="mb-4">
              <label className={labelBaseClass} htmlFor="segundoApellido">
                Segundo apellido
              </label>
              <input
                type="text"
                id="segundoApellido"
                name="segundoApellido"
                value={formData.segundoApellido}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"                
              />
            </div>
            <div className="mb-4">
                <label className= {labelBaseClass} htmlFor="numeroDocumento">
                Número de documento
                </label>
            <div className="flex gap-2">
            <select
              className={`w-16 text-gray-700 font-medium`}
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
            >
              <option value="CC">CC.</option>
              <option value="CE">CE.</option>
              <option value="TI">TI.</option>
            </select>
            <input
              type="text"
              id="numeroDocumento"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              className={`flex-1 ${inputBaseClass}`}              
            />
          </div>
        </div>        
          </>
        );

        case 'entidad':
        return (
          <>
            <div className="mb-4">
              <label className={labelBaseClass} htmlFor="nombreEntidad">
                Nombre de la entidad
              </label>
              <input
                type="text"
                id="nombreEntidad"
                name="nombreEntidad"
                value={formData.nombreEntidad}
                onChange={handleChange}
                className={inputBaseClass}
              />
            </div>
            <div className="mb-4">
              <label className={labelBaseClass} htmlFor="razonSocial">
                Razón social de la entidad
              </label>
              <input
                type="text"
                id="razonSocial"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                className={inputBaseClass}
              />
            </div>
            <div className="mb-4">
              <label className={labelBaseClass} htmlFor="numeroDocumento">
                Número de documento
              </label>
              <div className="flex gap-2">
                <select
                  className={`w-24 text-gray-700 font-medium ${inputBaseClass}`}
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                >
                  <option value="NIT">NIT</option>
                </select>
                <input
                  type="text"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  className={`flex-1 ${inputBaseClass}`}                  
                />
              </div>
            </div>            
          </>
        );

        case 'organizacion':
        return (
          <>
            <div className="mb-4">
              <label className={labelBaseClass} htmlFor="nombreOrganizacion">
                Nombre de la organización
              </label>
              <input
                type="text"
                id="nombreOrganizacion"
                name="nombreOrganizacion"
                value={formData.nombreOrganizacion}
                onChange={handleChange}
                className={inputBaseClass}
              />
            </div>
            <div className="mb-4">
              <label className={labelBaseClass} htmlFor="razonOrganizacion">
                Razón social de la organización
              </label>
              <input
                type="text"
                id="razonOrganizacion"
                name="razonOrganizacion"
                value={formData.razonOrganizacion}
                onChange={handleChange}
                className={inputBaseClass}
              />
            </div>
            <div className="mb-4">
              <label className={labelBaseClass} htmlFor="numeroDocumento">
                Número de documento
              </label>
              <div className="flex gap-2">
                <select
                  className={`w-24 text-gray-700 font-medium ${inputBaseClass}`}
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                >
                  <option value="NIT">NIT</option>
                </select>
                <input
                  type="text"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  className={`flex-1 ${inputBaseClass}`}                  
                />
              </div>
            </div>            
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Indicador de pasos */}
      <div className="flex items-center justify-center gap-12 mb-8">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${
            formData.paso === 1 ? 'bg-pink-500 text-white' : 'bg-gray-300'
          } flex items-center justify-center font-bold text-sm`}>
            1
          </div>
          <span className="text-xs mt-1 text-gray-600">Datos del remitente</span>
        </div>
        <div className="flex-1 h-px bg-gray-300"></div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${
            formData.paso === 2 ? 'bg-pink-500 text-white' : 'bg-gray-300'
          } flex items-center justify-center font-bold text-sm`}>
            2
          </div>
          <span className="text-xs mt-1 text-gray-600">Datos de la iniciativa</span>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="bg-white rounded-lg border border-pink-200 p-6">
        <h2 className="text-2xl font-bold text-pink-500 mb-6">
          Datos del remitente
        </h2>

        {/* Tipo de remitente */}
        <div className="mb-6">
          <label className={labelBaseClass}>
            Tipo de remitente
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tipoRemitente"
                value="persona"
                checked={formData.tipoRemitente === 'persona'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 font-medium">Persona Natural</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tipoRemitente"
                value="entidad"
                checked={formData.tipoRemitente === 'entidad'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 font-medium">Entidad Pública</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tipoRemitente"
                value="organizacion"
                checked={formData.tipoRemitente === 'organizacion'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 font-medium">Organización Privada</span>
            </label>
          </div>
        </div>

        {/* Campos según tipo de remitente */}
        {renderCamposSegunTipo()}

        {/* Campos comunes */}
        <div className="mb-4">
              <label className={labelBaseClass} htmlFor="email">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputBaseClass}                
              />
            </div>

            <div className="mb-6">
              <label className={labelBaseClass} htmlFor="numeroContacto">
                Número de contacto
              </label>
              <div className="flex gap-2">
                <span className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 font-medium">
                  +57
                </span>
                <input
                  type="tel"
                  id="numeroContacto"
                  name="numeroContacto"
                  value={formData.numeroContacto}
                  onChange={handleChange}
                  className={`flex-1 ${inputBaseClass}`}                  
                />
              </div>
            </div>                

        {/* Botón Siguiente */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioIniciativas;