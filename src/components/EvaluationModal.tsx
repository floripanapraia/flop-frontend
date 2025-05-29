import { X } from "lucide-react";
import React, { useState } from "react";
import { createAvaliacao, Condicoes } from "../services/evaluationService";
import { useBeach } from "../hooks/useBeach"; // para pegar o praiaId


interface EvaluationModalProps {
  beachName: string;
  userName: string;
  userNickname: string;
  idUsuario: number; 
  fotoPerfil: string;
  onClose: () => void;
  onSubmit: (selectedConditions: Condicoes[]) => void;
}
const EvaluationModal: React.FC<EvaluationModalProps> = ({
  beachName,
  userName,
  userNickname,
  idUsuario,
  fotoPerfil,
  onClose,
  onSubmit,
}) => {
    
  const conditions = [
    { id: Condicoes.SOL, name: "Ensolarado", icon: "/assets/iconFull/SOL.svg" },
    { id: Condicoes.MAR_ONDAS, name: "Ondas fortes", icon: "/assets/iconFull/ondas_Fortes.svg" },
    { id: Condicoes.LOTADA, name: "Lotada", icon: "/assets/iconFull/lotada.svg" },
    { id: Condicoes.NUBLADO, name: "Nublado", icon: "/assets/iconFull/nublado.svg" },
    { id: Condicoes.AGUA_VIVA, name: "Água-viva", icon: "/assets/iconFull/agua_viva.svg" },
    { id: Condicoes.LIXO, name: "Lixo visível", icon: "/assets/iconFull/lixo.svg" },
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

 const conflictingGroups: Condicoes[][] = [
  [Condicoes.SOL, Condicoes.NUBLADO, Condicoes.CHUVA],
  [Condicoes.MAR_CALMO, Condicoes.MAR_ONDAS],
  [Condicoes.LIMPA, Condicoes.LIXO],
];

  const { praiaId } = useBeach();

  const [selectedConditions, setSelectedConditions] = useState<Condicoes[]>([]);

  const toggleCondition = (conditionId: Condicoes) => {
    setSelectedConditions((prev) => {
      // Se já está selecionado, remove
      if (prev.includes(conditionId)) {
        return prev.filter((id) => id !== conditionId);
      }

      // Encontra o grupo de conflito (se existir)
      const conflictGroup = conflictingGroups.find((group) =>
        group.includes(conditionId)
      );

      // Filtra condições do mesmo grupo
      const filtered = conflictGroup
        ? prev.filter((id) => !conflictGroup.includes(id))
        : prev;

      // Adiciona a nova condição
      return [...filtered, conditionId];
    });
  };

  const isConditionDisabled = (conditionId: Condicoes) => {
    const conflictGroup = conflictingGroups.find((group) =>
      group.includes(conditionId)
    );

    if (!conflictGroup) return false;

    // Verifica se já há alguma condição do mesmo grupo selecionada
    return selectedConditions.some(
      (id) => id !== conditionId && conflictGroup.includes(id)
    );
  };

const handleSubmit = async () => {
console.log("Payload para avaliação:", {
  idPraia: praiaId,
  idUsuario,
  nickname: userNickname,
  condicoes: selectedConditions,
});

  if (!praiaId) {
    console.error("Praia não definida para avaliação");
    return;
  }

  try {
    await createAvaliacao({
      idPraia: praiaId,
      condicoes: selectedConditions,
      idUsuario: idUsuario,       // passado como prop no componente
      nickname: userNickname,     // já vindo da prop
    });

    onSubmit(selectedConditions); // dispara ação do pai (ex: mostrar agradecimento)
  } catch (error) {
    console.error("Erro ao enviar avaliação:", error);
  }
};


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Fechar modal"
        >
          <X className="h-6 w-6" />
        </button>
        {/* Header */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {beachName}
          </h2>
          <div className="flex items-center mt-2 mb-6">
            {/* Avatar do usuário */}
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
              <img
                src={`data:image/jpeg;base64,${fotoPerfil}`}
                
                alt={`Foto de ${userName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col mt-2 mb- space-y-1">
              <span className="font-medium text-blue-900">
                {userName}
              </span>
              <span className="text-blue-900 ">
                @{userNickname}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-900 mb-6">
            Marque as opções abaixo que melhor descrevem as condições da praia
            hoje!
          </p>

          {/* Grid de 5 colunas */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {conditions.map((condition) => (
              <button
                key={condition.id}
                type="button"
                onClick={() => toggleCondition(condition.id)}
                disabled={isConditionDisabled(condition.id)}
                className={`flex items-center p-2 rounded-3xl transition-colors h-full ${
                  selectedConditions.includes(condition.id)
                    ? "bg-gray-200 border-gray-200 text-black-700 rounded-5xl"
                    : isConditionDisabled(condition.id)
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border-gray-200 hover:bg-gray-100 "
                }`}
              >
                <img
                  src={condition.icon}
                  alt={condition.name}
                  className={`w-12 h-12 mr-2 ${
                    isConditionDisabled(condition.id) ? "opacity-50" : ""
                  }`}
                />
                <span className="text-sm font-medium text-center text-blue-900">
                  {condition.name}
                </span>
              </button>
            ))}
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedConditions.length === 0}
              className={`px-6 py-3 rounded-full transition-colors ${
                selectedConditions.length === 0
                  ? "bg-gray-300 border-blue-700 text-gray-500 cursor-not-allowed"
                  : "bg-blue-900  border-blue-700 text-white "
              }`}
            >
              Postar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
