import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import workforceRequestService, {
  SendWorkforceRequestData,
} from "../services/workforce-request.service";

const SENT_REQUESTS_QUERY_KEY = ["workforce-requests", "sent"];

/**
 * Query: get all requests sent by the current user (contractor).
 */
export const useSentWorkforceRequests = (enabled = true) => {
  return useQuery({
    queryKey: SENT_REQUESTS_QUERY_KEY,
    queryFn: () => workforceRequestService.getSentRequests(),
    enabled,
  });
};

/**
 * Mutation: send a join-request to a worker.
 * Invalidates the sent-requests query so the Requests sheet updates.
 */
export const useSendWorkforceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendWorkforceRequestData) =>
      workforceRequestService.sendRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SENT_REQUESTS_QUERY_KEY });
    },
  });
};

/**
 * Mutation: cancel a sent (PENDING) request via DELETE.
 * Invalidates the sent-requests query so the Requests sheet updates.
 */
export const useCancelWorkforceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      workforceRequestService.cancelRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SENT_REQUESTS_QUERY_KEY });
    },
  });
};
