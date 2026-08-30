import axiosInstance from "../api/axios.instance";
import ENDPOINTS from "../api/endpoints";
import {
  UpdateWorkforceRequestStatusData,
  WorkforceRequest,
} from "../types/worker.types";

export type SendWorkforceRequestData = {
  receiverId: string;
  workforceId: string;
};

const workforceRequestService = {
  /**
   * Send a join request to a worker inviting them to join the workforce.
   * Payload: { receiverId: ulid, workforceId: ulid }
   */
  sendRequest: async (data: SendWorkforceRequestData) => {
    const response = await axiosInstance.post(
      ENDPOINTS.WORKFORCE_REQUEST.CREATE,
      data,
    );
    return response.data.data;
  },

  /**
   * Get all requests sent by the authenticated user (contractor).
   * Returns: WorkforceRequest[] with receiver info and status.
   */
  getSentRequests: async (): Promise<WorkforceRequest[]> => {
    const response = await axiosInstance.get(
      ENDPOINTS.WORKFORCE_REQUEST.GET_OUTGOING,
    );
    return response.data.data as WorkforceRequest[];
  },

  /**
   * Get all incoming requests for the authenticated user.
   * Returns: WorkforceRequest[]
   */
  getIncomingRequests: async (): Promise<WorkforceRequest[]> => {
    const response = await axiosInstance.get(
      ENDPOINTS.WORKFORCE_REQUEST.GET_INCOMING,
    );
    return response.data.data as WorkforceRequest[];
  },

  /**
   * Update status of an incoming workforce request (PATCH /workforce-requests).
   * Payload: { requestId, status: "ACCEPTED" | "REJECTED", reason?: string }
   */
  updateRequestStatus: async (
    data: UpdateWorkforceRequestStatusData,
  ): Promise<WorkforceRequest> => {
    const response = await axiosInstance.patch(
      ENDPOINTS.WORKFORCE_REQUEST.UPDATE_STATUS,
      data,
    );
    return response.data.data as WorkforceRequest;
  },

  /**
   * Cancel a sent request (DELETE /workforce-requests/:requestId).
   * Only the sender can cancel; request must still be PENDING.
   */
  cancelRequest: async (requestId: string) => {
    const response = await axiosInstance.delete(
      ENDPOINTS.WORKFORCE_REQUEST.CANCEL(requestId),
    );
    return response.data.data;
  },
};

export default workforceRequestService;

