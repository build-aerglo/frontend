import useApi from "~/composables/useApi";
import type { BusinessUser, LoginData } from "~/types";
import { useBusinessUserStore } from "@/store/businessUser"; 

export default function () {
  const api = useApi();
  const registerBusiness = async (data: BusinessUser) => {
    try {
      const store = useBusinessUserStore();
      const res = await api.post('api/User/business', data);

      if (res.status === 201 || res.status === 200) {
        const user: BusinessUser = res.data 
        store.setUserData(user); 
        return user;
      } else {
        throw new Error('Registration failed');
      }
    } catch (err: any) {
      console.error(err?.response?.data?.message || err.message || 'Something went wrong');
      return null;
    }
  }
  const loginUser = async (data: LoginData) => { 
    try {
      const store = useBusinessUserStore();
      const res = await api.post('api/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (res.status === 200) {
        const { access_token, id_token, role } = res.data;
        store.setLoginData({ access_token, id_token, role }); 
        return res.data;
      } else {
        throw new Error('Login failed');
      }
    } catch (err: any) {
      console.error(err?.response?.data?.message || err.message || 'Something went wrong');
      return null;
    }
  } 
  


  const mockFunction = async () => {
    try {
      const res = await api.get("url");
      if (res.status === 200) {
        return res.data;
      }

      throw new Error("Error");
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const mockFunctionPost = async () => {
    try {
      const res = await api.post("url", JSON.stringify({ name: "test" }));
      if (res.status === 200) {
        return res.data;
      }

      throw new Error("Error");
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return {
    mockFunction,
    mockFunctionPost,
    loginUser, 
    registerBusiness
  };
}