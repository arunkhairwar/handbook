import { z } from "zod";
import axiosInstance from "../api/axios.instance";
import ENDPOINTS from "../api/endpoints";
import { createSiteSchema } from "../schema/sites.schema";
import { Site, CursorPaginatedSitesResponse, SiteDetailsResponse } from "../types";

export type CreateSiteData = z.infer<typeof createSiteSchema>;
export type UpdateSiteData = Partial<CreateSiteData>;

export const siteService = {
  createSite: async (data: CreateSiteData) => {
    const response = await axiosInstance.post(ENDPOINTS.SITE.CREATE, data);
    return response.data;
  },

  getAllSites: async (params?: {
    limit?: number;
    cursor?: string;
    q?: string;
  }): Promise<CursorPaginatedSitesResponse> => {
    const response = await axiosInstance.get<CursorPaginatedSitesResponse>(
      ENDPOINTS.SITE.GET_ALL,
      { params }
    );
    return response.data;
  },

  getSiteById: async (id: string): Promise<SiteDetailsResponse> => {
    const response = await axiosInstance.get<SiteDetailsResponse>(
      ENDPOINTS.SITE.GET_BY_ID(id)
    );
    return response.data;
  },

  updateSite: async (id: string, data: UpdateSiteData) => {
    const response = await axiosInstance.put(ENDPOINTS.SITE.UPDATE(id), data);
    return response.data;
  },

  deleteSite: async (id: string) => {
    const response = await axiosInstance.delete(ENDPOINTS.SITE.DELETE(id));
    return response.data;
  },
};
export default siteService;
