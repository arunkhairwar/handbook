import { User } from "./user.type";

export type ApiResponseStatus = "success" | "error" | "failed";

export type LoginResponse = {
  message: string;
  status: ApiResponseStatus;
  data: {
    token: string;
  };
};

export type RegisterResponse = {
  message: string;
  token: string;
  data: string;
};

export type VerifyResponse = {
  message: string;
  status: ApiResponseStatus;
  data: User;
};
