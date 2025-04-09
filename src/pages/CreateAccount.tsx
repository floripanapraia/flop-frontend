import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import Input from "../components/Input";
import { cadastrarUsuario } from "../services/authService";
import WelcomeModal from "../components/WelcomeModal";

interface FormData {
  username: string;
  nome: string;
  email: string;
  senha: string;
  confirmSenha: string;
  acceptTerms: boolean;
}

interface FormErrors {
  username?: string;
  nome?: string;
  email?: string;
  senha?: string;
  confirmSenha?: string;
  acceptTerms?: string;
}

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim())
      newErrors.username = "Username é obrigatório";
    if (!formData.nome.trim()) newErrors.nome = "Nome completo é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Email inválido";
    if (!formData.senha) newErrors.senha = "Senha é obrigatória";
    if (formData.senha !== formData.confirmSenha)
      newErrors.confirmSenha = "As senhas não conferem";
    if (!formData.acceptTerms)
      newErrors.acceptTerms = "Você deve aceitar os termos de serviço";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      try {
        await cadastrarUsuario({
          username: formData.username,
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          isAdmin: false,
        });
        toast.success("Conta criada com sucesso!");
        navigate("/login");
      } catch (error) {
        console.error("Error creating account:", error);
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    }
  };

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: "url('/assets/mapa.png')" }}
    >
      <div className="flex flex-col md:flex-row bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden w-full max-w-5xl min-h-[80vh]">
        {/* Painel Esquerdo (Formulário de Cadastro) */}
        <div className="md:w-1/2 w-full bg-white flex flex-col justify-center items-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-sky-800 border-b-2 border-sky-800 pb-2 mb-6 text-left">
              Cadastro
            </h2>
            <form onSubmit={handleSubmit}>
              <Input
                label="User"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                helperText="Como outros te verão na plataforma."
              />

              <Input
                label="Nome completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                error={errors.nome}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Input
                label="Senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                error={errors.senha}
              />

              <Input
                label="Confirme senha"
                name="confirmSenha"
                type="password"
                value={formData.confirmSenha}
                onChange={handleChange}
                error={errors.confirmSenha}
              />

              <Checkbox
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                label={
                  <span>
                    <a href="/terms" className="text-blue-600 underline">
                      Termos de Serviço e Privacidade
                    </a>
                  </span>
                }
                error={errors.acceptTerms}
              />

              <div className="mt-6">
                <Button type="submit" fullWidth>
                  Criar
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Painel Direito (Chamada para Login) */}
        <div className="md:w-1/2 w-full bg-sky-800 text-white flex flex-col justify-center items-center p-10">
          <div className="text-center space-y-6">
            <img src="/assets/LOGO.png" alt="logo" className="w-24 mx-auto" />
            <h1 className="text-3xl font-bold leading-snug">
              Bem Vindo ao
              <br />
              FLORIPA NA PRAIA!
            </h1>
            <p className="text-lg">Já possui uma conta?</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-2 border-2 border-white px-6 py-2 rounded-full text-white hover:bg-white hover:text-sky-800 transition duration-300"
            >
              Faça Login
            </button>
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

export default CreateAccount;
