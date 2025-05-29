import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EvaluationModal from "./EvaluationModal";
import ThankYouAvaliacaoModal from "./ThankYouAvaliacaoModal";
import { Star, X } from "lucide-react";
import { useBeach } from "../hooks/useBeach";
import { usePraiaDataSync } from "../hooks/useBeachDataSync";
import { getCurrentUser, Usuario } from "../services/userService";

const Beach: React.FC = () => {
  const navigate = useNavigate();
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUsuario(user);
      }
    };
    fetchUser();
  }, []);

  const { praiaNome, praiaFotoUrl, totalAvaliacoesDoDia } = useBeach();
  const { condicoesAvaliacoes, loading, refetch } = usePraiaDataSync({
    incluirCondicoes: true,
    incluirMensagens: false,
    incluirImagens: false,
  });

  const toggleEvaluationModal = () => {
    setShowEvaluationModal(!showEvaluationModal);
  };

  const handleEvaluationSubmit = (selectedConditions: string[]) => {
    setShowEvaluationModal(false);
    setShowThankYouModal(true);
    refetch();
  };

  const handleThankYouClose = () => {
    setShowThankYouModal(false);
  };

  return (
    <div>
      <div className="absolute top-0 left-0 h-full bg-white/95 backdrop-blur-md shadow-xl w-[620px] max-w-full flex flex-col rounded-r-3xl overflow-hidden">
        <div
          className="px-6 pt-8 pb-8 border relative"
          style={{
            backgroundImage: praiaFotoUrl
              ? `url(${praiaFotoUrl})`
              : "url('assets/FlopBG.png')",
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
                  onClick={() => navigate("/home")}
                  className="p-2 text-white hover:text-blue-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
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
                  const icon = `/assets/iconFull/${condicao.toLowerCase()}.svg`;
                  const label = condicao
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase());

                  return (
                    <div
                      key={condicao}
                      className="flex flex-col items-center group"
                    >
                      <div className="p-3 rounded-xl mb-2 bg-white group-hover:bg-gray-100 transition-colors">
                        <img
                          src={icon}
                          alt={label}
                          className="w-14 h-14"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                              "none")
                          }
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-700 text-center">
                        {label}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {votos} votos
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 mb-8 flex justify-center">
          <button
            onClick={toggleEvaluationModal}
            className="px-5 py-2 bg-blue-900 text-white rounded-md font-medium hover:bg-[#1e3a5f] transition-colors shadow-md"
          >
            Avaliar
          </button>
        </div>
      </div>

      {showEvaluationModal && usuario && (
        <EvaluationModal
          onClose={toggleEvaluationModal}
          beachName={praiaNome || ""}
          userName={usuario.nome}
          userNickname={usuario.nickname}
          fotoPerfil={usuario.fotoPerfil}
          idUsuario={usuario.id}
          onSubmit={handleEvaluationSubmit}
        />
      )}

      <ThankYouAvaliacaoModal
        isOpen={showThankYouModal}
        onClose={handleThankYouClose}
      />
    </div>
  );
};

export default Beach;
