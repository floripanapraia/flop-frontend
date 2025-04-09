import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "../components/WelcomeModal";
import { toast } from "react-toastify";
import { login } from "../services/authService";
import { scryRenderedComponentsWithType } from "react-dom/test-utils";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    senha: "",
  });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.senha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const token = await login(credentials.username, credentials.senha);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard"); // TODO: Change to the appropriate route after login
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  return (
    
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: "url('/assets/mapa.png')"
      }}
    >
      
      <div className="flex flex-col md:flex-row bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden w-full max-w-5xl min-h-[80vh]">
        {/* Painel Esquerdo */}
        <div className="md:w-1/2 w-full bg-sky-800 text-white flex flex-col justify-center items-center p-10">
          <div className="text-center space-y-6">
            <img src="/assets/LOGO.png" alt="logo" className="w-24 mx-auto" />
            <h1 className="text-3xl font-bold leading-snug">
              Bem Vindo ao
              <br />
              FLORIPA NA PRAIA!
            </h1>
            <p className="text-lg">Não possui uma conta?</p>
            <button
              onClick={goToSignup}
              className="mt-2 border-2 border-white px-6 py-2 rounded-full text-white hover:bg-white hover:text-sky-800 transition duration-300"
            >
              Cadastre-se
            </button>
          </div>
        </div>

        {/* Painel Direito */}
        <div className="md:w-1/2 w-full bg-white flex flex-col justify-center items-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-sky-800 border-b-2 border-sky-800 pb-2 mb-6 text-left">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                name="username"
                type="text"
                placeholder="Email"
                value={credentials.username}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-100 text-center rounded-md placeholder-gray-500"
              />
              <input
                name="senha"
                type="password"
                placeholder="Senha"
                value={credentials.senha}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-100 text-center rounded-md placeholder-gray-500"
              />
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Esqueceu a senha?
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Botão de ajuda */}
      <button
        onClick={toggleHelpModal}
        className="absolute bottom-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
        aria-label="Ajuda"
      >
        <span className="text-sky-800 text-xl font-bold">?</span>
      </button>

      {/* Modal de Ajuda */}
      {showHelpModal && <WelcomeModal onClose={toggleHelpModal} />}
    </div>
  );
};

export default Login;
