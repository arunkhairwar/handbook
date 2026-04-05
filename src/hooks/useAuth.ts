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
import { AuthStatus } from "../enums";
import { AppRoutes } from "../routes/app.routes";
import { LoginFormData, RegisterFormData } from "../schema/auth.schema";
import { authService } from "../services/auth.service";
import {
  clearAuthStorage,
  getSecureValue,
  setSecureValue,
  StorageKeys,
} from "../storage/secure-storage";
import { ApiError } from "../types";

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

  /**
   * Verify token with API — only updates atoms, no navigation.
   * Navigation is handled by index.tsx reacting to auth atom changes.
   */
  const verify = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthStatus(AuthStatus.LOADING);
      const response = await authService.verify();

      setUser(response.data);
      setAuthStatus(AuthStatus.AUTHENTICATED);
      Toast.show({
        type: "success",
        text1: `Welcome ${response.data.name}`,
        text2: response.message,
      });
    } catch (error) {
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
      const apiError = error as ApiError;
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: apiError.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setAuthStatus]);

  /**
   * Initialize auth on app start — checks stored token and verifies it.
   */
  const initializeAuth = useCallback(async () => {
    try {
      setAuthLoading(true);
      setAuthStatus(AuthStatus.LOADING);

      const storedToken = await getSecureValue(StorageKeys.AUTH_TOKEN);

      if (storedToken) {
        setToken(storedToken);
        await verify();
      } else {
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
      }
    } catch (error) {
      await clearAuthStorage();
      setToken(null);
      setUser(null);
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
      if (__DEV__) {
        console.error("Failed to initialize auth:", error);
      }
    } finally {
      setAuthLoading(false);
    }
  }, [setToken, setUser, setAuthLoading, setAuthStatus, verify]);

  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginFormData) => {
      try {
        setIsLoading(true);
        setAuthStatus(AuthStatus.LOADING);

        const response = await authService.login(credentials);

        await setSecureValue(StorageKeys.AUTH_TOKEN, response.data.token);

        setToken(response.data.token);
        await verify();

        router.replace("/");
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
    [setToken, setAuthStatus, verify],
  );

  /**
   * Register new user
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

      router.replace(AppRoutes.AUTH.LOGIN);
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

      await clearAuthStorage();

      setToken(null);
      setUser(null);
      setAuthStatus(AuthStatus.UNAUTHENTICATED);

      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
      });

      router.replace(AppRoutes.AUTH.LOGIN);
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

  return {
    isLoading,
    login,
    register,
    logout,
    verify,
    initializeAuth,
  };
}
