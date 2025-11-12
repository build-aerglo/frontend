export interface BusinessData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: string;
}
export interface LoginData {
  email: string;
  password: string;
}