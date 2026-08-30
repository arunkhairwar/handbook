import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import workforceService, {
  CreateWorkforceData,
} from "../services/workforce.service";

/**
 * Mutation to create a new workforce.
 * The backend allows only one workforce per user.
 */
export const useCreateWorkforce = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkforceData) =>
      workforceService.createWorkforce(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workforce-workers"] });
    },
  });
};

/**
 * Query to get all confirmed workforce members for a given workforce.
 */
export const useWorkforceWorkers = (workforceId: string | null | undefined) => {
  return useQuery({
    queryKey: ["workforce-workers", workforceId],
    queryFn: () => workforceService.getWorkforceWorkers(workforceId!),
    enabled: !!workforceId,
  });
};
