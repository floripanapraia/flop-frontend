import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";

// Enum para os motivos de denúncia
export enum ReportReason {
  INADEQUADO = "INADEQUADO",
  INCORRETO = "INCORRETO",
  SPAM_PROPAGANDA = "SPAM_PROPAGANDA",
  ILEGAL = "ILEGAL",
  VIOLACAO_PRIVACIDADE = "VIOLACAO_PRIVACIDADE",
}

// Mapeamento dos enum values para texto
const reportReasonLabels: Record<ReportReason, string> = {
  [ReportReason.INADEQUADO]: "Conteúdo inadequado",
  [ReportReason.INCORRETO]: "Informação incorreta",
  [ReportReason.SPAM_PROPAGANDA]: "Spam ou Propaganda",
  [ReportReason.ILEGAL]: "Conteúdo ilegal",
  [ReportReason.VIOLACAO_PRIVACIDADE]: "Violação de Privacidade",
};

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (reason: ReportReason) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onReport,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
 
  const handleReasonSelect = (reason: ReportReason) => {
    onReport(reason);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Denunciar</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar modal"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Selecione o motivo da denúncia:
          </p>

          <div className="space-y-2">
            {Object.values(ReportReason).map((reason) => (
              <button
                key={reason}
                onClick={() => handleReasonSelect(reason)}
                className="w-full flex items-center justify-between p-3 rounded-lg  hover:bg-gray-100  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group"
              >
                <span className="text-gray-700 text-left">
                  {reportReasonLabels[reason]}
                </span>
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-gray-600 transition-colors"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Sua denúncia será analisada pela nossa equipe de moderação.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
