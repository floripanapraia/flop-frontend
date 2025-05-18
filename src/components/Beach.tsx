import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EvaluationModal from "./EvaluationModal";
import { X } from 'lucide-react';

interface BeachProps {
  onClose: () => void;
  onSubmit: (selectedConditions: string[]) => void;
}

const Beach: React.FC = () => {
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const navigate = useNavigate();

  const toggleEvaluationModal = () => {
    setShowEvaluationModal(!showEvaluationModal);
  };

  return (
    <div>
      {/* Painel lateral */}
      <div className="absolute top-0 left-0 h-full bg-white/95 backdrop-blur-md shadow-xl w-[620px] max-w-full flex flex-col rounded-r-3xl overflow-hidden">
        {/* Cabeçalho */}
        <div
          className="px-6 pt-8 pb-8 border relative"
          style={{
            backgroundImage: "url('assets/joaca.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/30 z-0"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3"></div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/home')}
                  className="p-2 text-white hover:text-blue-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Barra de pesquisa */}
            <div className="flex-1 mx-4">
              <input
                type="text"
                placeholder="Pesquisar praia..."
                className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/90 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Cabeçalho da praia */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  Praia da Joaquina
                </h1>
                <div className="flex items-center text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm font-medium">
                    1230 avaliações
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Destaques do dia */}
          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="w-1 h-5 bg-blue-500 rounded-full mr-2"></span>
              HOJE NA JOAQUINA
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  icon: "/assets/iconFull/nublado.svg",
                  label: "Nublado",
                  votes: "230",
                },
                {
                  icon: "/assets/iconFull/sol.svg",
                  label: "Sol",
                  votes: "230",
                  color: "purple",
                },
                {
                  icon: "/assets/iconFull/lotada.svg",
                  label: "Lotada",
                  votes: "300",
                },
                {
                  icon: "/assets/iconFull/musica.svg",
                  label: "Música Alta",
                  votes: "150",
                },
                {
                  icon: "/assets/iconFull/aguaviva.svg",
                  label: "Água-Viva",
                  votes: "180",
                },
                {
                  icon: "/assets/iconFull/marcalmo.svg",
                  label: "Mar Calmo",
                  votes: "95",
                },
                {
                  icon: "/assets/iconFull/limpa.svg",
                  label: "Limpa",
                  votes: "40",
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div
                    className={`bg-${item.color} p-3 rounded-xl mb-2 group-hover:bg-${item.color}-100 transition-colors`}
                  >
                    {typeof item.icon === "string" &&
                    item.icon.includes(".svg") ? (
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-14 h-14"
                      />
                    ) : (
                      <span className="text-2xl">{item.icon}</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-700 text-center">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.votes} votos
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Botão Avaliar */}
        <div className="mt-6 mb-8 flex justify-center">
          <button
            onClick={toggleEvaluationModal}
            className="px-5 py-2 bg-blue-900 text-white rounded-md font-medium hover:bg-[#1e3a5f] transition-colors shadow-md"
          >
            Avaliar
          </button>
        </div>
      </div>
      {/* Modal de avaliação */}
      {showEvaluationModal && (
        <EvaluationModal
          onClose={toggleEvaluationModal}
          beachName="Praia da Joaquina"
          userName=""
          userNickname=""
          onSubmit={function (selectedConditions: string[]): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};
export default Beach;
