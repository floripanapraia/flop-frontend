// components/ForgotPasswordModal.tsx
import React, { useState } from "react";
import forgotPasswordService from "../services/forgotPasswordService";

// Tipos do componente
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type MessageType = "success" | "error";
type Step = 1 | 2 | 3;

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<MessageType>("success");

  // Não renderiza se não estiver aberto
  if (!isOpen) return null;

  const showMessage = (msg: string, type: MessageType): void => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const resetModal = (): void => {
    setStep(1);
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setLoading(false);
  };

  const handleClose = (): void => {
    resetModal();
    onClose();
  };

  const handleSendEmail = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      showMessage("Por favor, insira um email válido", "error");
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPasswordService.sendVerificationEmail(email);

      if (result.success) {
        showMessage("Código enviado para seu email!", "success");
        setStep(2);
      } else {
        showMessage(result.message, "error");
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
      const result = await forgotPasswordService.verifyOtp(
        parseInt(otp),
        email
      );

      if (result.success) {
        showMessage("Código verificado!", "success");
        setStep(3);
      } else {
        showMessage(result.message, "error");
      }
    } catch (error) {
      showMessage("Erro inesperado. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validação da senha: entre 8 e 32 caracteres
    if (!password || password.length < 8) {
      showMessage("A senha deve ter pelo menos 8 caracteres", "error");
      return;
    }

    if (password.length > 32) {
      showMessage("A senha deve ter no máximo 32 caracteres", "error");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("As senhas não coincidem", "error");
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPasswordService.changePassword(
        email,
        password,
        confirmPassword
      );

      if (result.success) {
        showMessage("Senha alterada com sucesso!", "success");
        setTimeout(() => {
          onSuccess?.();
          handleClose();
        }, 2000);
      } else {
        showMessage(result.message, "error");
      }
    } catch (error) {
      showMessage("Erro inesperado. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.slice(0, 32); // Limita a 32 caracteres
    setPassword(value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.slice(0, 32); // Limita a 32 caracteres
    setConfirmPassword(value);
  };

  const renderStep1 = (): JSX.Element => (
    <form onSubmit={handleSendEmail} className="space-y-4">
      <div className="flex items-center mb-4">
        <img
          src="/assets/LOGO.png"
          alt="Logo"
          className="w-10 h-10 drop-shadow-sm mr-2" 
        />
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Recuperar Senha</h2>
      </div>
      <p className="text-gray-700 mb-4">
        Digite seu email para receber o código de verificação:
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
          {loading ? "Enviando..." : "Enviar Código"}
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
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Verificar Código</h2>
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
          {loading ? "Verificando..." : "Verificar"}
        </button>
      </div>
    </form>
  );

  const renderStep3 = (): JSX.Element => (
    <form onSubmit={handleChangePassword} className="space-y-4">
      <div className="flex items-center mb-4">
        <img
          src="/assets/LOGO.png"
          alt="Logo"
          className="w-10 h-10 drop-shadow-sm mr-2" 
        />
        <h2 className="text-2xl font-bold text-blue-900">Nova Senha</h2>
      </div>
      <p className="text-gray-600 mb-4">Digite sua nova senha:</p>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Nova Senha:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Entre 8 e 32 caracteres"
          required
          disabled={loading}
          minLength={8}
          maxLength={32}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <div className="text-xs text-gray-500 mt-1">
          {password.length}/32 caracteres (mínimo 8)
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirmar Nova Senha:
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Digite a senha novamente"
          required
          disabled={loading}
          minLength={8}
          maxLength={32}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => setStep(2)}
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
          {loading ? "Alterando..." : "Alterar Senha"}
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
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;