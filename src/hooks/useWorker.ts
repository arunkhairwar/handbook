import { useInfiniteQuery } from "@tanstack/react-query";
import { WorkerSearchQuery } from "../types/worker.types";
import workerService from "../services/worker.service";

export const useSearchWorkers = (query: WorkerSearchQuery) => {
  return useInfiniteQuery({
    queryKey: ["workers", query],
    queryFn: async () => {
      return await workerService.searchWorker({ query });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
};
