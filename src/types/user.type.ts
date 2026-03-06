export enum Role {
  CONTRACTOR = "CONTRACTOR",
  WORKER = "WORKER",
  ADMIN = "ADMIN",
  USER = "USER",
}

export type User = {
  id: string; // UUID
  name: string;
  email: string;
  role: Role; // enum candidate
  mobile: string;
  createdAt: string; // ISO timestamp
  address: Address;
};

export type Address = {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
};
