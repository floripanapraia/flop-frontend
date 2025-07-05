import React, { useEffect, useState } from "react";
import { useLocation, } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import ProfileModal from "../components/ProfileModal";
import RequireAuthModal from "../components/RequireAuthModal";
import WelcomeModal from "../components/WelcomeModal";
import { useUser } from "../contexts/userContext"; // <-- usamos o UserContext
import { filterPraias, getAllPraias, PraiaDTO } from "../services/beachService";
import ProfileButton from "../components/ProfileButton";

const Home: React.FC = () => {
  const location = useLocation();

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBeaches, setFilteredBeaches] = useState<PraiaDTO[]>([]);
  const [selectedBeach, setSelectedBeach] = useState<PraiaDTO | null>(null);
  const [allBeaches, setAllBeaches] = useState<PraiaDTO[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showRequireAuthModal, setShowRequireAuthModal] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);


  const conditions = [
    { id: "SOL", name: "Ensolarado", icon: "/assets/iconFull/sol.svg" },
    { id: "VENTO", name: "Vento", icon: "/assets/iconFull/vento.svg" },
    { id: "LOTADA", name: "Lotada", icon: "/assets/iconFull/lotada.svg" },
    { id: "MAR_ONDAS", name: "Ondas fortes", icon: "/assets/iconFull/mar_ondas.svg" },
    { id: "AGUA_VIVA", name: "Água-viva", icon: "/assets/iconFull/agua_viva.svg" },
    { id: "NUBLADO", name: "Nublado", icon: "/assets/iconFull/nublado.svg" },
    { id: "CHUVA", name: "Chuva", icon: "/assets/iconFull/chuva.svg" },
    { id: "LIXO", name: "Lixo visível", icon: "/assets/iconFull/lixo.svg" },
    { id: "LIMPA", name: "Limpa", icon: "/assets/iconFull/limpa.svg" },
    { id: "MAR_CALMO", name: "Mar calmo", icon: "/assets/iconFull/mar_calmo.svg" },
    { id: "AGUA_GELADA", name: "Água gelada", icon: "/assets/iconFull/agua_gelada.svg" },
    { id: "MUSICA", name: "Música alta", icon: "/assets/iconFull/musica.svg" },
    { id: "ESTACIONAMENTO", name: "Estacionamento", icon: "/assets/iconFull/estacionamento.svg" },
    { id: "SALVA_VIDAS", name: "Salva-vidas", icon: "/assets/iconFull/salva_vidas.svg" },
    { id: "ALIMENTACAO", name: "Alimentação", icon: "/assets/iconFull/alimentacao.svg" },
  ];

  // Pegamos o user diretamente do contexto:
  const { user } = useUser();

  const handleRequireAuthModalClose = () => {
    setShowRequireAuthModal(false);
  };

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  const toggleCondition = (conditionId: string) => {
    setSelectedConditions(prev => {
      const updated = prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId];

      return updated;
    });
  };

  const conflictingGroups: string[][] = [
    ["SOL", "NUBLADO", "CHUVA"],
    ["MAR_CALMO", "MAR_ONDAS"],
    ["LIMPA", "LIXO"],
  ];

  const fetchBeaches = async () => {
    try {
      const payload = {
        nomePraia: searchQuery.length > 2 ? searchQuery : undefined,
        condicoes: selectedConditions.length > 0 ? selectedConditions : undefined,
      };

      const result = await filterPraias(payload);
      setFilteredBeaches(result); // ou result.content se usar paginação
    } catch (error) {
      console.error("Erro ao buscar praias:", error);
    }
  };

  useEffect(() => {
    getAllPraias().then(setAllBeaches).catch(console.error);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2 || selectedConditions.length > 0) {
      fetchBeaches();
    } else {
      setFilteredBeaches([]);
    }
  }, [searchQuery, selectedConditions]);



  const isConditionDisabled = (conditionId: string) => {
    const conflictGroup = conflictingGroups.find((group) =>
      group.includes(conditionId)
    );

    if (!conflictGroup) return false;

    return selectedConditions.some(
      (id) => id !== conditionId && conflictGroup.includes(id)
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
          className="w-full border px-4 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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

        {/* FILTRO DE CONDIÇÕES */}
        <div
          className="grid grid-cols-5 gap-3 mb-4 mt-2 justify-items-center transition-all duration-300"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {(isExpanded ? conditions : conditions.slice(0, 5)).map((cond) => {
            const isDisabled = isConditionDisabled(cond.id);
            const isSelected = selectedConditions.includes(cond.id);

            return (
              <button
                key={cond.id}
                onClick={() => toggleCondition(cond.id)}
                disabled={isDisabled}
                title={cond.name}
                className={`w-16 h-16 flex items-center justify-center rounded-xl transition-all duration-200
          ${isSelected
                    ? "bg-gray-200 ring-gray-300"
                    : isDisabled
                      ? "bg-gray-100 opacity-60 cursor-not-allowed"
                      : "bg-white hover:ring-gray-300"}
        `}
              >
                <img
                  src={cond.icon}
                  alt={cond.name}
                  className={`w-10 h-10 ${isDisabled ? "opacity-50" : ""}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <ProfileButton onProfileClick={() => setIsProfileModalOpen(true)} size={64} />
      </div>

      <button
        onClick={toggleHelpModal}
        className="absolute bottom-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
        aria-label="Ajuda"
      >
        <span className="text-sky-800 text-xl font-bold">?</span>
      </button>

      {showHelpModal && <WelcomeModal onClose={toggleHelpModal} />}
      {showRequireAuthModal && (
        <RequireAuthModal
          isOpen={showRequireAuthModal}
          onClose={handleRequireAuthModalClose}
        />
      )}

      {user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;