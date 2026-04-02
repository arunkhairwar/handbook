import axiosInstance from "../api/axios.instance";
import ENDPOINTS from "../api/endpoints";
import { Client } from "../types/client.types";
import { z } from "zod";
import { createClientSchema, updateClientSchema } from "../types/client.types";

export type CreateClientData = z.infer<typeof createClientSchema>;
export type UpdateClientData = z.infer<typeof updateClientSchema>;

export const clientService = {
  createClient: async (data: CreateClientData) => {
    const response = await axiosInstance.post(ENDPOINTS.CLIENT.CREATE, data);
    return response.data;
  },

  getAllClients: async () => {
    const response = await axiosInstance.get(ENDPOINTS.CLIENT.GET_ALL);
    return response.data;
  },

  getClientById: async (id: string) => {
    const response = await axiosInstance.get(ENDPOINTS.CLIENT.GET_BY_ID(id));
    return response.data;
  },

  updateClient: async (id: string, data: UpdateClientData) => {
    const response = await axiosInstance.put(ENDPOINTS.CLIENT.UPDATE(id), data);
    return response.data;
  },

  deleteClient: async (id: string) => {
    const response = await axiosInstance.delete(ENDPOINTS.CLIENT.DELETE(id));
    return response.data;
  },
};
