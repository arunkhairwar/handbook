export const API_BASE_URL = "http://192.168.1.45:3000/api";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY: "/auth/verify",
  },
  CLIENT: {
    CREATE: "/client",
    GET_ALL: "/client",
    GET_BY_ID: (id: string) => `/client/${id}`,
    UPDATE: (id: string) => `/client/${id}`,
    DELETE: (id: string) => `/client/${id}`,
  },
  SITE: {
    CREATE: "/site",
    GET_ALL: "/site",
    GET_BY_ID: (id: string) => `/site/${id}`,
    UPDATE: (id: string) => `/site/${id}`,
    DELETE: (id: string) => `/site/${id}`,
  },
  WORKER: {
    CREATE: "/worker",
    GET_ALL: "/worker",
    GET_BY_ID: (id: string) => `/worker/${id}`,
    UPDATE: (id: string) => `/worker/${id}`,
    DELETE: (id: string) => `/worker/${id}`,
  },
};

export default ENDPOINTS;
