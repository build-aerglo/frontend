import axios from "axios";

export function useAuth() {
  const login = async (email: string, password: string, rememberMe: boolean) => {
    const url = "https://aerglotechnology.com/api/auth/login";

    const response = await axios.post(url, { email, password });

    const token = response.data.access_token;
    if (!token) throw new Error("No token received");

    if (rememberMe) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }

    return token;
  };

  const register = async (form: any) => {
    const url = "https://aerglotechnology.com/api/User/end-user";

    const payload = {
    username: form.username,
    email: form.email,
    password: form.password,
    phone: form.phone,
    address: form.address,
    socialMedia: form.socialMedia,
  };

    const response = await axios.post(url, payload);

    return response.data;
  };

  return {
    login,
    register,
  };
}
