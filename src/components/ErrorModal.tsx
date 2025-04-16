// src/components/ErrorModal.tsx
import React from "react";
import { ErrorResponse } from "../utils/errorHandler";

interface ErrorModalProps {
  error: ErrorResponse | null;
  onClose: () => void;
  isOpen: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose, isOpen }) => {
  if (!isOpen || !error) return null;

  const getStatusMessage = (status: number): string => {
    switch (status) {
      case 0:
        return "Erro de conexão";
      case 400:
        return "Dados inválidos";
      case 401:
        return "Não autorizado";
      case 403:
        return "Acesso negado";
      case 404:
        return "Não encontrado";
      case 409:
        return "Conflito de dados";
      case 422:
        return "Dados inválidos";
      case 500:
        return "Erro no servidor";
      default:
        return `Erro ${status}`;
    }
  };

  const getIconByStatus = (status: number) => {
    // Determine icon based on status code
    if (status >= 500) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    } else if (status === 401 || status === 403) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            {getIconByStatus(error.status)}
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">
            {getStatusMessage(error.status)}
          </h3>
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-700">{error.message}</p>

          {/* Additional action suggestion based on error type */}
          {error.status === 401 && (
            <p className="mt-2 text-sm text-gray-600">
              Verifique suas credenciais e tente novamente.
            </p>
          )}

          {error.status === 403 && error.message.includes('e-mail') && (
            <p className="mt-2 text-sm text-gray-600">
              Tente cadastrar-se com um endereço de e-mail diferente.
            </p>
          )}

          {error.status === 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Verifique sua conexão com a internet e tente novamente.
            </p>
          )}
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;