import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import workforceRequestService, {
  SendWorkforceRequestData,
} from "../services/workforce-request.service";
import { UpdateWorkforceRequestStatusData } from "../types/worker.types";

const SENT_REQUESTS_QUERY_KEY = ["workforce-requests", "sent"];
const INCOMING_REQUESTS_QUERY_KEY = ["workforce-requests", "incoming"];

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
 * Query: get all incoming requests for the current user.
 */
export const useIncomingWorkforceRequests = (enabled = true) => {
  return useQuery({
    queryKey: INCOMING_REQUESTS_QUERY_KEY,
    queryFn: () => workforceRequestService.getIncomingRequests(),
    enabled,
  });
};

/**
 * Mutation: send a join-request to a worker.
 * Invalidates the sent-requests query so the Requests screen updates.
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
 * Mutation: update status of an incoming request (ACCEPTED / REJECTED).
 * Invalidates incoming requests and workforce workers list.
 */
export const useUpdateWorkforceRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateWorkforceRequestStatusData) =>
      workforceRequestService.updateRequestStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workforce-requests"] });
      queryClient.invalidateQueries({ queryKey: ["workforce-workers"] });
      queryClient.invalidateQueries({ queryKey: ["my-workforce"] });
    },
  });
};

/**
 * Mutation: cancel a sent (PENDING) request via DELETE.
 * Invalidates the sent-requests query so the Requests screen updates.
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

