import useApi from "~/composables/useApi";
import type { BusinessUser, BusinessUserResponse } from "~/types/business";
import type { EndUser, LoginData } from "~/types";
import type { SupportUser } from "~/types/support";
import useBusinessUser from "./business/useBusinessUser";
import useSupportUser from "./support/useSupportUser";
import useUser from "./useUser";

export default function () {
  const store = useBusinessUser();
  const supportStore = useSupportUser();
  const api = useApi();
  const userStore = useUser();
  const registerBusiness = async (data: BusinessUser) => {
    try {
      const res = await api.post("api/User/business", data);

      if (res.status === 201 || res.status === 200) {
        console.log(res);
        const user: BusinessUserResponse = res.data;
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

  const registerSupportUser = async (data: SupportUser) => {
    try {
      const res = await api.post("api/User/support", data);

      if (res.status === 201 || res.status === 200) {
        const user: SupportUser = res.data;
        supportStore.setUserData(user);
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
      console.log(res);
      if (res.status === 200 && res.data) {
        const { access_token, id_token, expires_in, roles, id } = res.data;
        const role = roles[0];
        const loginPayload = {
          access_token: access_token,
          id_token: id_token,
          role: role,
          expires: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23hrs
        };
        if (role === "business_user") {
          store.clearUser();
          store.setLoginData(loginPayload);
          store.setId(id);
        } else if (role === "end_user") {
          userStore.clearUser();
          userStore.setLoginData(loginPayload);
          userStore.setId(id);
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
  const logoutUser = async () => {
    try {
      // 1. Identify current role before clearing state
      // Check both stores or pass as an argument if preferred
      const role = store.role || userStore.role;

      // 2. Call the backend to invalidate the session
      await api.post("api/auth/logout");

      // 3. Wipe all local data
      store.clearUser();
      userStore.clearUser();

      // 4. Determine redirect path
      const redirectPath = role === 'business_user' 
        ? '/business/auth/sign-in' 
        : '/end-user/auth/sign-in';

      // 5. Finalize logout
      await navigateTo(redirectPath, { replace: true });
      
    } catch (err: any) {
      console.error("Logout failed:", err?.message);
      // Even if the API call fails, we usually want to clear local state
      store.clearUser();
      userStore.clearUser();
      navigateTo('/end-user/auth/sign-in'); 
    }
  };

  const registerEndUser = async (data: EndUser) => {
    try {
      const res = await api.post("api/User/end-user", data);

      if (res.status === 201 || res.status === 200) {
        console.log(res);
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
    registerSupportUser,
    logoutUser
  };
}
