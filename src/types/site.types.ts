export type Site = {
  id: string;
  name: string;
  image?: string;
  clientId?: string;
  addressId?: string;
  client?: {
    id: string;
    name: string;
    mobile: string;
  };
  address?: {
    id: string;
    addressLine1?: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

export interface SiteResponse {
  data: Site[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
