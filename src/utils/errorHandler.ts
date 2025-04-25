import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";

export interface ErrorResponse {
  message: string;
  error: string;
  status: number;
}

/**
 * Determines if an error object is a properly formatted API error response
 */
export const isApiErrorResponse = (error: any): error is ErrorResponse => {
  return (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    'error' in error &&
    'status' in error
  );
};

/**
 * Extracts the error message from various error formats
 */
export const getErrorMessage = (error: unknown): string => {
  // If it's already our API error response format
  if (isApiErrorResponse(error)) {
    return error.message;
  }

  // If it's an axios error
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Check for response data in the expected format
    if (axiosError.response?.data) {
      if (isApiErrorResponse(axiosError.response.data)) {
        return axiosError.response.data.message;
      }

      // Handle string response
      if (typeof axiosError.response.data === 'string') {
        return axiosError.response.data;
      }

      // Handle object with message property
      if (typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
        return (axiosError.response.data as any).message;
      }
    }

    // Handle network errors
    if (axiosError.message) {
      if (axiosError.message === 'Network Error') {
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      return axiosError.message;
    }
  }

  // For Error instances
  if (error instanceof Error) {
    return error.message;
  }

  // Default fallback
  return 'Ocorreu um erro. Tente novamente mais tarde.';
};

/**
 * Converts various error types to a standard ErrorResponse format
 */
export const normalizeError = (error: unknown): ErrorResponse => {
  // If it's already our API error response format
  if (isApiErrorResponse(error)) {
    return error;
  }

  // Default error structure
  const defaultError: ErrorResponse = {
    message: getErrorMessage(error),
    error: 'Error',
    status: 500
  };

  // If it's an axios error
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // If response data is in our format
      if (axiosError.response.data && isApiErrorResponse(axiosError.response.data)) {
        return axiosError.response.data as ErrorResponse;
      }

      // Create error response from status
      return {
        message: getErrorMessage(error),
        error: axiosError.response.statusText || 'Error',
        status: axiosError.response.status
      };
    }

    // For network errors
    if (axiosError.message === 'Network Error') {
      return {
        message: 'Erro de conexão. Verifique sua internet e tente novamente.',
        error: 'Network Error',
        status: 0
      };
    }
  }

  return defaultError;
};

/**
 * Displays an error toast with the extracted message
 */
export const handleErrorWithToast = (error: unknown): void => {
  const message = getErrorMessage(error);
  toast.error(message);
};

/**
 * Determines if an error should be shown in a modal instead of toast
 * Based on error status and context
 */
export const shouldShowInModal = (error: unknown): boolean => {
  const normalizedError = normalizeError(error);

  // Critical authentication errors
  if (normalizedError.status === 401 || normalizedError.status === 403) {
    return true;
  }

  // Validation errors with specific messages that need attention
  if (normalizedError.status === 400 &&
    (normalizedError.message.includes('e-mail') ||
      normalizedError.message.includes('email') ||
      normalizedError.message.includes('nickname') ||
      normalizedError.message.includes('senha'))) {
    return true;
  }

  // Server errors
  if (normalizedError.status >= 500) {
    return true;
  }

  return false;
};