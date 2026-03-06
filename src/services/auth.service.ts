/**
 * Auth service for handling authentication API calls
 */
import axiosInstance from "../api/axios.instance";
import ENDPOINTS from "../api/endpoints";
import { LoginFormData, RegisterFormData } from "../schema/auth.schema";
import { LoginResponse, RegisterResponse, VerifyResponse } from "../types";

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginFormData): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterFormData): Promise<RegisterResponse> => {
    const response = await axiosInstance.post<RegisterResponse>(
      ENDPOINTS.AUTH.REGISTER,
      data,
    );
    return response.data;
  },

  /**
   * Verify OTP
   */
  verify: async (): Promise<VerifyResponse> => {
    const response = await axiosInstance.post<VerifyResponse>(
      ENDPOINTS.AUTH.VERIFY,
    );
    return response.data;
  },
};
