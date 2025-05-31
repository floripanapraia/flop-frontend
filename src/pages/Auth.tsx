import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorModal from "../components/ErrorModal";
import * as Components from "../components/LoginCadastro";
import WelcomeModal from "../components/WelcomeModal";
import { useAuth } from "../contexts/authContext";
import { cadastrarUsuario, login } from "../services/authService";
import {
  ErrorResponse,
  handleErrorWithToast,
  normalizeError,
  shouldShowInModal,
} from "../utils/errorHandler";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

const Auth: React.FC = () => {
  const [signIn, toggle] = useState<boolean>(true);
  const navigate = useNavigate();

  const { login: authLogin } = useAuth();

  // Login state
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginCredentials.email || !loginCredentials.senha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const { token, user } = await login(loginCredentials.email, loginCredentials.senha);

      // Use the integrated auth context
      authLogin(token, user);

      toast.success("Login realizado com sucesso!");

      // Navigate based on user role
      if (user.isAdmin === 1) {
        navigate("/admin/users");
      } else {
        navigate("/editar");
      }

    } catch (error: any) {
      console.error("Erro no login:", error);

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
  };

  // Cadastro handlers
  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  };

  const validateSignUp = (): boolean => {
    let isValid = true;

    if (!signUpData.nickname.trim()) {
      toast.error("Username é obrigatório");
      isValid = false;
    }
    if (!signUpData.nome.trim()) {
      toast.error("Nome é obrigatório");
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

      // Reset the just registered flag
      setJustRegistered(false);
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
            <Components.Button type="submit" disabled={isLoading}>
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
    </Components.PageWrapper>
  );
};

export default Auth;