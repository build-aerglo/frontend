import useApi from "~/composables/useApi";
import type { BusinessUser } from "~/types/business";
import type { EndUser, LoginData } from "~/types";
import useBusinessUser from "./business/useBusinessUser";
import useUser from "./useUser";

export default function () {
  const store = useBusinessUser();
  const api = useApi();
  const userStore = useUser()
  const registerBusiness = async (data: BusinessUser) => {
    try {
      const res = await api.post("api/User/business", data);

      if (res.status === 201 || res.status === 200) {
        console.log(res)
        const user: BusinessUser = res.data;
        store.setUserData(user);
        return user;
      } else {
        throw new Error("Registration failed");
      }
    } catch (err: any) {
      console.error(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
      return null;
    }
  };
  const loginUser = async (data: LoginData) => {
    try {
      const res = await api.post("api/auth/login", {
        email: data.email,
        password: data.password,
      });
      console.log(res)
      if (res.status === 200 && res.data) {
        const { access_token, id_token, expires_in, roles } = res.data;
        const role = roles[0];
        const loginPayload = {
          access_token: access_token,
          id_token: id_token,
          role: role,
          expires: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23hrs
        };
        if (role === 'business_user') {
          userStore.clearUser();
          store.setLoginData(loginPayload)
        } else if (role === 'end_user') {
          store.clearUser();         
          userStore.setLoginData(loginPayload)
        }
        return res.data;
      } else {
        throw new Error("Login failed");
      }
    } catch (err: any) {
      console.error(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
      return null;
    }
  };

  const registerEndUser = async (data: EndUser) => {
    try {
      const res = await api.post("api/User/end-user", data);

      if (res.status === 201 || res.status === 200) {
        console.log(res)
        const endUser: EndUser = res.data;
        userStore.setUserData(endUser);
        return endUser;
      } else {
        throw new Error("Registration failed");
      }
    } catch (err: any) {
      console.error(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
      return null;
    }
  };

  return {
    loginUser,
    registerBusiness,
    registerEndUser,
  };
}
