import { useSetAtom } from "jotai";
import { useCallback } from "react";

import {
  authLoadingAtom,
  authStatusAtom,
  tokenAtom,
  userAtom,
} from "../atoms/auth.atoms";
import { AuthStatus } from "../enums";
import { authService } from "../services/auth.service";
import {
  clearAuthStorage,
  getSecureValue,
  StorageKeys,
} from "../storage/secure-storage";

type UseInitializeAuthReturn = {
  initializeAuth: () => Promise<void>;
};

/**
 * Hook for app-start auth initialization.
 *
 * Checks secure storage for a stored token and verifies it with the API.
 * This is a one-shot bootstrap operation — not a TanStack query.
 *
 * For auth mutations (login, sendOtp, register, logout),
 * use the dedicated hooks from `useAuthMutations.ts`.
 */
export function useInitializeAuth(): UseInitializeAuthReturn {
  const setAuthLoading = useSetAtom(authLoadingAtom);
  const setAuthStatus = useSetAtom(authStatusAtom);
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);

  const initializeAuth = useCallback(async () => {
    try {
      setAuthLoading(true);
      setAuthStatus(AuthStatus.LOADING);

      const storedToken = await getSecureValue(StorageKeys.AUTH_TOKEN);

      if (storedToken) {
        setToken(storedToken);

        const response = await authService.getUserProfile();
        setUser(response.data);
        setAuthStatus(AuthStatus.AUTHENTICATED);
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
  }, [setToken, setUser, setAuthLoading, setAuthStatus]);

  return { initializeAuth };
}
