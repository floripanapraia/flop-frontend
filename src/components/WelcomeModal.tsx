import React from "react";

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const categories = [
    { name: "Ensolarada", color: "bg-yellow-400", icon: "/assets/sunny.svg", isImage: true },
    { name: "Ondas fortes", color: "bg-blue-700" },
    { name: "Água-viva", color: "bg-yellow-300" },
    { name: "Lotada", color: "bg-orange-500", icon: "/assets/lotada.svg", isImage: true },
    { name: "Alimentação", color: "bg-pink-500 text-white" , icon: "/assets/food.svg", isImage: true},

    { name: "Nublado", color: "bg-gray-400",  icon: "/assets/cloudy.svg", isImage: true  },
    { name: "Mar calmo", color: "bg-blue-400" },
    { name: "Vento", color: "bg-teal-300", icon: "/assets/windy.svg", isImage: true  },
    { name: "Limpa", color: "bg-green-400", icon: "/assets/clean.svg", isImage: true  },
    { name: "Estacionamento", color: "bg-pink-300" },

    { name: "Chuva", color: "bg-blue-500 text-white", icon: "/assets/rain.svg", isImage: true  },
    { name: "Água Gelada", color: "bg-blue-900 text-white" },
    { name: "Música Alta", color: "bg-violet-400", icon: "/assets/music.svg", isImage: true  },
    { name: "Lixo visível", color: "bg-amber-800 text-white"},
    { name: "Salva-vidas", color: "bg-red-300" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
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

        {/* Header */}
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Bem vindo(a) ao Floripa na Praia!
          </h1>

          <p className="text-gray-700 mb-6 text-center mx-auto max-w-2xl">
            Se você está procurando explorar o melhor de Florianópolis, chegou
            ao lugar certo. Nosso site foi pensado para facilitar a sua
            experiência ao visitar as praias da Ilha da Magia, oferecendo
            informações atualizadas em tempo real de maneira fácil e intuitiva
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-6 p-6">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}
              >
                {category.isImage ? (
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-6 h-6"
                  />
                ) : (
                  <span className="text-xl">{category.icon}</span>
                )}
              </div>
              <span className="mt-2 text-sm text-center">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
