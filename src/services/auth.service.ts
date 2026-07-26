
import axiosInstance from "../api/axios.instance";
import ENDPOINTS from "../api/endpoints";
import { RegisterFormData } from "../schema/auth.schema";
import { LoginResponse, RegisterResponse, VerifyResponse } from "../types";

export const authService = {
  sendOtp: async (phone: string): Promise<{ success: boolean; message: string }> => {
    const mobileDigits = phone.replace("+91", "");
    const response = await axiosInstance.post(
      ENDPOINTS.AUTH.SEND_OTP,
      {
        countryCode: "+91",
        mobile: mobileDigits,
      }
    );
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<RegisterResponse> => {
    const mobileDigits = data.phone.replace("+91", "");
    const payload = {
      firstName: data.firstName,
      middleName: data.middleName || null,
      lastName: data.lastName,
      countryCode: "+91",
      mobile: mobileDigits,
    };
    const response = await axiosInstance.post<RegisterResponse>(
      ENDPOINTS.AUTH.REGISTER,
      payload,
    );
    return response.data;
  },

  login: async (credentials: { phone: string; otp: string }): Promise<LoginResponse> => {
    const mobileDigits = credentials.phone.replace("+91", "");
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
      data: { tokens: string };
    }>(
      ENDPOINTS.AUTH.LOGIN,
      {
        countryCode: "+91",
        mobile: mobileDigits,
        otp: credentials.otp,
      },
    );
    return {
      message: response.data.message,
      status: "success",
      data: {
        token: response.data.data.tokens,
      },
    };
  },

  verify: async (): Promise<VerifyResponse> => {
    const response = await axiosInstance.get<VerifyResponse>(
      ENDPOINTS.USER.ME,
    );
    return response.data;
  },
};
