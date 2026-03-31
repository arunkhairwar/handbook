import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";

import {
  authLoadingAtom,
  authStatusAtom,
  tokenAtom,
  userAtom,
} from "../atoms/auth.atoms";
import { LoginFormData, RegisterFormData } from "../schema/auth.schema";
import {
  clearAuthStorage,
  getSecureValue,
  setSecureValue,
  StorageKeys,
} from "../storage/secure-storage";
import { ApiError, Role, User } from "../types";
import { authService } from "../services/auth.service";
import { AuthStatus, Routes } from "../enums";

type UseAuthReturn = {
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  verify: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
};

export function useAuth(): UseAuthReturn {
  const setAuthLoading = useSetAtom(authLoadingAtom);
  const setAuthStatus = useSetAtom(authStatusAtom);
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const [isLoading, setIsLoading] = useState(false);

  const initializeAuth = useCallback(async () => {
    try {
      setAuthLoading(true);
      setAuthStatus(AuthStatus.LOADING);

      const storedToken = await getSecureValue(StorageKeys.AUTH_TOKEN);

      if (storedToken) {
        setToken(storedToken);
      } else {
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
      }
    } catch (error) {
      setAuthStatus(AuthStatus.ERROR);
      if (__DEV__) {
        console.error("Failed to initialize auth:", error);
      }
    } finally {
      setAuthLoading(false);
    }
  }, [setToken, setAuthLoading, setAuthStatus]);

  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginFormData) => {
      try {
        setIsLoading(true);
        setAuthStatus(AuthStatus.LOADING);

        const response = await authService.login(credentials);

        // Store token and user in secure storage
        await setSecureValue(StorageKeys.AUTH_TOKEN, response.data.token);

        // Update atoms
        setToken(response.data.token);
        verify();
      } catch (error) {
        setAuthStatus(AuthStatus.ERROR);
        const apiError = error as ApiError;
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: apiError.message,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setToken, setAuthStatus],
  );

  /**
   * Register new user
   * Note: Register API doesn't return a token, so we redirect to login after success
   */
  const register = useCallback(async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      await authService.register(data);

      Toast.show({
        type: "success",
        text1: "Account Created!",
        text2: "Please verify your phone number",
      });

      router.replace(Routes.LOGIN);
    } catch (error) {
      const apiError = error as ApiError;
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: apiError.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Clear secure storage
      await clearAuthStorage();

      // Clear atoms
      setToken(null);
      setUser(null);
      setAuthStatus(AuthStatus.UNAUTHENTICATED);

      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
      });

      // Navigate to login
      router.replace(Routes.LOGIN);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: "An error occurred while logging out",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setToken, setUser, setAuthStatus]);

  const verify = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthStatus(AuthStatus.LOADING);
      const response = await authService.verify();

      // Update atoms
      setUser(response.data);
      setAuthStatus(AuthStatus.AUTHENTICATED);
      Toast.show({
        type: "success",
        text1: `Welcome ${response.data.name}`,
        text2: response.message,
      });

      if (response.data.role === Role.CONTRACTOR) {
        router.replace(Routes.ADMIN_DASHBOARD);
      } else if (response.data.role === Role.WORKER) {
        router.replace(Routes.WORKER_DASHBOARD);
      }
    } catch (error) {
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
      const apiError = error as ApiError;
      Toast.show({
        type: "error",
        text1: "OTP Verification Failed",
        text2: apiError.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setToken, setUser, setAuthStatus]);

  return {
    isLoading,
    login,
    register,
    logout,
    verify,
    initializeAuth,
  };
}
