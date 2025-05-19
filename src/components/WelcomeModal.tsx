import { X } from "lucide-react";
import React from "react";

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const categories = [
    { id: "sunny", name: "Ensolarado", icon: "/assets/iconFull/SOL.svg" },
    {
      id: "waves",
      name: "Ondas fortes",
      icon: "/assets/iconFull/ondasFortes.svg",
    },
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Fechar modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Bem-vindo ao Floripa na Praia!
          </h1>
          <p className="text-gray-700 mb-6 text-center mx-auto max-w-2xl">
            Se você está procurando explorar o melhor de Florianópolis, chegou
            ao lugar certo. Nosso site foi pensado para facilitar a sua
            experiência ao visitar as praias da Ilha da Magia, oferecendo
            informações atualizadas em tempo real de maneira fácil e intuitiva
          </p>
        </div>

        {/* Grid de ícones - versão melhorada */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center p-3  rounded-lg"
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-10 h-10 mb-2"
                />
                <span className="text-xs sm:text-sm font-medium text-blue-900 text-center">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
