import { create } from "zustand";

interface AuthFlowState {
  /** Phone number entered during login or registration (e.g. "+919876543210") */
  userPhone: string;
  setUserPhone: (phone: string) => void;
  clearUserPhone: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  userPhone: "",
  setUserPhone: (phone) => set({ userPhone: phone }),
  clearUserPhone: () => set({ userPhone: "" }),
}));
