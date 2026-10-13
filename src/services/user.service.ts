import axiosInstance from "../api/axios.instance";
import ENDPOINTS from "../api/endpoints";
import { UpdateUserProfileFormData } from "../schema/user.schema";
import { ApiResponse, User } from "../types";

export const userService = {
  updateProfile: async (data: UpdateUserProfileFormData) => {
    const response = await axiosInstance.patch<ApiResponse<User>>(ENDPOINTS.USER.UPDATE, data);
    return response.data;
  },

  updateWorkAvailability: async (availableForWork: boolean) => {
    const response = await axiosInstance.patch<ApiResponse<User>>(ENDPOINTS.USER.UPDATE, {
      availableForWork,
    });
    return response.data;
  },
};