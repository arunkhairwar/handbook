// export const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/v1`;
export const API_BASE_URL = `http://192.168.1.66:3000/api/v1`;
console.log(API_BASE_URL);

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
    GET_ALL: "/workers",
    GET_BY_ID: (id: string) => `/workers/${id}`,
    UPDATE: (id: string) => `/workers/${id}`,
    DELETE: (id: string) => `/workers/${id}`,
  },
};

export default ENDPOINTS;
