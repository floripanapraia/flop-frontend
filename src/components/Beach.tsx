import { Star, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useUser } from "../contexts/userContext";
import { useBeach } from "../hooks/useBeach";
import { usePraiaDataSync } from "../hooks/useBeachDataSync";
import { AvaliacaoDTO, getAvaliacaoUsuarioHojeNaPraia, verificarAvaliacaoExistente, Condicoes } from "../services/evaluationService";
import EvaluationModal from "./EvaluationModal";
import RequireAuthModal from "./RequireAuthModal";
import ThankYouAvaliacaoModal from "./ThankYouAvaliacaoModal";

interface BeachProps {
  onNewAvaliacao?: () => void;
}

const Beach: React.FC<BeachProps> = ({ onNewAvaliacao }) => {
  const navigate = useNavigate();
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showRequireAuthModal, setShowRequireAuthModal] = useState(false);
  const [initialEvaluation, setInitialEvaluation] = useState<AvaliacaoDTO | null>(null);

  const { praiaNome, praiaFotoUrl, totalAvaliacoesDoDia, praiaId } = useBeach();
  const { condicoesAvaliacoes, loading, refetch } = usePraiaDataSync({
    incluirCondicoes: true,
    incluirMensagens: false,
    incluirImagens: false,
  });

  const conditions = [
    { id: Condicoes.SOL, name: "Sol", icon: "/assets/iconFull/sol.svg" },
    { id: Condicoes.MAR_ONDAS, name: "Ondas fortes", icon: "/assets/iconFull/mar_ondas.svg" },
    { id: Condicoes.LOTADA, name: "Lotada", icon: "/assets/iconFull/lotada.svg" },
    { id: Condicoes.NUBLADO, name: "Nublado", icon: "/assets/iconFull/nublado.svg" },
    { id: Condicoes.AGUA_VIVA, name: "Água-viva", icon: "/assets/iconFull/agua_viva.svg" },
    { id: Condicoes.LIXO, name: "Lixo", icon: "/assets/iconFull/lixo.svg" },
    { id: Condicoes.CHUVA, name: "Chuva", icon: "/assets/iconFull/chuva.svg" },
    { id: Condicoes.MAR_CALMO, name: "Mar calmo", icon: "/assets/iconFull/mar_calmo.svg" },
    { id: Condicoes.LIMPA, name: "Limpa", icon: "/assets/iconFull/limpa.svg" },
    { id: Condicoes.VENTO, name: "Vento", icon: "/assets/iconFull/vento.svg" },
    { id: Condicoes.AGUA_GELADA, name: "Água gelada", icon: "/assets/iconFull/agua_gelada.svg" },
    { id: Condicoes.MUSICA, name: "Música alta", icon: "/assets/iconFull/musica.svg" },
    { id: Condicoes.ESTACIONAMENTO, name: "Estacionamento", icon: "/assets/iconFull/estacionamento.svg" },
    { id: Condicoes.SALVA_VIDAS, name: "Salva-vidas", icon: "/assets/iconFull/salva_vidas.svg" },
    { id: Condicoes.ALIMENTACAO, name: "Alimentação", icon: "/assets/iconFull/alimentacao.svg" },

  ];

  const { user, } = useUser();

  const handleAvaliarClick = async () => {
    if (!user || !user.id) {
      setShowRequireAuthModal(true);
      return;
    }

    if (!praiaId) {
      console.error("ID da praia não definido");
      return;
    }

    try {
      const existeAvaliacao = await verificarAvaliacaoExistente(user.id, praiaId);

      if (existeAvaliacao) {
        // Se já existir uma avaliação, configura para editar
        setInitialEvaluation(await getAvaliacaoUsuarioHojeNaPraia(user.id, praiaId));
      } else {
        // Se não houver avaliação, configura para criar uma nova
        setInitialEvaluation(null);
      }
    } catch (err: any) {
      console.error("Erro ao verificar avaliação:", err);
      setInitialEvaluation(null);
    }

    setShowEvaluationModal(true);
  };

  const handleEvaluationModalClose = () => {
    setShowEvaluationModal(false);
  };

  const handleRequireAuthModalClose = () => {
    setShowRequireAuthModal(false);
  };

  const handleEvaluationSubmit = (selectedConditions: string[]) => {
    setShowEvaluationModal(false);
    setShowThankYouModal(true);
    if (onNewAvaliacao) {
      onNewAvaliacao();
    }
    refetch();
  };

  const handleThankYouClose = () => {
    setShowThankYouModal(false);
  };

  return (
    <div>
      <div className="relative lg:absolute top-0 left-0 h-full bg-white/95 backdrop-blur-md shadow-xl w-full lg:w-[620px] max-w-full flex flex-col rounded-none lg:rounded-r-3xl overflow-hidden">

        <div
          className="px-6 pt-8 pb-24 border relative"
          style={{
            backgroundImage: praiaFotoUrl
              ? `url(${praiaFotoUrl})`
              : "url('assets/FlopBG.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex items-center justify-between mb-4 flex-row sm:flex-row-reverse">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/home")}
                className="p-2 text-white hover:text-blue-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center space-x-3"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  {praiaNome || "Praia"}
                </h1>
                <div className="flex items-center text-blue-600">
                  <Star className="h-5 w-5" fill="currentColor" />
                  <span className="ml-1 text-sm font-medium">
                    {totalAvaliacoesDoDia
                      ? `${totalAvaliacoesDoDia} avaliações`
                      : "Oba! Seja o primeiro a avaliar!"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center uppercase">
              <span className="w-1 h-5 bg-blue-500 rounded-full mr-2"></span>
              HOJE NA {praiaNome || "PRAIA"}
            </h3>

            {!loading && condicoesAvaliacoes.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {condicoesAvaliacoes.slice(0, 8).map(([condicao, votos]) => {
                  const matched = conditions.find((c) => c.id === condicao);
                  if (!matched) return null;

                  return (
                    <div key={condicao} className="flex flex-col items-center text-center group">
                      <div className="p-3 rounded-xl mb-2 bg-white group-hover:bg-gray-100 transition-colors">
                        <img
                          src={matched.icon}
                          alt={matched.name}
                          className="w-14 h-14"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).style.display = "none")
                          }
                        />
                      </div>
                      <p className="text-xs font-medium text-blue-900">{matched.name}</p>
                      <p className="text-xs text-gray-400">{votos} votos</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 mb-8 flex justify-center">
          <button
            onClick={handleAvaliarClick}
            className="px-5 py-2 bg-blue-900 text-white rounded-md font-medium hover:bg-[#1e3a5f] transition-colors shadow-md"
          >
            Avaliar
          </button>
        </div>
      </div>

      {showEvaluationModal && user && (
        <EvaluationModal
          onClose={handleEvaluationModalClose}
          beachName={praiaNome || ""}
          initialEvaluation={initialEvaluation}
          onSubmit={handleEvaluationSubmit}
        />
      )}

      {showRequireAuthModal && (
        <RequireAuthModal isOpen={showRequireAuthModal} onClose={handleRequireAuthModalClose} />
      )}

      <ThankYouAvaliacaoModal
        isOpen={showThankYouModal}
        onClose={handleThankYouClose}
      />
    </div>
  );
};

export default Beach;