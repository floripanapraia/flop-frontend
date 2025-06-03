import { X } from "lucide-react";
import React, { useState } from "react";

interface SuggestBeachModalProps {
  onClose: () => void;
  onSubmit: (beachData: {
    name: string;
    neighborhood: string;
    locationDetails: string;
  }) => void;
}

const SuggestBeachModal: React.FC<SuggestBeachModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [beachName, setBeachName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [locationDetails, setLocationDetails] = useState("");

  const handleSubmit = () => {
    onSubmit({
      name: beachName,
      neighborhood,
      locationDetails,
    });
    onClose();
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
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700 focus:outline-none p-1 z-10"
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
                    className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm sm:text-base"
                    placeholder="Digite o nome da praia"
                  />
                </div>
    
                {/* Campo Bairro */}
                <div>
                  <label
                    htmlFor="neighborhood"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm sm:text-base"
                    placeholder="Digite o bairro onde a praia está localizada"
                  />
                </div>
    
                {/* Campo Detalhes da localização */}
                <div className="mb-6">
                  <label
                    htmlFor="locationDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Informe o local da praia e pontos de referência próximos, como
                    bairros ou outras praias conhecidas. Isso ajudará nossa equipe a
                    localizar o lugar exato para adicionar ao sistema.
                  </label>
                  <textarea
                    id="locationDetails"
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none text-sm sm:text-base"
                    rows={4}
                    placeholder="Descreva a localização com detalhes..."
                  />
                </div>
    
                {/* Botão */}
                <div className="flex justify-center pb-4 md:pb-0">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`px-8 py-2 rounded-full transition-colors min-w-[120px] text-sm sm:text-base ${
                      !isFormValid
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-900 text-white hover:bg-blue-800"
                    }`}
                  >
                    Enviar
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
