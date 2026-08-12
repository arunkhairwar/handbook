export const API_BASE_URL = "http://192.168.1.78:3000/api/v1";

export const ENDPOINTS = {
  AUTH: {
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    REGISTER: "/auth/register",
    LOGIN: "/auth/login"
  },
  USER: {
    ME: "/users/me",
  },
  CLIENT: {
    CREATE: "/clients",
    GET_ALL: "/clients",
    GET_BY_ID: (id: string) => `/clients/${id}`,
    UPDATE: (id: string) => `/clients/${id}`,
    DELETE: (id: string) => `/clients/${id}`,
  },
  SITE: {
    CREATE: "/sites",
    GET_ALL: "/sites",
    GET_BY_ID: (id: string) => `/sites/${id}`,
    UPDATE: (id: string) => `/sites/${id}`,
    DELETE: (id: string) => `/sites/${id}`,
  },
  WORKER: {
    CREATE: "/workers",
    GET_ALL: "/workers",
    GET_BY_ID: (id: string) => `/workers/${id}`,
    UPDATE: (id: string) => `/workers/${id}`,
    DELETE: (id: string) => `/workers/${id}`,
  },
};

export default ENDPOINTS;
