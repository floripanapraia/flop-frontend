// src/pages/BeachDetails.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "../components/WelcomeModal";

const BeachDetails: React.FC = () => {
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeTab, setActiveTab] = useState("avaliacoes");
  
  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  return (
    <div className="relative h-screen w-screen bg-blue-100">
      {/* Mapa de fundo */}
      <img
        src="assets/mapa.png" 
        alt="Mapa Floripa na Praia"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Painel lateral de detalhes - agora com altura total */}
      <div className="absolute top-0 left-0 h-full bg-white rounded-r-3xl shadow-2xl w-[500px] max-w-full overflow-y-auto flex flex-col">
        {/* Imagem da praia */}
        <div className="relative">
          <img
            src="assets/joaca.png"
            alt="Praia da Joaquina"
            className="w-full h-48 object-cover"
          />
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto">
          {/* Título e avaliações */}
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Praia da Joaquina
              </h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 ml-1">1230 avaliações</span>
              </div>
            </div>
          </div>

          {/* Destaques do dia */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-700 font-semibold mb-3">
              HOJE NA JOAQUINA
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-700">🌊</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Ondas fortes
                  </p>
                  <p className="text-xs text-gray-500">230 votos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <span className="text-orange-500">👥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Lotada</p>
                  <p className="text-xs text-gray-500">230 votos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-pink-100 p-2 rounded-full">
                  <span className="text-pink-500">🍽️</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Alimentação</p>
                  <p className="text-xs text-gray-500">230 votos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-green-500">💨</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Vento</p>
                  <p className="text-xs text-gray-500">300 votos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-around border-t border-b border-gray-200 py-3 text-sm font-medium text-gray-600">
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'avaliacoes' ? 'bg-blue-50 text-blue-600' : 'hover:text-blue-600'}`}
              onClick={() => setActiveTab('avaliacoes')}
            >
              Avaliações
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'fotos' ? 'bg-blue-50 text-blue-600' : 'hover:text-blue-600'}`}
              onClick={() => setActiveTab('fotos')}
            >
              Feed Fotos
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'flops' ? 'bg-blue-50 text-blue-600' : 'hover:text-blue-600'}`}
              onClick={() => setActiveTab('flops')}
            >
              Flops
            </button>
          </div>

          {/* Conteúdo das tabs */}
          <div className="px-6 py-4">
            {activeTab === 'avaliacoes' && (
              <div>
                <div className="flex items-start space-x-3 mb-6">
                  <img
                    src="/usuario.jpg"
                    alt="Usuário"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">vicfernandes</p>
                    <p className="text-sm text-gray-600 mb-1">
                      A água tá maravilhosa, vários restaurantes abertos hoje...
                    </p>
                    <div className="flex items-center text-xs text-gray-400">
                      <span>2 horas atrás</span>
                      <span className="mx-2">•</span>
                      <span>5★</span>
                    </div>
                  </div>
                </div>
                {/* Mais avaliações podem ser adicionadas aqui */}
              </div>
            )}

            {activeTab === 'fotos' && (
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <img
                    key={item}
                    src={`/assets/beaches/joaquina${item}.jpg`}
                    alt={`Foto ${item}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {activeTab === 'flops' && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum flop reportado recentemente</p>
              </div>
            )}
          </div>
        </div>
      </div>

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

export default BeachDetails;