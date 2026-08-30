import axiosInstance from "../api/axios.instance";
import ENDPOINTS from "../api/endpoints";
import { WorkerSearchQuery } from "../types/worker.types";

const workerService = {
  /**
   * Search for workers (users with availableForWork: true).
   * Returns a paginated result: { results, nextCursor, hasNextPage }
   */
  searchWorker: async (query: WorkerSearchQuery) => {
    const response = await axiosInstance.get(ENDPOINTS.WORKER.SEARCH, {
      params: query,
    });
    return response.data.data as {
      results: any[];
      nextCursor: string | null;
      hasNextPage: boolean;
    };
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(ENDPOINTS.WORKER.GET_BY_ID(id));
    return response.data.data;
  },
};

export default workerService;