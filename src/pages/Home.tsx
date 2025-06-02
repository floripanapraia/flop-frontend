import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import ProfileModal from "../components/ProfileModal";
import WelcomeModal from "../components/WelcomeModal";
import { filterPraias, getAllPraias, PraiaDTO } from "../services/beachService";
import { useUser } from "../contexts/userContext"; // <-- usamos o UserContext

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAIActive, setIsAIActive] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBeaches, setFilteredBeaches] = useState<PraiaDTO[]>([]);
  const [selectedBeach, setSelectedBeach] = useState<PraiaDTO | null>(null);
  const [allBeaches, setAllBeaches] = useState<PraiaDTO[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Pegamos o user diretamente do contexto:
  const { user } = useUser();

  const handleSliderChange = () => {
    setIsAIActive(!isAIActive);
  };

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  useEffect(() => {
    getAllPraias()
      .then(setAllBeaches)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      filterPraias({ nomePraia: searchQuery })
        .then(setFilteredBeaches)
        .catch(console.error);
    } else {
      setFilteredBeaches([]);
    }
  }, [searchQuery]);

  const handleMainButtonClick = () => {
    // Se o usuário está autenticado (ou seja, existe um objeto `user` no contexto),
    // abra o modal de perfil; senão, redirecione para /auth
    if (user) {
      setIsProfileModalOpen(true);
    } else {
      navigate("/auth");
    }
  };

  const ProfileButton = () => {
    // Se não há user (ou seja, user === null), mostramos botão "ENTRAR"
    if (!user) {
      return (
        <button
          onClick={handleMainButtonClick}
          className="bg-[#182E4C] hover:bg-[#1a365d] text-white px-6 py-3 rounded-3xl text-sm font-medium transition-colors"
        >
          ENTRAR
        </button>
      );
    }

    // Se há user, mostramos a foto de perfil ou a inicial
    return (
      <button
        onClick={handleMainButtonClick}
        className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg hover:border-[#182E4C] transition-all duration-200 hover:shadow-xl"
        title={`Perfil de ${user.nome}`}
      >
        {user.fotoPerfil ? (
          <img
            src={`data:image/jpeg;base64,${user.fotoPerfil}`}
            alt={user.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#182E4C] flex items-center justify-center text-white text-lg font-medium">
            {user.nome.charAt(0).toUpperCase()}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="relative h-screen w-screen">
      <MapComponent
        key={location.key}
        activeBeachFromSearch={selectedBeach}
        praias={allBeaches}
      />

      <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-4 max-w-[350px] w-full">
        <div className="flex items-center space-x-2 mb-4">
          <img src="/assets/LOGO.png" alt="Logo" className="w-10 h-10" />
          <h2 className="text-[#182E4D] text-lg font-semibold">
            Floripa na praia
          </h2>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar praia..."
          className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />

        <div className="flex flex-col gap-2 pb-4 max-h-80 overflow-y-auto">
          {filteredBeaches.map((beach) => (
            <button
              key={beach.idPraia}
              onClick={() => setSelectedBeach(beach)}
              className="text-left bg-gray-200 text-blue-900 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              {beach.nomePraia}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Procurando a praia ideal em Floripa?
            <br />
            Nossa IA pode te ajudar a encontrar o destino perfeito para o seu dia!
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

        <div
          className={`flex items-center justify-center p-2 rounded-md transition-all duration-300 ${
            isAIActive
              ? "bg-indigo-50 border border-indigo-100 animate-pulse"
              : "bg-transparent"
          }`}
        >
          <p className={`text-xs ${isAIActive ? "text-indigo-600" : "text-transparent"}`}>
            {isAIActive
              ? "Modo IA ativo: Buscas inteligentes habilitadas"
              : "."}
          </p>
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <ProfileButton />
      </div>

      {user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

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
