import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "../components/WelcomeModal";
import EvaluationModal from "../components/EvaluationModal";

const BeachDetails: React.FC = () => {
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeTab, setActiveTab] = useState("avaliacoes");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mudar para true quando o usuário fizer login
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  const toggleEvaluationModal = () => {
    setShowEvaluationModal(!showEvaluationModal);
  };

  return (
    <div className="relative h-screen w-screen bg-blue-50 overflow-hidden">
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => navigate(isLoggedIn ? "/perfil" : "/auth")}
          className="bg-[#182E4D] text-white px-6 py-3 rounded-3xl text-sm font-medium hover:bg-[#1e3a5f] transition-colors"
        >
          {isLoggedIn ? "Perfil" : "ENTRAR"}
        </button>
      </div>

      {/* Mapa de fundo com overlay */}
      <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-sm">
        <img
          src="assets/mapa.png"
          alt="Mapa Floripa na Praia"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Painel lateral*/}
      <div className="absolute top-0 left-0 h-full bg-white/95 backdrop-blur-md rounded-r-3xl shadow-xl w-[620px] max-w-full flex flex-col border-r border-gray-200">
        {/* Cabeçalho*/}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-tr-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/LOGO.png"
                alt="Logo"
                className="w-10 h-10 drop-shadow-sm"
              />
              <h2 className="text-[#182E4D] text-xl font-bold">
                Floripa na Praia
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Barra de pesquisa*/}
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar praia..."
              className="w-full bg-white border border-gray-200 rounded-full px-5 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-400 absolute left-4 top-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Restante do código permanece igual */}
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

          {/* Destaques do dia*/}
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
                    className={`bg-${item.color}-50 p-3 rounded-xl mb-2 group-hover:bg-${item.color}-100 transition-colors`}
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
        {/* Botão Avaliar adicionado aqui */}
        <div className="mt-6 mb-8 flex justify-center">
          <button
            onClick={toggleEvaluationModal}
            className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Avaliar
          </button>
        </div>

        {/* Navegação simplificada sem ícones */}
        <div className="bg-white border-t border-gray-200 p-3 flex justify-around shadow-sm">
          {[
            { id: "avaliacoes", label: "Avaliações" },
            { id: "fotos", label: "Fotos" },
            { id: "flops", label: "Flops" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex flex-col items-center">
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-6 h-0.5 bg-blue-600 mt-1 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Botão de ajuda*/}
      <button
        onClick={toggleHelpModal}
        className="absolute bottom-6 right-6 bg-white rounded-full shadow-lg hover:shadow-xl transition-all w-12 h-12 flex items-center justify-center"
        aria-label="Ajuda"
      >
        <span className="text-blue-600 text-xl font-bold leading-none">?</span>
      </button>

      {showHelpModal && <WelcomeModal onClose={toggleHelpModal} />}

      {/* // arrumar aqui */}
      {showEvaluationModal && (
        <EvaluationModal
          onClose={toggleEvaluationModal}
          beachName={""}
          userName={""}
          userNickname={""}
          onSubmit={function (selectedConditions: string[]): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};

export default BeachDetails;
