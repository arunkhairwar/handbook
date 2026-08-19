import { ApiResponse, CursorPaginatedResponse } from "./shared/api.types";

export type Site = {
  id: string;
  name: string;
  image?: string;
  clientId?: string;
  addressId?: string;
  estimatedBudget?: number | null;
  startDate?: string | null;
  expectedEndDate?: string | null;
  client?: {
    id: string;
    name: string;
    mobile: string;
  } | null;
  address?: {
    id: string;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    country?: string | null;
  } | null;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
};

export interface SiteAddressDetail {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

export interface SiteProfileDetail {
  address: SiteAddressDetail | null;
}

export interface SiteDetails {
  id: string;
  name: string;
  estimatedBudget: number | null;
  startDate: string | null;
  expectedEndDate: string | null;
  profile: SiteProfileDetail | null;
}

export type CursorPaginatedSitesResponse = CursorPaginatedResponse<Site>;
export type SiteDetailsResponse = ApiResponse<SiteDetails>;
