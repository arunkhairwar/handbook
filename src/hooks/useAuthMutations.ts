import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import {
  authStatusAtom,
  tokenAtom,
  userAtom,
} from "../atoms/auth.atoms";
import { AuthStatus } from "../enums";
import { RegisterFormData } from "../schema/auth.schema";
import { authService } from "../services/auth.service";
import {
  clearAuthStorage,
  setSecureValue,
  StorageKeys,
} from "../storage/secure-storage";
import { User } from "../types";

// ─── Types ──────────────────────────────────────────────────────────────────────

type LoginResult = {
  token: string;
  user: User;
  message: string;
};

// ─── useSendOtp ─────────────────────────────────────────────────────────────────

/**
 * Sends OTP to the given phone number.
 *
 * - Error toast: handled globally by MutationCache
 * - Success toast: handled by the calling screen
 */
export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => authService.sendOtp(phone),
    meta: { errorTitle: "Failed to send OTP" },
  });
}

// ─── useLogin ───────────────────────────────────────────────────────────────────

/**
 * Verifies OTP, stores token, verifies user profile, and updates auth atoms.
 *
 * - Error toast: handled globally by MutationCache
 * - Success toast + navigation: handled by the calling screen
 */
export function useLogin() {
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const setAuthStatus = useSetAtom(authStatusAtom);

  return useMutation({
    mutationFn: async (credentials: {
      phone: string;
      otp: string;
    }): Promise<LoginResult> => {
      const loginRes = await authService.login(credentials);
      await setSecureValue(StorageKeys.AUTH_TOKEN, loginRes.data.token);

      const verifyRes = await authService.verify();

      return {
        token: loginRes.data.token,
        user: verifyRes.data,
        message: verifyRes.message,
      };
    },
    meta: { errorTitle: "Login Failed" },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      setAuthStatus(AuthStatus.AUTHENTICATED);
    },
    onError: () => {
      setAuthStatus(AuthStatus.ERROR);
    },
  });
}

// ─── useRegister ────────────────────────────────────────────────────────────────

/**
 * Registers a new user.
 *
 * - Error toast: handled globally by MutationCache
 * - Success toast + navigation: handled by the calling screen
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    meta: { errorTitle: "Registration Failed" },
  });
}

// ─── useLogout ──────────────────────────────────────────────────────────────────

/**
 * Clears auth storage and resets auth atoms.
 *
 * - Error toast: handled globally by MutationCache
 * - Success toast + navigation: handled by the calling screen
 */
export function useLogout() {
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const setAuthStatus = useSetAtom(authStatusAtom);

  return useMutation({
    mutationFn: async () => {
      await clearAuthStorage();
    },
    meta: { errorTitle: "Logout Failed" },
    onSuccess: () => {
      setToken(null);
      setUser(null);
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    },
  });
}
