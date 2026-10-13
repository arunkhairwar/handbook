import axiosInstance from "../api/axios.instance";
import ENDPOINTS from "../api/endpoints";
import { Workforce, WorkforceWorker } from "../types/worker.types";

export type CreateWorkforceData = {
  name?: string;
  maxMemberCount?: number;
};

const workforceService = {
  /**
   * Create a new workforce.
   * Backend allows only ONE workforce per user — returns 403 if one already exists.
   */
  createWorkforce: async (data: CreateWorkforceData): Promise<Workforce> => {
    const response = await axiosInstance.post(ENDPOINTS.WORKFORCE.CREATE, data);
    return response.data.data as Workforce;
  },

  /**
   * Get current user's workforce.
   */
  getMyWorkforce: async (): Promise<Workforce | null> => {
    const response = await axiosInstance.get(ENDPOINTS.WORKFORCE.GET_MY);
    return (response.data.data as Workforce) || null;
  },

  /**
   * Get all workforce workers (confirmed members) for a given workforce.
   */
  getWorkforceWorkers: async (workforceId: string): Promise<WorkforceWorker[]> => {
    const response = await axiosInstance.get(
      ENDPOINTS.WORKFORCE.GET_WORKERS(workforceId)
    );
    return response.data.data as WorkforceWorker[];
  },
};

export default workforceService;
