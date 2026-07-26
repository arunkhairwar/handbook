export type Address = {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string | null;
};

export type UserProfile = {
  availableForWork: boolean;
  address: Address | null;
};

export type User = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  countryCode: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile | null;
};
