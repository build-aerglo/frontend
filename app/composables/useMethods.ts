import useApi from "~/composables/useApi";
import type { BusinessUser, BusinessUserResponse } from "~/types/business";
import type { EndUser, LoginData } from "~/types";
import type { SupportUser } from "~/types/support";
import useBusinessUser from "./business/useBusinessUser";
import useSupportUser from "./support/useSupportUser";
import useUser from "./useUser";

const showLogoutModal = ref(false);
const isLoggingOut = ref(false);
const logoutError = ref("");

export default function () {
  const store = useBusinessUser();
  const supportStore = useSupportUser();
  const api = useApi();
  const userStore = useUser();
  
  const clearAllStores = () => {
    store.clearUser();
    userStore.clearUser();
    supportStore.clearUser();
  };

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

  const loginUser = async (data: LoginData, expectedRole?: 'business_user' | 'end_user' | 'support_user') => {
    try {
      clearAllStores();
      const res = await api.post("api/auth/login", {
        email: data.email,
        password: data.password,
      });
      
      console.log(res);
      
      if (res.status === 200 && res.data) {
        const { access_token, id_token, expires_in, roles, id } = res.data;
        const role = roles[0];

        // Role validation - if expectedRole is provided, verify it matches
        if (expectedRole && role !== expectedRole) {
          // Clear any tokens that might have been set
          clearAllStores();
          
          // Throw generic error to prevent role enumeration
          throw new Error("Invalid credentials");
        }

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
        } else if (role === "support_user") {
          supportStore.clearUser();
          supportStore.setLoginData(loginPayload);
          // supportStore.setId(id);
        }
        
        return res.data;
      } else {
        throw new Error("Login failed");
      }
    } catch (err: any) {
      // Clear stores on any error
      clearAllStores();
      throw err;
    }
  };

  const triggerLogout = () => {
    showLogoutModal.value = true;
  };

  const logoutUser = async () => {
    if (isLoggingOut.value) return;
    
    isLoggingOut.value = true;
    logoutError.value = ""; 

    try {
      // 1. Attempt the API call
      await api.post("api/auth/logout");

      // 2. Identify role before clearing state
      const role = store.role || userStore.role || supportStore.role;

      // 3. Clear local state ONLY after successful API response
      store.clearUser();
      userStore.clearUser();
      supportStore.clearUser();
      
      showLogoutModal.value = false;

      // 4. Redirect based on the captured role
      let redirectPath = '/';
      if (role === 'business_user') {
        redirectPath = '/business/auth/sign-in';
      } else if (role === 'support_user') {
        redirectPath = '/support/auth/sign-in';
      }

      await navigateTo(redirectPath, { replace: true });
      
    } catch (err: any) {
      // 5. ON FAILURE: No redirect, no local data wipe
      console.error("Logout failed:", err);
      
      // Capture the specific error message from the backend
      logoutError.value = err?.response?.data?.message || "Server error: Could not invalidate session. Please try again.";
      
    } finally {
      isLoggingOut.value = false;
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
      throw err;
    }
  };

  const handleRoleSwitch = async (targetPath: string) => {
    clearAllStores();
    await navigateTo(targetPath);
  };
  
  return {
    loginUser,
    registerBusiness,
    registerEndUser,
    registerSupportUser,
    logoutUser,
    triggerLogout,
    showLogoutModal,
    isLoggingOut,
    logoutError,
    handleRoleSwitch,
    clearAllStores,
  };
}