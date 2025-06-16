import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/userContext";
import { useBeach } from "../hooks/useBeach";
import { Condicoes, createAvaliacao, updateAvaliacao, AvaliacaoDTO } from "../services/evaluationService";
import { useGeoContext } from "../contexts/geolocationContext";
import { toast } from "react-toastify";


interface EvaluationModalProps {
  beachName: string;
  onClose: () => void;
  onSubmit: (selectedConditions: Condicoes[]) => void;
  initialEvaluation?: AvaliacaoDTO | null;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({
  beachName,
  onClose,
  onSubmit,
  initialEvaluation = null,
}) => {
  const conditions = [
    { id: "SOL", name: "Ensolarado", icon: "/assets/iconFull/SOL.svg" },
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

  const conflictingGroups: Condicoes[][] = [
    [Condicoes.SOL, Condicoes.NUBLADO, Condicoes.CHUVA],
    [Condicoes.MAR_CALMO, Condicoes.MAR_ONDAS],
    [Condicoes.LIMPA, Condicoes.LIXO],
  ];

  const { praiaId } = useBeach();
  const { user } = useUser();
  const { coords, isGeolocationEnabled } = useGeoContext();

  const [selectedConditions, setSelectedConditions] = useState<Condicoes[]>([]);
  const [existingEvaluationId, setExistingEvaluationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(!initialEvaluation);
  const [isEditing, setIsEditing] = useState<boolean>(!!initialEvaluation);

  const userLat = coords?.latitudeUser!;
  const userLng = coords?.longitudeUser!;

  useEffect(() => {
    if (initialEvaluation) {
      setSelectedConditions(initialEvaluation.condicoes);
      setExistingEvaluationId(initialEvaluation.idAvaliacao!);
      setIsEditing(true);
      setIsLoading(false);
    } else {
      // Se não houver avaliação, prepara para uma nova
      setSelectedConditions([]);
      setExistingEvaluationId(null);
      setIsEditing(false);
      setIsLoading(false);
    }
  }, [initialEvaluation]);

  useEffect(() => {
    if (!isLoading && (!coords || !isGeolocationEnabled)) {
      toast.warn("A localização está desativada. Ative-a nas configurações do navegador e atualize a página para poder avaliar esta praia.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  }, [coords, isGeolocationEnabled, isLoading]);


  const toggleCondition = (conditionId: Condicoes) => {
    setSelectedConditions((prev) => {
      if (prev.includes(conditionId)) {
        return prev.filter((id) => id !== conditionId);
      }

      const conflictGroup = conflictingGroups.find((group) =>
        group.includes(conditionId)
      );

      const filtered = conflictGroup
        ? prev.filter((id) => !conflictGroup.includes(id))
        : prev;

      return [...filtered, conditionId];
    });
  };

  const isConditionDisabled = (conditionId: Condicoes) => {
    const conflictGroup = conflictingGroups.find((group) =>
      group.includes(conditionId)
    );

    if (!conflictGroup) return false;

    return selectedConditions.some(
      (id) => id !== conditionId && conflictGroup.includes(id)
    );
  };

  const handleSubmit = async () => {
    if (!isGeolocationEnabled || !coords?.latitudeUser || !coords?.longitudeUser) {
      toast.warn("A localização está desativada. Ative-a nas configurações do navegador e atualize a página para poder avaliar esta praia.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    if (!praiaId || !user) {
      console.error("Praia ou usuário não definidos");
      return;
    }

    const payload = {
      idPraia: praiaId,
      idUsuario: user.id,
      condicoes: selectedConditions,
      latitudeUser: userLat,
      longitudeUser: userLng,
    };

    try {
      if (isEditing && existingEvaluationId) {
        await updateAvaliacao(existingEvaluationId, payload);
      } else {
        await createAvaliacao(payload);
      }
      onSubmit(selectedConditions);
      onClose();
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Erro ao enviar avaliação. Tente novamente.";
      toast.warn(msg, {
        position: "top-center",
        autoClose: 6000,
      });
    }
  };

  if (!user || isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-xl p-6 text-center">
          <p className="text-blue-900 mb-4">
            {!user ? "Carregando dados do usuário..." : "Carregando avaliação..."}
          </p>
          <button onClick={onClose} className="px-4 py-2 bg-blue-900 text-white rounded-full">
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Fechar modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {beachName}
          </h2>

          {isEditing && (
            <div className="text-center mt-2">
              <span className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full">
                Editando sua avaliação de hoje
              </span>
            </div>
          )}

          <div className="flex items-center mt-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
              {user.fotoPerfil ? (
                <img
                  src={`data:image/jpeg;base64,${user.fotoPerfil}`}
                  alt={`Foto de ${user.nome}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100">
                  <span className="text-blue-900 text-xl font-semibold">
                    {user.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-medium text-blue-900">{user.nome}</span>
              <span className="text-blue-900">@{user.nickname}</span>
            </div>
          </div>

          <p className="text-sm text-gray-900 mb-6">
            {isEditing
              ? "Modifique as condições da praia conforme necessário:"
              : "Marque as opções abaixo que melhor descrevem as condições da praia hoje!"
            }
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {conditions.map((condition) => (
              <button
                key={condition.id}
                type="button"
                onClick={() => toggleCondition(condition.id as Condicoes)}
                disabled={isConditionDisabled(condition.id as Condicoes)}
                className={`flex items-center p-2 rounded-3xl transition-colors h-full ${selectedConditions.includes(condition.id as Condicoes)
                  ? "bg-gray-200 border-gray-200 text-black-700 rounded-5xl"
                  : isConditionDisabled(condition.id as Condicoes)
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border-gray-200 hover:bg-gray-100"
                  }`}
              >
                <img
                  src={condition.icon}
                  alt={condition.name}
                  className={`w-12 h-12 mr-2 ${isConditionDisabled(condition.id as Condicoes) ? "opacity-50" : ""
                    }`}
                />
                <span className="text-sm font-medium text-center text-blue-900">
                  {condition.name}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedConditions.length === 0}
              className={`px-6 py-3 rounded-full transition-colors ${selectedConditions.length === 0
                ? "bg-gray-300 border-blue-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-900 border-blue-700 text-white"
                }`}
            >
              {isEditing ? "Atualizar " : "Postar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;