import { MutationCache, QueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { ApiError } from "../types";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Allow individual mutations to suppress the global toast
      if (mutation.meta?.suppressErrorToast) return;

      const apiError = error as unknown as ApiError;
      const title = (mutation.meta?.errorTitle as string) || "Error";

      Toast.show({
        type: "error",
        text1: title,
        text2: apiError.message || "Something went wrong",
      });
    },
  }),
});
