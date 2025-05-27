import React from "react";

interface ThankYouDenunciaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThankYouDenunciaModal: React.FC<ThankYouDenunciaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-auto p-6 text-center">
         <div className="flex justify-center items-center mb-4">
  <img
    src="/assets/LOGO.png"
    alt="Logo"
    className="w-10 h-10 drop-shadow-sm"
  />
</div>
        <h2 className="text-xl font-semibold text-blue-900 mb-2">
          Agradecemos a sua denúncia!
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Sua contribuição ajuda a manter nossa comunidade segura.
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ThankYouDenunciaModal;
