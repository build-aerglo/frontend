import { useSupportApi } from "./useSupportApi";

export function useSupportUser() {
  const { api, endpoints } = useSupportApi();

  // LOGIN
  const signin = async (email: string, password: string, rememberMe: boolean) => {
    const response = await api.post(endpoints.signin, { email, password });

    const token = response.data?.access_token;
    const user = response.data?.user; 
    if (!token) throw new Error("No token received");

    if (rememberMe) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }

    return { token, user };
  };

  // REGISTER
  const signup = async (form: any) => {
    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: form.address,
    };

    const response = await api.post(endpoints.signup, payload);
    return response.data;
  };

  return { signin, signup };
}
