import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "../components/WelcomeModal";
import { toast } from "react-toastify";
import { login, cadastrarUsuario } from "../services/authService";
import * as Components from "../components/LoginCadastro";

const Auth: React.FC = () => {
  const [signIn, toggle] = useState<boolean>(true);
  const navigate = useNavigate();

  // Login state
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
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

    if (!loginCredentials.username || !loginCredentials.senha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const token = await login(loginCredentials.username, loginCredentials.senha);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
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
          senha: signUpData.senha,
          isAdmin: false,
        });

        toast.success("Conta criada com sucesso!");
        toggle(true); // Muda para o form de login depois de cadastrar o usuário
      } catch (error) {
        console.error("Error creating account:", error);
        toast.error("Erro ao criar conta. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  return (
    <Components.PageWrapper>
      <Components.Container>
        {/* Cadastro */}
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form onSubmit={handleSignUpSubmit}>
            <Components.Subtitle>Criando minha conta</Components.Subtitle>
            <Components.Input
              type="text"
              name="username"
              placeholder="User"
              value={signUpData.username}
              onChange={handleSignUpChange}
            />
            <Components.Input
              type="text"
              name="nome"
              placeholder="Name"
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
              name="username"
              placeholder="Email"
              value={loginCredentials.username}
              onChange={handleLoginChange}
            />
            <Components.Input
              type="password"
              name="senha"
              placeholder="Password"
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
              <Components.GhostButton onClick={() => toggle(true)}>
                Entrar
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <img src="/assets/LOGO.png" alt="logo" className="w-24 mx-auto" />
              <Components.Title>
                Bem-vindo ao FLORIPA NA PRAIA!
              </Components.Title>
              <Components.Paragraph>Não possui uma conta?</Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
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
    </Components.PageWrapper>
  );
};

export default Auth;