import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type TabType = {
  id: "avaliacoes" | "fotos" | "flops";
  label: string;
};

const EvaluationFeed: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mudar para true quando o usuário fizer login

  // Estado inicial definido como 'avaliacoes'
  const [activeTab, setActiveTab] = useState<"avaliacoes" | "fotos" | "flops">(
    "avaliacoes"
  );

  const tabs: TabType[] = [
    { id: "avaliacoes", label: "Avaliações" },
    { id: "fotos", label: "Fotos" },
    { id: "flops", label: "Flops" },
  ];

  const handleTabClick = (tabId: "avaliacoes" | "fotos" | "flops") => {
    setActiveTab(tabId);
    switch (tabId) {
      case "avaliacoes":
        navigate("/avaliacoes");
        break;
      case "fotos":
        navigate("/feedfotos");
        break;
      case "flops":
        navigate("/praia");
        break;
    }
  };

  return (
    <div className="relative h-screen w-screen bg-blue-50 overflow-hidden">
      {/* Botão de perfil */}
      <div className="absolute top-4 right-6 z-50">
        <button
          onClick={() => navigate(isLoggedIn ? "/perfil" : "/auth")}
          className="bg-[#182E4D] text-white px-6 py-3 rounded-3xl text-sm font-medium hover:bg-[#1e3a5f] transition-colors"
        >
          {isLoggedIn ? "Perfil" : "ENTRAR"}
        </button>
      </div>

      {/* Painel lateral Praia vai aqui dentro */}
      <div></div>

      {/* Área do feed */}
      <div className="ml-[620px] h-full flex flex-col">
        <div className="bg-white px-6 pt-5 pb-2 border-b">
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
        </div>

        {/* Barra de navegação */}
        <div className="bg-white border-b border-gray-200 py-2 flex justify-around shadow-sm sticky top-0 z-40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-3 py-1 text-xs font-medium ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex flex-col items-center">
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-5 h-0.5 bg-blue-600 mt-1 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Feed de posts */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
          {/* Post */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <img
                  src="assets/defaultProfile.svg"
                  alt="JoaoSilva"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-gray-800 text-sm">
                      JoaoSilva
                    </h3>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs text-gray-500">2h atrás</span>
                  </div>
                </div>

                {/* Área dos ícones de condições */}
                <div className="flex items-center mt-3 space-x-4">
                  {/* Ícone 1 - Sol */}
                  <div className="flex flex-col items-center">
                    <img
                      src="/assets/iconFull/sol.svg"
                      alt="Sol"
                      className="w-12 h-12"
                    />
                    <span className="text-xs text-gray-600 mt-1">Sol</span>
                  </div>

                  {/* Ícone 2 - Mar Calmo */}
                  <div className="flex flex-col items-center">
                    <img
                      src="/assets/iconFull/marcalmo.svg"
                      alt="Mar Calmo"
                      className="w-12 h-12"
                    />
                    <span className="text-xs text-gray-600 mt-1">
                      Mar Calmo
                    </span>
                  </div>

                  {/* Ícone 3 - Água-Viva */}
                  <div className="flex flex-col items-center">
                    <img
                      src="/assets/iconFull/aguaviva.svg"
                      alt="Água-Viva"
                      className="w-12 h-12"
                    />
                    <span className="text-xs text-gray-600 mt-1">
                      Água-Viva
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationFeed;
