import React, { useState } from "react";

interface EvaluationModalProps {
  //foto?
  beachName: string;
  userName: string;
  userNickname: string;
  onClose: () => void;
  onSubmit: (selectedConditions: string[]) => void;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({
  beachName,
  userName,
  userNickname,
  onClose,
  onSubmit,
}) => {
  const conditions = [
    { id: "sunny", name: "Ensolarado", icon: "/assets/iconFull/SOL.svg" },
    { id: "waves", name: "Ondas fortes", icon: "/assets/iconFull/onda.svg" },
    { id: "crowded", name: "Lotada", icon: "/assets/iconFull/lotada.svg" },
    { id: "cloudy", name: "Nublado", icon: "/assets/iconFull/nublado.svg" },
    { id: "jelly", name: "Água-viva", icon: "/assets/iconFull/aguaviva.svg" },

    { id: "trash", name: "Lixo visível", icon: "/assets/iconFull/lixo.svg" },
    { id: "rainy", name: "Chuva", icon: "/assets/iconFull/chuva.svg" },
    { id: "calm", name: "Mar calmo", icon: "/assets/iconFull/marcalmo.svg" },
    { id: "clean", name: "Limpa", icon: "/assets/iconFull/limpa.svg" },
    { id: "windy", name: "Vento", icon: "/assets/iconFull/vento.svg" },
    {
      id: "cold",
      name: "Água gelada",
      icon: "/assets/iconFull/aguagelada.svg",
    },
    { id: "music", name: "Música alta", icon: "/assets/iconFull/musica.svg" },
    {
      id: "parking",
      name: "Estacionamento",
      icon: "/assets/iconFull/estacionamento.svg",
    },

    {
      id: "lifeguard",
      name: "Salva-vidas",
      icon: "/assets/iconFull/salvavidas.svg",
    },

    {
      id: "food",
      name: "Alimentação",
      icon: "/assets/iconFull/alimentacao.svg",
    },
  ];

  const conflictingGroups = [
    ["sunny", "rainy"],
    ["sunny", "cloudy"],
    ["waves", "calm"],
    ["clean", "trash"],
  ];

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (conditionId: string) => {
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

  const isConditionDisabled = (conditionId: string) => {
    const conflictGroup = conflictingGroups.find((group) =>
      group.includes(conditionId)
    );

    if (!conflictGroup) return false;

    // Verifica se já há alguma condição do mesmo grupo selecionada
    return selectedConditions.some(
      (id) => id !== conditionId && conflictGroup.includes(id)
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedConditions);
    onClose();
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

        {/* Header */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {beachName}Praia da Joaquina
          </h2>
          <div className="flex items-center mt-2 mb-6">
            {/* Avatar do usuário */}
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
              <img
                src="assets/defaultProfile.svg"
                alt={`Foto de ${userName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col mt-2 mb- space-y-1">
              <span className="font-medium text-blue-900">
                {userName}Victoria Fernandes
              </span>
              <span className="text-blue-900 ">
                @{userNickname}vicfernandes
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
