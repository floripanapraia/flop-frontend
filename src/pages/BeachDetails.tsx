import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EvaluationModal from "../components/EvaluationModal";

type TabType = {
  id: "avaliacoes" | "fotos" | "flops";
  label: string;
};

const BeachDetails: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mudar para true quando o usuário fizer login
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"avaliacoes" | "fotos" | "flops">(
    "flops"
  );

  const toggleEvaluationModal = () => {
    setShowEvaluationModal(!showEvaluationModal);
  };

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
        navigate("/outrarota");
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

      {/* Painel lateral */}
      <div className="absolute top-0 left-0 h-full bg-white/95 backdrop-blur-md shadow-xl w-[620px] max-w-full flex flex-col  ">
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
                  onClick={() => navigate(-1)}
                  className="p-2 text-white hover:text-blue-300 transition-colors"
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
            className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Avaliar
          </button>
        </div>
      </div>

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

        {/* Área de publicação */}
        <div className="bg-white p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <img
                src="assets/defaultProfile.svg"
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Como está a praia hoje?"
                className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-blue-400 resize-none text-sm"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed de posts */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
          {/* Post  */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <img
                  src="assets/defaultProfile.svg"
                  alt="tatiana_sakuma"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-gray-800 text-sm">
                      tatiana_sakuma
                    </h3>
                    {/* Bolinha separadora e tempo */}
                    <span className="text-gray-400">•</span>
                    <span className="text-xs text-gray-500">2h atrás</span>
                  </div>

                  {/* Ícone de denúncia (no canto direito) */}
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => console.log("Denunciar post")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-700 mt-1 text-sm">
                  O mar tá tranquilo hoje, sem muita onda, perfeito pra
                  relaxar... O mar tá tranquilo hoje, sem muita onda, perfeito
                  pra relaxar... O mar tá tranquilo hoje, sem muita onda,
                  perfeito pra relaxar... O mar tá tranquilo hoje, sem muita
                  onda, perfeito pra relaxar... O mar tá tranquilo hoje, sem
                  muita onda, perfeito pra relaxar...
                </p>
              </div>
            </div>
          </div>
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

export default BeachDetails;
