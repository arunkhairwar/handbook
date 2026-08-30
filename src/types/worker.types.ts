export type WorkerSearchQuery = {
  mobile?: string;
  name?: string;
  address?: string;
  q?: string;
  limit?: number;
  cursor?: string;
};

export type WorkerSearchResult = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  countryCode: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkerRole =
  | "HELPER"
  | "MISTRI"
  | "ELECTRICIAN"
  | "PLUMBER"
  | "PAINTER"
  | "CARPENTER"
  | "COOLY";

export type Workforce = {
  id: string;
  name: string | null;
  maxMemberCount: number;
};

export type WorkforceWorker = {
  id: string;
  role: WorkerRole;
  wage: number;
  workforceId: string;
  createdAt: string;
  updatedAt: string;
  user: WorkerSearchResult;
};

export type WorkforceRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type WorkforceRequest = {
  id: string;
  status: WorkforceRequestStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  receiver: WorkerSearchResult;
};
