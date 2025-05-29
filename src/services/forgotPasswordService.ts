import { AxiosError } from "axios";
import apiClient from "./api";


interface ApiResponse {
  success: boolean;
  message: string;
}

interface ChangePasswordRequest {
  password: string;
  repeatPassword: string;
}

const forgotPasswordService = {

  // Envia email com OTP
  sendVerificationEmail: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<string>(
        `/forgotPassword/verifyMail/${email}`,
        {} 
      );
      return {
        success: true,
        message: response.data,
      };
    } catch (error) {
      console.error("Erro detalhado:", error);
      const axiosError = error as AxiosError<string>;
      return {
        success: false,
        message:
          axiosError.response?.data || "Não existe um usuário cadastrado com este email!",
      };
    }
  },

  // Verifica OTP
  verifyOtp: async (otp: number, email: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<string>(
        `/forgotPassword/verifyOtp/${otp}/${email}`,
        {} 
      );
      return {
        success: true,
        message: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<string>;
      return {
        success: false,
        message: axiosError.response?.data || "Código inválido ou expirado",
      };
    }
  },

  // Altera a senha
  changePassword: async (
    email: string,
    password: string,
    repeatPassword: string
  ): Promise<ApiResponse> => {
    try {
      const requestData: ChangePasswordRequest = {
        password,
        repeatPassword,
      };

      const response = await apiClient.post<string>(
        `/forgotPassword/changePassword/${email}`,
        requestData
      );

      return {
        success: true,
        message: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<string>;
      return {
        success: false,
        message: axiosError.response?.data || "Erro ao alterar senha",
      };
    }
  },
};

export default forgotPasswordService;