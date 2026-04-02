export const API_BASE_URL = "http://172.17.175.165:3000/api";

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
    CREATE: "/site/create",
    GET_ALL: "/site/get-all",
    GET_BY_ID: "/site/get-by-id",
    UPDATE: "/site/update",
    DELETE: "/site/delete",
  },
  WORKER: {
    CREATE: "/worker/create",
    GET_ALL: "/worker/get-all",
    GET_BY_ID: "/worker/get-by-id",
    UPDATE: "/worker/update",
    DELETE: "/worker/delete",
  },
};

export default ENDPOINTS;
