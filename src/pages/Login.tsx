import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeModal from '../components/WelcomeModal';
import { toast } from 'react-toastify';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    senha: '',
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
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const token = await login(credentials.username, credentials.senha);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard'); // TODO: Change to the appropriate route after login
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Left panel - welcome message */}
      <div className="w-2/5 bg-blue-600 text-white p-8 flex flex-col items-center justify-center">
        <div className="text-center max-w-xs">
          <h1 className="text-3xl font-bold mb-4">Bem Vindo ao FLORIPA NA PRAIA!</h1>

          <p className="text-xl mb-8">Não possui uma conta?</p>

          <button
            onClick={goToSignup}
            className="border-2 border-white text-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-blue-600 transition-colors"
          >
            Cadastre-se
          </button>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="w-3/5 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h2 className="text-2xl text-blue-600 text-center mb-6 border-b pb-4">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <input
                name="username"
                type="text"
                placeholder="Nome de usuário"
                value={credentials.username}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded text-center"
              />
            </div>

            <div className="mb-4">
              <input
                name="senha"
                type="password"
                placeholder="Senha"
                value={credentials.senha}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded text-center"
              />
            </div>

            <div className="text-center mb-4">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => navigate('/forgot-password')}
              >
                Esqueceu a senha?
              </button>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Help icon */}
      <button
        onClick={toggleHelpModal}
        className="absolute bottom-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        aria-label="Help"
      >
        <span className="text-blue-600 font-bold">?</span>
      </button>

      {/* Help Modal */}
      {showHelpModal && <WelcomeModal onClose={toggleHelpModal} />}
    </div>
  );
};

export default Login;