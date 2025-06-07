import { Clock, LogOut, MapPin, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SuggestBeachModal from "./SuggestBeachModal";
import { setAuthToken } from "../services/authService";
import { getCurrentUser } from "../services/userService";
import { Sugestao } from "../services/suggestionService";
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  id: number;
  nome: string;
  email: string;
  fotoPerfil?: string;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUser();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Erro ao carregar dados do usuário");

        // Redirect to login if unauthorized
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAuthToken(null);
          navigate("/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isOpen, navigate]);

  if (!isOpen) return null;

  // Click fora do modal para fechar
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLogout = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-sm text-gray-800 font-medium">
            Deseja realmente sair?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => closeToast?.()}
              className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setAuthToken(null);
                closeToast?.();
                navigate("/auth");
              }}
              className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        icon: false,
      }
    );
  };

  const handleSugestaoSuccess = (sugestao: Sugestao) => {
    toast.success(
      `Sugestão "${sugestao.nomePraia}" enviada com sucesso! Nossa equipe irá analisar em breve.`
    );
    setIsModalOpen(false);
  };

  const handleSugestaoError = (error: string) => {
    toast.error(`Erro ao enviar sugestão: ${error}`);
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="fixed top-0 right-0 w-full h-full flex justify-end bg-black bg-opacity-25 z-50"
        onClick={handleOutsideClick}
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xs h-[54vh] m-4 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!userData) {
    return (
      <div
        className="fixed top-0 right-0 w-full h-full flex justify-end bg-black bg-opacity-25 z-50"
        onClick={handleOutsideClick}
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xs h-[54vh] m-4 p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">Erro ao carregar dados</p>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 bg-gray-200 rounded-lg text-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed top-0 right-0 w-full h-full flex justify-end bg-black bg-opacity-25 z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xs h-auto min-h-[54vh] max-h-[90vh] m-4 p-6 flex flex-col gap-4 overflow-y-auto">
        {/* Cabeçalho do perfil */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
            {userData.fotoPerfil ? (
              <img
                src={`data:image/jpeg;base64,${userData.fotoPerfil}`}
                alt={userData.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium">
                {userData.nome.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-blue-800">
              Olá, {userData.nome}!
            </h3>
            <p className="text-sm text-gray-500">{userData.email}</p>
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

          <button
            onClick={handleLogout}
            className="py-3 flex items-center gap-3 text-red-600 hover:text-red-700"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <SuggestBeachModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSugestaoSuccess}
          onError={handleSugestaoError}
        />
      )}
    </div>
  );
}
