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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-xl w-full relative"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "80vh" }}
      >
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

        <div className="p-6">
          <div className="mb-6 border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <img src="/assets/LOGO.png" alt="Logo" className="w-10 h-10" />
              <h2 className="text-xl font-bold text-blue-900">
                Sugerir nova praia
              </h2>
            </div>
          </div>

          <div className="mb-4">
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
              className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Digite o nome da praia"
            />
          </div>

          <div className="mb-4">
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
              className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Digite o bairro onde a praia está localizada"
            />
          </div>

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
              className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              rows={4}
              placeholder="Descreva a localização com detalhes..."
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`px-8 py-2 rounded-full transition-colors min-w-[120px] ${
                !isFormValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-[#1e3a5f]"
              }`}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestBeachModal;
