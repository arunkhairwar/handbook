export const AppRoutes = {
  ADMIN: {
    DASHBOARD: "/(home)/dashboard",
    CLIENTS: "/(home)/clients",
    SITES: "/(home)/sites",
    WORKERS: "/(home)/workers",
    PAYMENTS: "/(home)/payments",
  },
  SITE: {
    ADD: "/(home)/sites/add",
    DETAIL: (id: string) => `/(home)/sites/${id}`,
  },
  CLIENT: {
    ADD: "/(home)/clients/add",
    DETAIL: (id: string) => `/(home)/clients/${id}`,
  },
  WORKER: {
    DASHBOARD: "/(home)/dashboard",
  },
  AUTH: {
    LOGIN: "/(auth)/login",
    REGISTER: "/(auth)/register",
    VERIFY_OTP: "/(auth)/verify-otp",
  },
} as const;
