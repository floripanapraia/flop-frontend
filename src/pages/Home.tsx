// src/pages/Home.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "../components/WelcomeModal";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isAIActive, setIsAIActive] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSliderChange = () => {
    setIsAIActive(!isAIActive);
  };
  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  return (
    <div className="relative h-screen w-screen">
      <img
        src="/assets/mapa.png"
        alt="Mapa Floripa na Praia"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Caixa de busca */}
      <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="flex items-center space-x-2 mb-4">
          <img src="/assets/LOGO.png" alt="Logo" className="w-10 h-10" />
          <h2 className="text-[#182E4D] text-lg font-semibold">
            Floripa na praia
          </h2>
        </div>
        <input
          type="text"
          placeholder="Pesquisar praia..."
          className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Texto e slider na mesma linha */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Procurando a praia ideal em Floripa?
            <br />
            Nossa IA pode te ajudar a encontrar o destino perfeito para o seu
            dia!
          </p>

          <div className="flex items-center ml-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAIActive}
                onChange={handleSliderChange}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 rounded-full peer 
                ${isAIActive ? "bg-indigo-900" : "bg-gray-200"} 
                peer-focus:ring-4 peer-focus:ring-indigo-300 
                transition-colors duration-300`}
              >
                <div
                  className={`absolute top-0.5 left-[2px] 
                  ${isAIActive ? "translate-x-5" : "translate-x-0"}
                  bg-white rounded-full h-5 w-5 transition-transform duration-300
                  shadow-md transform`}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Status da IA */}
        <div
          className={`flex items-center justify-center p-2 rounded-md transition-all duration-300 ${
            isAIActive
              ? "bg-indigo-50 border border-indigo-100 animate-pulse"
              : "bg-transparent"
          }`}
        >
          <p
            className={`text-xs ${
              isAIActive ? "text-indigo-600" : "text-transparent"
            }`}
          >
            {isAIActive
              ? "Modo IA ativo: Buscas inteligentes habilitadas"
              : "."}
          </p>
        </div>
      </div>

      {/* Botão entrar */}
      <button
        onClick={() => navigate("/auth")}
        className="absolute top-4 right-4 bg-[#182E4C] hover:bg-[#1a365d] text-white text-base font-bold py-2 px-5 rounded-full shadow transition-colors duration-300 tracking-wide"
      >
        ENTRAR
      </button>

      <button
        onClick={toggleHelpModal}
        className="absolute bottom-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
        aria-label="Ajuda"
      >
        <span className="text-sky-800 text-xl font-bold">?</span>
      </button>

      {showHelpModal && <WelcomeModal onClose={toggleHelpModal} />}
    </div>
  );
};

export default Home;
