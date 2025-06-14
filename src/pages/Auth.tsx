import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorModal from "../components/ErrorModal";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import * as Components from "../components/LoginCadastro";
import WelcomeModal from "../components/WelcomeModal";
import TermsModal from "../components/TermsModal"; // Importar o novo modal
import { useAuth } from "../contexts/authContext";
import { cadastrarUsuario, User } from "../services/authService";
import {
  ErrorResponse,
  handleErrorWithToast,
  normalizeError,
  shouldShowInModal,
} from "../utils/errorHandler";
import { X } from "lucide-react";
import TwoFactorAuthModal from "../components/TwoFactorAuthModal";

const Auth: React.FC = () => {
  const [signIn, toggle] = useState<boolean>(true);
  const navigate = useNavigate();

  const { login: authLogin } = useAuth();

  // Login state - agora só precisamos do email e senha para o primeiro passo
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    senha: "",
  });

  // Cadastro state
  const [signUpData, setSignUpData] = useState({
    nickname: "",
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New state for error modal
  const [modalError, setModalError] = useState<ErrorResponse | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);

  // State to track if the user just registered
  const [justRegistered, setJustRegistered] = useState(false);

  // 2FA Modal state
  const [is2FAModalOpen, setIs2FAModalOpen] = useState<boolean>(false);

  // Terms of Service states
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const handleForgotPasswordSuccess = (): void => {
    // Ação após sucesso na recuperação de senha
    alert("Senha alterada com sucesso! Agora você pode fazer login.");
  };

  // Login handlers
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginCredentials({
      ...loginCredentials,
      [name]: value,
    });
  };

  // Novo handler para o login com 2FA
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginCredentials.email || !loginCredentials.senha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Abre o modal de 2FA com as credenciais
    setIs2FAModalOpen(true);
  };

  // Handler para fechar o modal de 2FA
  const handleClose2FAModal = (): void => {
    setIs2FAModalOpen(false);
  };

  // Handler para sucesso no login com 2FA
  const handleLoginSuccess = (token: string, userData: User): void => {
    // Use the integrated auth context
    authLogin(token, userData);

    toast.success("Login realizado com sucesso!");
      // Navigate based on user role
      if (userData.isAdmin === 1) {
        navigate("/admin/users");
      } else {
        navigate("/home");
      }

    // Fechar o modal
    setIs2FAModalOpen(false);

    // Limpar as credenciais por segurança
    setLoginCredentials({
      email: "",
      senha: "",
    });
  };

  // Cadastro handlers
  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  };

  // Handler para o checkbox dos termos
  const handleTermsCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAcceptedTerms(e.target.checked);
  };

  // Handler para abrir o modal de termos
  const handleOpenTermsModal = () => {
    setShowTermsModal(true);
  };

  // Handler para aceitar os termos pelo modal
  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    setShowTermsModal(false);
  };

  const validateSignUp = (): boolean => {
    let isValid = true;

    if (!signUpData.nickname.trim()) {
      toast.error("Username é obrigatório");
      isValid = false;
    } else if (signUpData.nickname.trim().length < 3) {
      toast.error("Username deve ter pelo menos 3 caracteres");
      isValid = false;
    }
    if (!signUpData.nome.trim()) {
      toast.error("Nome é obrigatório");
      isValid = false;
    } else if (signUpData.nome.trim().length < 3) {
      toast.error("Nome deve ter pelo menos 3 caracteres");
      isValid = false;
    }
    if (!signUpData.email.trim()) {
      toast.error("Email é obrigatório");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(signUpData.email)) {
      toast.error("Email inválido");
      isValid = false;
    }
    if (!signUpData.senha) {
      toast.error("Senha é obrigatória");
      isValid = false;
    } else if (signUpData.senha.length < 8) {
      toast.error("Senha deve ter pelo menos 8 caracteres");
      isValid = false;
    }
    if (signUpData.senha !== signUpData.confirmSenha) {
      toast.error("As senhas não conferem");
      isValid = false;
    }
    if (!acceptedTerms) {
      toast.error("Você deve aceitar os termos de serviço");
      isValid = false;
    }

    return isValid;
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateSignUp()) {
      setIsLoading(true);

      try {
        await cadastrarUsuario({
          nickname: signUpData.nickname,
          nome: signUpData.nome,
          email: signUpData.email,
          senha: signUpData.senha,
        });

        toast.success("Conta criada com sucesso!");

        // Set the flag indicating user just registered
        setJustRegistered(true);

        // Pre-fill the login email with the registration email
        setLoginCredentials({
          email: signUpData.email,
          senha: "",
        });

        // Clear signup form
        setSignUpData({
          nickname: "",
          nome: "",
          email: "",
          senha: "",
          confirmSenha: "",
        });

        // Reset terms acceptance
        setAcceptedTerms(false);

        // Switch to login form
        toggle(true);
      } catch (error: any) {
        console.error("Error creating account:", error);

        // Determine if error should be shown in modal or toast
        if (shouldShowInModal(error)) {
          setModalError(normalizeError(error));
          setShowErrorModal(true);
        } else {
          handleErrorWithToast(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Custom toggle function to handle form switching
  const toggleForm = (showSignIn: boolean) => {
    // If we're not changing the state, don't do anything
    if (showSignIn === signIn) return;

    // If switching to registration form, clear the registration fields
    if (!showSignIn) {
      setSignUpData({
        nickname: "",
        nome: "",
        email: "",
        senha: "",
        confirmSenha: "",
      });

      // Reset the just registered flag and terms acceptance
      setJustRegistered(false);
      setAcceptedTerms(false);
    }

    // If we're switching to login form and not coming from registration,
    // clear the login fields
    if (showSignIn && !justRegistered) {
      setLoginCredentials({
        email: "",
        senha: "",
      });
    }

    // Update the toggle state
    toggle(showSignIn);
  };

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setModalError(null);
  };

  return (
    <Components.PageWrapper
      style={{ backgroundImage: "url('/assets/mapa.png')" }}
      className="bg-cover bg-center min-h-screen"
    >
      <Components.Container>
        {/* Cadastro */}
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form onSubmit={handleSignUpSubmit}>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => navigate("/home")}
                className="text-blue-900 hover:text-gray-900 transition"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>
            </div>

            <div className="w-full mb-4">
              <Components.Subtitle>Criando minha conta</Components.Subtitle>
            </div>

            <div className="w-full mb-1">
              <Components.FormLabel>Username</Components.FormLabel>
              <Components.Input
                type="text"
                name="nickname"
                value={signUpData.nickname}
                onChange={handleSignUpChange}
                maxLength={20}
                disabled={isLoading}
              />
            </div>
            <div className="w-full mb-1">
              <Components.FormLabel>Nome</Components.FormLabel>
              <Components.Input
                type="text"
                name="nome"
                value={signUpData.nome}
                onChange={handleSignUpChange}
                maxLength={80}
                disabled={isLoading}
              />
            </div>

            <div className="w-full mb-1">
              <Components.FormLabel>Email</Components.FormLabel>
              <Components.Input
                type="email"
                name="email"
                value={signUpData.email}
                onChange={handleSignUpChange}
                maxLength={100}
                disabled={isLoading}
              />
            </div>

            <div className="w-full mb-1">
              <Components.FormLabel>Senha</Components.FormLabel>
              <Components.Input
                type="password"
                name="senha"
                value={signUpData.senha}
                onChange={handleSignUpChange}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault(); // Bloqueia a tecla de espaço
                  }
                }}
                minLength={8}
                maxLength={32}
                disabled={isLoading}
              />
            </div>

            <div className="w-full mb-1">
              <Components.FormLabel>Confirmar Senha</Components.FormLabel>
              <Components.Input
                type="password"
                name="confirmSenha"
                value={signUpData.confirmSenha}
                onChange={handleSignUpChange}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault(); // Bloqueia a tecla de espaço
                  }
                }}
                minLength={8}
                maxLength={32}
                disabled={isLoading}
              />
            </div>

            {/* Checkbox dos Termos de Serviço */}
            <div className="w-full mb-3  items-start gap-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={handleTermsCheckboxChange}
                disabled={isLoading}
                className="mt-0.5 flex-shrink-0 m-2 w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="acceptTerms"
                className="text-sm text-gray-700 leading-tight cursor-pointer"
              >
                Aceito os{" "}
                <button
                  type="button"
                  onClick={handleOpenTermsModal}
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                  disabled={isLoading}
                >
                  termos de serviço
                </button>{" "}
                e política de privacidade
              </label>
            </div>

            <Components.Button
              type="submit"
              disabled={isLoading || !acceptedTerms}
              className={`${
                !acceptedTerms ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Cadastrando..." : "Cadastre-se"}
            </Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        {/* Login */}
        <Components.SignInContainer signinIn={signIn}>
          <Components.Form onSubmit={handleLoginSubmit}>
            <div className="w-full mb-4">
              <Components.Subtitle>Entrar</Components.Subtitle>
            </div>

            <div className="w-full mb-1">
              <Components.FormLabel>Email</Components.FormLabel>
              <Components.Input
                type="text"
                name="email"
                value={loginCredentials.email}
                onChange={handleLoginChange}
                maxLength={100}
                disabled={isLoading}
              />
            </div>

            <div className="w-full mb-1">
              <Components.FormLabel>Senha</Components.FormLabel>
              <Components.Input
                type="password"
                name="senha"
                value={loginCredentials.senha}
                onChange={handleLoginChange}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault(); // Bloqueia a tecla de espaço
                  }
                }}
                disabled={isLoading}
              />
            </div>

            <p>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm  text-grey-800 link-button"
              >
                Esqueceu sua senha?
              </button>
            </p>
            <Components.Button type="submit" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <img src="/assets/LOGO.png" alt="logo" className="w-24 mx-auto" />
              <Components.Title>
                Bem-vindo ao FLORIPA NA PRAIA!
              </Components.Title>
              <Components.Paragraph>Já possui uma conta?</Components.Paragraph>
              <Components.GhostButton onClick={() => toggleForm(true)}>
                Entrar
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <img src="/assets/LOGO.png" alt="logo" className="w-24 mx-auto" />
              <Components.Title>
                Bem-vindo ao FLORIPA NA PRAIA!
              </Components.Title>
              <Components.Paragraph>Não possui uma conta?</Components.Paragraph>
              <Components.GhostButton onClick={() => toggleForm(false)}>
                Cadastre-se
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>

      <button
        onClick={toggleHelpModal}
        className="absolute bottom-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
        aria-label="Ajuda"
        disabled={isLoading}
      >
        <span className="text-sky-800 text-xl font-bold">?</span>
      </button>

      {showHelpModal && <WelcomeModal onClose={toggleHelpModal} />}

      {/* Error Modal */}
      <ErrorModal
        error={modalError}
        isOpen={showErrorModal}
        onClose={closeErrorModal}
      />

      {/* Modal de recuperação de senha */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={handleForgotPasswordSuccess}
      />

      {/* Modal de Autenticação 2FA */}
      <TwoFactorAuthModal
        isOpen={is2FAModalOpen}
        onClose={handleClose2FAModal}
        onSuccess={handleLoginSuccess}
        email={loginCredentials.email}
        senha={loginCredentials.senha}
      />

      {/* Modal de Termos de Serviço */}
      {showTermsModal && (
        <TermsModal
          onClose={() => setShowTermsModal(false)}
          onAccept={handleAcceptTerms}
        />
      )}
    </Components.PageWrapper>
  );
};

export default Auth;
