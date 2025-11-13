export interface BusinessData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  branchName: string | null;
  branchAddress: string | null;
  password: string;
  confirmPassword: string;
  userType: string;
  website: string | null;
  categoryIds: (number | null)[];
}
export interface LoginData {
  email: string;
  password: string;
}