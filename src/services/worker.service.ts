import axiosInstance from "../api/axios.instance";
import ENDPOINTS from "../api/endpoints";
import { WorkerSearchQuery } from "../types/worker.types";

const workerService = {
  searchWorker: async ({ query }: { query: WorkerSearchQuery }) => {
    const response = await axiosInstance.get(ENDPOINTS.WORKER.GET_ALL, {
      params: {
        query,
      },
    });
    return response.data;
  },
};

export default workerService;