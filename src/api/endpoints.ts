export const API_BASE_URL = "http://192.168.1.44:3000/api";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY: "/auth/verify",
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
