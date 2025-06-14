import React, { useEffect, useState } from "react";
import {
  loginWithTwoFactor,
  resendTwoFactorCode,
  User,
  verifyTwoFactorAndLogin,
} from "../services/authService";

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (token: string, user: User) => void;
  email?: string;
  senha?: string;
}

type MessageType = "success" | "error";
type Step = 1 | 2;

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  email: initialEmail = "",
  senha: initialPassword = "",
}) => {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<MessageType>("success");

  // Efeito para pré-preencher as credenciais quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setPassword(initialPassword);

      // Se as credenciais já foram fornecidas, pular direto para o passo 2
      if (initialEmail && initialPassword) {
        handleAutoLogin();
      }
    }
  }, [isOpen, initialEmail, initialPassword]);

  if (!isOpen) return null;

  const showMessage = (msg: string, type: MessageType): void => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const resetModal = (): void => {
    setStep(1);
    setEmail("");
    setPassword("");
    setOtp("");
    setMessage("");
    setLoading(false);
  };

  const handleClose = (): void => {
    resetModal();
    onClose();
  };

  // Auto login quando as credenciais são fornecidas via props
  const handleAutoLogin = async (): Promise<void> => {
    if (!initialEmail || !initialPassword) return;

    setLoading(true);

    try {
      const result = await loginWithTwoFactor(initialEmail, initialPassword);

      if (result.success) {
        showMessage("Código de verificação enviado para seu email!", "success");
        setStep(2);
      } else {
        showMessage(result.message || "Credenciais inválidas", "error");
        setStep(1); // Voltar para o passo 1 se as credenciais estiverem incorretas
      }
    } catch (error) {
      showMessage("Erro inesperado. Tente novamente.", "error");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      showMessage("Por favor, insira um email válido", "error");
      return;
    }

    if (!password || password.length < 6) {
      showMessage("Por favor, insira uma senha válida", "error");
      return;
    }

    setLoading(true);

    try {
      const result = await loginWithTwoFactor(email, password);

      if (result.success) {
        showMessage("Código de verificação enviado para seu email!", "success");
        setStep(2);
      } else {
        showMessage(result.message || "Credenciais inválidas", "error");
      }
    } catch (error) {
      showMessage("Erro inesperado. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      showMessage("Por favor, insira o código de 6 dígitos", "error");
      return;
    }

    setLoading(true);

    try {
      const { token, user } = await verifyTwoFactorAndLogin(
        email,
        parseInt(otp)
      );

      if (token && user) {
        showMessage("Login realizado com sucesso!", "success");
        setTimeout(() => {
          onSuccess?.(token, user);
          handleClose();
        }, 1500);
      } else {
        showMessage("Código de verificação inválido", "error");
      }
    } catch (error) {
      showMessage("Código de verificação inválido ou expirado", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleResendCode = async (): Promise<void> => {
    if (!email || !password) {
      showMessage("Credenciais não encontradas", "error");
      return;
    }

    setLoading(true);

    try {
      const result = await loginWithTwoFactor(email, password);

      if (result.success) {
        showMessage("Novo código enviado para seu email!", "success");
      } else {
        showMessage(result.message || "Erro ao reenviar código", "error");
      }
    } catch (error) {
      showMessage("Erro ao reenviar código. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = (): JSX.Element => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="flex items-center mb-4">
        <img
          src="/assets/LOGO.png"
          alt="Logo"
          className="w-10 h-10 drop-shadow-sm mr-2"
        />
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Verificação dois fatores
        </h2>
      </div>
      <p className="text-gray-700 mb-4">
        Digite suas credenciais para receber o código de verificação:
      </p>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Senha:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Verificando..." : "Continuar"}
        </button>
      </div>
    </form>
  );

  const renderStep2 = (): JSX.Element => (
    <form onSubmit={handleVerifyOtp} className="space-y-4">
      <div className="flex items-center mb-4">
        <img
          src="/assets/LOGO.png"
          alt="Logo"
          className="w-10 h-10 drop-shadow-sm mr-2"
        />
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Verificação 2FA
        </h2>
      </div>
      <p className="text-gray-600 mb-4">
        Digite o código de 6 dígitos enviado para{" "}
        <strong className="text-gray-800">{email}</strong>:
      </p>

      <div className="space-y-2">
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-700"
        >
          Código de Verificação:
        </label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={handleOtpChange}
          placeholder="123456"
          required
          disabled={loading}
          maxLength={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-center text-lg font-mono tracking-widest"
        />
      </div>

      {/* Botão para reenviar código */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleResendCode}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Não recebeu o código? Reenviar
        </button>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          disabled={loading}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </div>
    </form>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {message && (
          <div
            className={`mb-4 p-3 rounded-md ${
              messageType === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
      </div>
    </div>
  );
};

export default TwoFactorAuthModal;
