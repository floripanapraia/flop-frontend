import { X, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { createSugestao, Sugestao } from "../services/suggestionService";

// Lista dos bairros de Florianópolis
const BAIRROS_FLORIANOPOLIS = [
  "Armação",
  "Barra da Lagoa",
  "Barreiros",
  "Bom Abrigo",
  "Cachoeira do Bom Jesus",
  "Campeche",
  "Canasvieiras",
  "Capoeiras",
  "Centro",
  "Córrego Grande",
  "Costeira do Pirajubaé",
  "Daniela",
  "Ingleses",
  "Itacorubi",
  "Jardim Atlântico",
  "Joao Paulo",
  "José Mendes",
  "Jurerê",
  "Jurerê Internacional",
  "Lagoa da Conceição",
  "Pantanal",
  "Pântano do Sul",
  "Ribeirão da Ilha",
  "Rio Tavares",
  "Sambaqui",
  "Santo Antônio de Lisboa",
  "São João do Rio Vermelho",
  "Tapera",
].sort();

interface SuggestBeachModalProps {
  onClose: () => void;
  onSuccess?: (sugestao: Sugestao) => void;
  onError?: (error: string) => void;
}

const SuggestBeachModal: React.FC<SuggestBeachModalProps> = ({
  onClose,
  onSuccess,
  onError,
}) => {
  const [beachName, setBeachName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const sugestaoData: Omit<
        Sugestao,
        "idSugestao" | "analisada" | "criadaEm"
      > = {
        nomePraia: beachName.trim(),
        bairro: neighborhood.trim(),
        descricao: locationDetails.trim(),
      };

      const novaSugestao = await createSugestao(sugestaoData);

      // Resetar formulário
      setBeachName("");
      setNeighborhood("");
      setLocationDetails("");

      // Callbacks de sucesso
      onSuccess?.(novaSugestao);
      onClose();
    } catch (error) {
      console.error("Erro ao criar sugestão:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao enviar sugestão";
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNeighborhoodSelect = (bairro: string) => {
    setNeighborhood(bairro);
    setIsDropdownOpen(false);
  };

  const isFormValid =
    beachName.trim() !== "" &&
    neighborhood.trim() !== "" &&
    locationDetails.trim() !== "";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-xl w-full relative max-h-[90vh] md:max-h-none md:flex md:flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700 focus:outline-none p-1 z-10 disabled:opacity-50"
          aria-label="Fechar modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Layout normal em telas maiores, com scroll apenas em mobile */}
        <div className="md:p-6 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
          {/* Header */}
          <div className="p-4 md:p-0 md:mb-6 border-b md:border-b border-gray-200 md:border-gray-200 pb-4 md:pb-2">
            <div className="flex items-center gap-2 pr-8">
              <img
                src="/assets/LOGO.png"
                alt="Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
              />
              <h2 className="text-lg sm:text-xl font-bold text-blue-900 leading-tight">
                Sugerir nova praia
              </h2>
            </div>
          </div>

          {/* Conteúdo dos campos */}
          <div className="p-4 md:p-0">
            <div className="space-y-4 md:space-y-4">
              {/* Campo Nome da praia */}
              <div>
                <label
                  htmlFor="beachName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome da praia
                </label>
                <input
                  type="text"
                  id="beachName"
                  value={beachName}
                  onChange={(e) => setBeachName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Digite o nome da praia"
                />
              </div>

              {/* Campo Bairro - Dropdown */}
              <div className="relative">
                <label
                  htmlFor="neighborhood"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bairro
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      !isSubmitting && setIsDropdownOpen(!isDropdownOpen)
                    }
                    disabled={isSubmitting}
                    className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between"
                  >
                    <span
                      className={neighborhood ? "text-black" : "text-gray-500"}
                    >
                      {neighborhood || "Selecione o bairro"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {BAIRROS_FLORIANOPOLIS.map((bairro) => (
                        <button
                          key={bairro}
                          type="button"
                          onClick={() => handleNeighborhoodSelect(bairro)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm sm:text-base"
                        >
                          {bairro}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Campo Detalhes da localização */}
              <div className="mb-6">
                <label
                  htmlFor="locationDetails"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Informe o local da praia e pontos de referência próximos, como
                  bairros ou outras praias conhecidas. Isso ajudará nossa equipe
                  a localizar o lugar exato para adicionar ao sistema.
                </label>
                <textarea
                  id="locationDetails"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={4}
                  placeholder="Descreva a localização com detalhes..."
                />
              </div>

              {/* Botão */}
              <div className="flex justify-center pb-4 md:pb-0">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className={`px-8 py-2 rounded-full transition-colors min-w-[120px] text-sm sm:text-base flex items-center justify-center gap-2 ${
                    !isFormValid || isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-900 text-white hover:bg-blue-800"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestBeachModal;
