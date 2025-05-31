import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Beach from "../components/Beach";
import ReportModal from "../components/ReportModal";
import ProfileModal from "../components/ProfileModal";
import { Ellipsis } from "lucide-react";
import ThankYouModal from "../components/ThankYouDenunciaModal";
import { isAuthenticated } from "../services/authService";
import { getCurrentUser, Usuario } from "../services/userService";
import { BeachContext, BeachContextType } from "../contexts/beachContext";

type TabType = {
  id: "avaliacoes" | "fotos" | "flops";
  label: string;
};

const FlopFeed: React.FC = () => {
  const navigate = useNavigate();


  const beachContext = useContext(BeachContext) as BeachContextType;
  const { praiaId } = beachContext;
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [showThankYouDenunciaModal, setShowThankYouDenunciaModal] =
    useState(false);
  const [activeTab, setActiveTab] = useState<"avaliacoes" | "fotos" | "flops">(
    "flops"
  );

  // Verificar se o usuário está logado e buscar dados do usuário
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticated = isAuthenticated();
      setIsUserLoggedIn(authenticated);

      if (authenticated) {
        try {
          // Buscar dados do usuário logado
          const user = await getCurrentUser();
          setUserData(user);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);

          setIsUserLoggedIn(false);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    };

    checkAuthStatus();

    // Verificar periodicamente
    const interval = setInterval(checkAuthStatus, 5000); // verifica a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const handleReport = (reason: string) => {
    console.log("Denúncia enviada:", reason);
    // lógica de denuncia
    setShowReportModal(false);
    setShowThankYouDenunciaModal(true);
  };

  const tabs: TabType[] = [
    { id: "avaliacoes", label: "Avaliações" },
    { id: "fotos", label: "Fotos" },
    { id: "flops", label: "Flops" },
  ];

  const handleTabClick = (tabId: "avaliacoes" | "fotos" | "flops") => {
    if (!praiaId) {
      console.warn("Nenhuma praia selecionada");

      alert("Selecione uma praia primeiro");
      return;
    }

    setActiveTab(tabId);


    switch (tabId) {
      case "avaliacoes":
        navigate(`/avaliacoes/${praiaId}`);
        break;
      case "fotos":
        navigate(`/fotos/${praiaId}`);
        break;
      case "flops":
        navigate(`/flops/${praiaId}`);
        break;
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Beach />

      {/* Botão de perfil */}
      <div className="absolute top-4 right-6 z-50">
        {!isUserLoggedIn || !userData ? (
          <button
            onClick={() => navigate("/auth")}
            className="bg-[#182E4C] hover:bg-[#1a365d] text-white px-6 py-3 rounded-3xl text-sm font-medium transition-colors"
          >
            ENTRAR
          </button>
        ) : (
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-lg hover:border-[#182E4C] transition-all duration-200 hover:shadow-xl"
            title={`Perfil de ${userData.nome}`}
          >
            {userData.fotoPerfil ? (
              <img
                src={`data:image/jpeg;base64,${userData.fotoPerfil}`}
                alt={userData.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#182E4C] flex items-center justify-center text-white text-lg font-medium">
                {userData.nome.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        )}
      </div>

      {/* Modal de perfil - só renderiza se o usuário estiver logado */}
      {isUserLoggedIn && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

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
              className={`px-3 py-1 text-xs font-medium ${activeTab === tab.id
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
              {isUserLoggedIn && userData ? (
                // Mostrar foto do usuário logado ou inicial do nome
                userData.fotoPerfil ? (
                  <img
                    src={`data:image/jpeg;base64,${userData.fotoPerfil}`}
                    alt={userData.nome}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#182E4C] flex items-center justify-center text-white text-sm font-medium">
                    {userData.nome.charAt(0).toUpperCase()}
                  </div>
                )
              ) : (
                // Imagem padrão se não estiver logado
                <img
                  src="assets/defaultProfile.svg"
                  alt="Perfil"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
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
                    <span className="text-gray-400">•</span>
                    <span className="text-xs text-gray-500">2h atrás</span>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowReportModal(true)}
                  >
                    <Ellipsis className="h-4 w-4" />
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

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onReport={handleReport}
      />

      <ThankYouModal
        isOpen={showThankYouDenunciaModal}
        onClose={() => setShowThankYouDenunciaModal(false)}
      />
    </div>
  );
};

export default FlopFeed;
