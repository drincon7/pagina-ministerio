"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full">
      {/* 
        1) CONTENEDOR BLANCO PRINCIPAL
           - Ocupa la parte superior del footer.
           - Incluye la info institucional, logo y redes.
      */}
      <div className="max-w-6xl mx-auto bg-white pt-8 pb-8 px-4 shadow-md relative z-10">
        {/* Texto e información institucional */}
        <div className="flex flex-col md:flex-row items-start justify-between">
          {/* Bloque de texto */}
          <div className="md:w-2/3 text-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">
              Ministerio de Igualdad y Equidad
            </h2>
            <p className="mb-1">
              Calle 28 # 13a - 15, Edificio Torre de Comercio Internacional,
              Bogotá D.C. - Colombia
            </p>
            <p className="mb-1">Código Postal: 110911</p>
            <p className="mb-1">
              Horario de atención: Lunes a viernes de 8:00 a.m. a 4:00 p.m. / Jornada continua
            </p>
            <p className="mb-1">Teléfono Conmutador: 601 5558253</p>
            <p className="mb-1">Línea Gratuita: 018000XXXXXX</p>
            <p className="mb-1">
              Correo Institucional:{" "}
              <a
                href="mailto:ministerioigualdad@igualdad.gov.co"
                className="text-blue-600 underline"
              >
                ministerioigualdad@igualdad.gov.co
              </a>
            </p>
            <p className="mb-1">
              Notificaciones judiciales:{" "}
              <a
                href="mailto:notificacionesjudiciales@igualdad.gov.co"
                className="text-blue-600 underline"
              >
                notificacionesjudiciales@igualdad.gov.co
              </a>
            </p>
            <p className="mb-1">
              Página web:{" "}
              <a
                href="https://www.igualdad.gov.co"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.igualdad.gov.co
              </a>
            </p>
            <p className="mb-4">
              Políticas de Privacidad | Condiciones de uso
            </p>
            <p className="text-sm text-gray-500 mb-4">
              © 2023 – Todos los derechos reservados <br />
              Gobierno de Colombia
            </p>
          </div>

          {/* Logo a la derecha */}
          <div className="md:w-1/3 flex justify-end mt-6 md:mt-0">
            <img
              src="/favicon.png"  // Ajusta la ruta de tu logo
              alt="Logo Igualdad"
              className="h-20 object-contain"
            />
          </div>
        </div>

        {/* Redes sociales al final del contenedor blanco */}
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {/* Ejemplo de 5 redes sociales */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">FB</span>
            </div>
            <span className="text-gray-700 mt-2">@MinIgualdad_Co</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">TW</span>
            </div>
            <span className="text-gray-700 mt-2">@MinIgualdad</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">IG</span>
            </div>
            <span className="text-gray-700 mt-2">@MinIgualdad</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">YT</span>
            </div>
            <span className="text-gray-700 mt-2">@MinIgualdad</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">IN</span>
            </div>
            <span className="text-gray-700 mt-2">@MinIgualdadCo</span>
          </div>
        </div>
      </div>

      {/*
        2) FRANJA ROSADA QUE NO EMPIEZA ARRIBA
           - La movemos hacia arriba con margen negativo para que aparezca 
             por detrás de la parte inferior del contenedor blanco.
      */}
      <div className="bg-pink-600 h-[520px] -mt-[470]" />

      {/*
        3) FRANJA AZUL INFERIOR
           - Imagen adicional a la izquierda, línea blanca y logo Gov.co, 
             más el enlace "Conoce GOV.CO aquí".
      */}
      <div className="bg-blue-600 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Imagen adicional a la izquierda */}
            <img
              src="/marcaPais.png" // Ajusta la ruta de tu imagen adicional
              alt="Imagen adicional"
              className="h-8"
            />
            {/* Pequeña línea blanca divisoria */}
            <div className="w-px h-6 bg-white" />
            {/* Logo Gov.co */}
            <img
              src="/gov.png" // Ajusta la ruta del logo Gov.co
              alt="Logo Gov.co"
              className="h-8"
            />
          </div>
          <a
            href="https://www.gov.co/"
            className="text-white underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conoce GOV.CO aquí
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
