export const AppRoutes = {
  ADMIN: {
    DASHBOARD: "/(admin)/dashboard",
    CLIENTS: "/(admin)/clients",
    SITES: "/(admin)/sites",
    WORKERS: "/(admin)/workers",
    PAYMENTS: "/(admin)/payments",
  },
  SITE: {
    ADD: "/(admin)/sites/add",
    DETAIL: (id: string) => `/(admin)/sites/${id}`,
  },
  CLIENT: {
    ADD: "/(admin)/clients/add",
    DETAIL: (id: string) => `/(admin)/clients/${id}`,
  },
  WORKER: {
    DASHBOARD: "/(worker)/dashboard",
  },
  AUTH: {
    LOGIN: "/(auth)/login",
    REGISTER: "/(auth)/register",
  },
} as const;
