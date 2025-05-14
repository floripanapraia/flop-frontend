import { Clock, LogOut, MapPin, Settings } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuggestBeachModal from "./SuggestBeachModal";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userImage?: string;
}

export default function ProfileModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  userImage,
}: ProfileModalProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!isOpen) return null;

  // Click fora do modal para fechar
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleSuggestBeachModal = (p0: boolean) => {
    toggleSuggestBeachModal(!toggleSuggestBeachModal);
  };

  function handleSubmitBeach(beachData: {
    name: string;
    neighborhood: string;
    locationDetails: string;
  }): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div
      className="fixed top-0 right-0 w-full h-full flex justify-end bg-black bg-opacity-25 z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xs  h-[54vh] m-4 p-6 flex flex-col gap-6">
        {/* Cabeçalho do perfil */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-blue-800">
              Olá, {userName}!
            </h3>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>
        </div>

        {/* Menu de opções */}
        <div className="flex flex-col divide-y">
          <button
            onClick={() => navigate("/perfilFlops")}
            className="py-3 flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Clock size={18} />
            <span>Histórico Flops</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="py-3 flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <MapPin size={18} />
            <span>Sugerir nova praia</span>
          </button>
        </div>

        {/* Rodapé com ações da conta */}
        <div className="mt-auto flex flex-col divide-y">
          <button
            onClick={() => navigate("/editar")}
            className="py-3 flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Settings size={18} />
            <span>Gerenciar conta</span>
          </button>

          <button className="py-3 flex items-center gap-3 text-red-600 hover:text-red-700">
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </div>
      {isModalOpen && (
        <SuggestBeachModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitBeach}
        />
      )}
    </div>
  );
}
