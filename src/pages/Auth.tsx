import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "../components/WelcomeModal";
import ErrorModal from "../components/ErrorModal";
import { toast } from "react-toastify";
import { login, cadastrarUsuario } from "../services/authService";
import * as Components from "../components/LoginCadastro";
import {
  ErrorResponse,
  handleErrorWithToast,
  normalizeError,
  shouldShowInModal
} from "../utils/errorHandler";

const Auth: React.FC = () => {
  const [signIn, toggle] = useState<boolean>(true);
  const navigate = useNavigate();

  // Login state
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    senha: "",
  });

  // Cadastro state
  const [signUpData, setSignUpData] = useState({
    username: "",
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

  // State to track if the user just registered
  const [justRegistered, setJustRegistered] = useState(false);

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
      const token = await login(loginCredentials.email, loginCredentials.senha);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard"); // TODO: Redirect to the right page after login
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

    if (!signUpData.username.trim()) {
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
          username: signUpData.username,
          nome: signUpData.nome,
          email: signUpData.email,
          senha: signUpData.senha
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
          username: "",
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
        username: "",
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
            <Components.Subtitle>Criando minha conta</Components.Subtitle>
            <Components.Input
              type="text"
              name="username"
              placeholder="Username"
              value={signUpData.username}
              onChange={handleSignUpChange}
            />
            <Components.Input
              type="text"
              name="nome"
              placeholder="Nome"
              value={signUpData.nome}
              onChange={handleSignUpChange}
            />
            <Components.Input
              type="email"
              name="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={handleSignUpChange}
            />
            <Components.Input
              type="password"
              name="senha"
              placeholder="Senha"
              value={signUpData.senha}
              onChange={handleSignUpChange}
            />
            <Components.Input
              type="password"
              name="confirmSenha"
              placeholder="Confirmar Senha"
              value={signUpData.confirmSenha}
              onChange={handleSignUpChange}
            />
            <Components.Button type="submit" disabled={isLoading}>
              {isLoading ? "Processando..." : "Cadastre-se"}
            </Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        {/* Login */}
        <Components.SignInContainer signinIn={signIn}>
          <Components.Form onSubmit={handleLoginSubmit}>
            <Components.Subtitle>Entrar</Components.Subtitle>
            <Components.Input
              type="text"
              name="email"
              placeholder="Email"
              value={loginCredentials.email}
              onChange={handleLoginChange}
            />
            <Components.Input
              type="password"
              name="senha"
              placeholder="Senha"
              value={loginCredentials.senha}
              onChange={handleLoginChange}
            />
            <Components.Anchor href="#">Esqueceu sua senha?</Components.Anchor>
            <Components.Button type="submit" disabled={isLoading}>
              {isLoading ? "Processando..." : "Entrar"}
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
    </Components.PageWrapper>
  );
};

export default Auth;