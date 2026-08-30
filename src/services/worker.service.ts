import axiosInstance from "../api/axios.instance";
import ENDPOINTS from "../api/endpoints";
import { CursorPaginatedResponse } from "../types/shared/api.types";
import { WorkerSearchQuery, WorkerSearchResult } from "../types/worker.types";

const workerService = {
  /**
   * Search for workers (users with availableForWork: true).
   * Returns a cursor-paginated result: { success, message, data, meta: { pagination } }
   */
  searchWorker: async (
    query: WorkerSearchQuery
  ): Promise<CursorPaginatedResponse<WorkerSearchResult>> => {
    const response = await axiosInstance.get<
      CursorPaginatedResponse<WorkerSearchResult>
    >(ENDPOINTS.WORKER.SEARCH, {
      params: query,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(ENDPOINTS.WORKER.GET_BY_ID(id));
    return response.data.data;
  },
};

export default workerService;