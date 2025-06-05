import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/userService";
import { toast } from "react-toastify";
import axios from "axios";
import { setAuthToken } from "../services/authService";
import SuggestBeachModal from "../components/SuggestBeachModal";
import { Sugestao } from "../services/suggestionService";
import { LogOut, MapPin, Settings } from "lucide-react";

type TabType = {
  id: "fotos" | "flops";
  label: string;
};

const UserProfileFlops = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado inicial definido como 'flops'
  const [activeTab, setActiveTab] = useState<"fotos" | "flops">("flops");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUserId(userData.id);
        setForm({
          nome: userData.nome || "",
          email: userData.email || "",
        });

        // Set profile picture if available
        if (userData.fotoPerfil) {
          setProfilePicture(userData.fotoPerfil);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Erro ao carregar dados do usuário");
        // Redirect to login if unauthorized
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const [form, setForm] = useState({
    nome: "",
    email: "",
  });

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair?")) {
      setAuthToken(null);
      navigate("/auth");
    }
  };

  const tabs: TabType[] = [
    { id: "fotos", label: "Fotos" },
    { id: "flops", label: "Flops" },
  ];

  const handleTabClick = (tabId: "fotos" | "flops") => {
    setActiveTab(tabId);
    switch (tabId) {
      case "fotos":
        navigate("/perfilFotos");
        break;
      case "flops":
        navigate("/perfilFlops");
        break;
    }
  };

  const handleSugestaoSuccess = (sugestao: Sugestao) => {
    toast.success(`Sugestão "${sugestao.nomePraia}" enviada com sucesso! Nossa equipe irá analisar em breve.`);
    setIsModalOpen(false);
  };

  const handleSugestaoError = (error: string) => {
    toast.error(`Erro ao enviar sugestão: ${error}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-1 sm:px-2 py-2 sm:py-4">
      <img
        src="/assets/FlopBG.png"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
  
      <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-7xl p-4 sm:p-6 md:p-8 min-h-[85vh] max-h-[95vh] my-2 sm:my-4 flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Sidebar do perfil */}
          <div className="flex flex-col items-center w-full lg:w-1/3 mb-4 lg:mb-0 lg:pr-4 xl:pr-6">
            {/* Foto e informações do usuário */}
            <div className="flex flex-col items-center w-full mb-4">
              <div className="relative mb-3">
                <img
                  src={
                    profilePicture
                      ? `data:image/jpeg;base64,${profilePicture}`
                      : "assets/defaultProfile.svg"
                  }
                  alt="Perfil"
                  className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full"
                />
              </div>
  
              <div className="w-full text-center mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-blue-900 truncate">
                  Olá, {form.nome}!
                </h2>
                <p className="text-xs sm:text-sm text-blue-900 truncate">{form.email}</p>
              </div>
            </div>
  
            {/* Menu de navegação */}
            <div className="w-full border-t border-gray-200 pt-4 flex flex-col flex-1">
              <div className="flex flex-col w-full space-y-1 mb-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="py-2 sm:py-3 px-3 sm:px-4 text-left text-blue-900 hover:bg-gray-50 rounded-md flex items-center gap-x-3 transition-colors"
                >
                  <MapPin size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                  <span className="text-sm sm:text-base truncate">Sugerir nova praia</span>
                </button>
                <button
                  onClick={() => navigate("/editar")}
                  className="py-2 sm:py-3 px-3 sm:px-4 text-left text-blue-900 hover:bg-gray-50 rounded-md flex items-center gap-x-3 transition-colors"
                >
                  <Settings size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                  <span className="text-sm sm:text-base truncate">Gerenciar conta</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="py-2 sm:py-3 px-3 sm:px-4 text-left text-red-600 hover:bg-red-50 rounded-md flex items-center gap-x-3 transition-colors"
                >
                  <LogOut size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                  <span className="text-sm sm:text-base truncate">Sair</span>
                </button>
              </div>
  
              {/* Footer - apenas em telas maiores */}
              <div className="hidden sm:block w-full text-center text-xs text-gray-500 pt-4 border-t border-gray-200 mt-auto">
                <div className="flex flex-col space-y-1">
                  <span>Política de Privacidade</span>
                  <span>Termos de Serviço</span>
                </div>
              </div>
            </div>
          </div>
  
          {/* Área do histórico */}
          <div className="w-full lg:w-2/3 flex flex-col min-h-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4">
              Meu histórico
            </h2>
  
            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 py-2 flex justify-around shadow-sm sticky top-0 z-40 -mx-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="truncate max-w-20 sm:max-w-none">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="w-4 sm:w-5 h-0.5 bg-blue-600 mt-1 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
  
            {/* Área de conteúdo com scroll */}
            <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg flex-1 overflow-hidden mt-2">
              <div className="h-full overflow-y-auto">
                <div className="space-y-3 sm:space-y-4">
                  {/* Post example */}
                  <div className="bg-white rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src="assets/defaultProfile.svg"
                          alt="Vilmar"
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2 min-w-0">
                            <h3 className="font-bold text-gray-800 text-xs sm:text-sm truncate">
                              nickname
                            </h3>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              1m atrás
                            </span>
                          </div>
  
                          <button
                            className="text-blue-900 flex-shrink-0 p-1"
                            onClick={() => console.log("Denunciar post")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 sm:h-4 sm:w-4"
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
  
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                          O mar tá tranquilo hoje, sem muita onda, perfeito pra
                          relaxar...
                        </p>
                      </div>
                    </div>
                  </div>
  
                  {/* Exemplo de mais posts para testar scroll */}
                  <div className="bg-white rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src="assets/defaultProfile.svg"
                          alt="Usuario"
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2 min-w-0">
                            <h3 className="font-bold text-gray-800 text-xs sm:text-sm truncate">
                              outro_usuario
                            </h3>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              5m atrás
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                          Praia estava lotada hoje, mas valeu a pena pelo pôr do sol incrível!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Botão voltar */}
      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 bg-blue-900 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-lg z-20 hover:bg-blue-800 transition-colors"
      >
        Voltar
      </button>
  
      {/* Footer móvel */}
      <div className="sm:hidden fixed bottom-16 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-2 text-center text-xs text-gray-500 z-10">
        <span>Política de Privacidade</span> • <span>Termos de Serviço</span>
      </div>
  
      {isModalOpen && (
        <SuggestBeachModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSugestaoSuccess}
          onError={handleSugestaoError}
        />
      )}
    </div>
  );
};

export default UserProfileFlops;