import { X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface RequireAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequireAuthModal: React.FC<RequireAuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/auth");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-auto p-6 text-center relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          aria-label="Fechar modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex justify-center items-center mb-4">
          <img
            src="/assets/LOGO.png"
            alt="Logo"
            className="w-12 h-12 drop-shadow-sm"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-blue-900 mb-3">
          Você não está logado!
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Para acessar esta funcionalidade, é necessário estar logado. Faça
          login ou crie sua conta para aproveitar todos os benefícios!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="bg-[#182E4C] hover:bg-[#1a365d] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors w-full"
          >
            ENTRAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequireAuthModal;
