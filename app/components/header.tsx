"use client";

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="font-sans border-b border-gray-300">
      {/* Barra superior azul */}
      <div className="bg-blue-600 h-10 flex items-center pl-4">
        {/* Imagen en el lado izquierdo */}
        <img
          src="/gov.png"
          alt="Logo GOVCO"
          className="h-6"
        />
      </div>

      {/* Barra superior con logotipos (blanca) */}
      <div className="flex items-center bg-white py-6 px-4">
        <div className="flex items-center mr-8">
          {/* Logo GOVCO (ejemplo) */}
          <img 
            src="/favicon.png" 
            alt="Logo GOVCO" 
            className="h-20 mr-2"
          />
          {/* Si necesitas un texto adicional, agrégalo aquí */}
          {/* <span className="font-bold text-pink-600 text-lg">Igualdad</span> */}
        </div>
      </div>

      {/* Barra de navegación */}
      <nav className="bg-gray-100 py-2 px-4">
        <ul className="flex justify-center list-none m-0 p-0">
          <li>
            <a href="#inicio" className="no-underline text-gray-800 mr-6 font-medium">
              Inicio
            </a>
          </li>
          <li>
            <a href="#transparencia" className="no-underline text-gray-800 mr-6 font-medium">
              Transparencia
            </a>
          </li>
          <li>
            <a href="#atencion" className="no-underline text-gray-800 mr-6 font-medium">
              Atención y Servicio a la Ciudadanía
            </a>
          </li>
          <li>
            <a href="#iniciativas" className="no-underline text-gray-800 mr-6 font-medium">
              Iniciativas
            </a>
          </li>
          <li>
            <a href="#programas" className="no-underline text-gray-800 mr-6 font-medium">
              Programas
            </a>
          </li>
          <li>
            <a href="#sala-de-prensa" className="no-underline text-gray-800 mr-6 font-medium">
              Sala de Prensa
            </a>
          </li>
          <li>
            <a href="#normatividad" className="no-underline text-gray-800 mr-6 font-medium">
              Normatividad
            </a>
          </li>
          <li>
            <a href="#proyectos-normativos" className="no-underline text-gray-800 mr-6 font-medium">
              Proyectos Normativos
            </a>
          </li>
          <li>
            <a href="#pacifico" className="no-underline text-gray-800 mr-6 font-medium">
              Pacífico
            </a>
          </li>
          <li>
            <a href="#participa" className="no-underline text-gray-800 mr-6 font-medium">
              Participa
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
