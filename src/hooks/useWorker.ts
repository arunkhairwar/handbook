import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { WorkerSearchQuery } from "../types/worker.types";
import workerService from "../services/worker.service";

/**
 * Infinite-scroll hook to search workers from the global pool.
 * Only returns users with availableForWork: true.
 * TODO: Backend should also filter out workers already in the workforce or with a pending request.
 */
export const useSearchWorkers = (query: WorkerSearchQuery, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ["workers", "search", query],
    queryFn: async ({ pageParam }) => {
      return await workerService.searchWorker({
        ...query,
        cursor: pageParam as string | undefined,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.pagination?.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled,
  });
};

export const useGetWorkerById = (id: string) => {
  return useQuery({
    queryKey: ["workers", id],
    queryFn: () => workerService.getById(id),
    enabled: !!id,
  });
};
