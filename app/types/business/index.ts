export interface BusinessUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: string;
  categoryIds: string[]
  address: string | null;
  branchName: string | null;
  branchAddress: string | null;
  website: string | null;
}

export interface BusinessProfile {
  name: string;
  website: string;
  categoryIds: string[] | null;
  parentBusinessId: string | null;
}

