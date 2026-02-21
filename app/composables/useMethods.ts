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
  const userStore = useUser();
  const api = useApi();

  // ===============================
  // 🔥 CENTRAL ERROR NORMALIZER
  // ===============================
  const normalizeError = (err: any) => {
    const data = err?.response?.data || err?.data || {};
    let message = "Something went wrong";
    let code = "unknown_error";
    console.error("Error Response Data:", err.response)
    // Handle ASP.NET validation errors (registration)
    if (data.errors && typeof data.errors === 'object') {
      const errorMessages = Object.values(data.errors)
        .flat()
        .filter((e: any) => typeof e === 'string');
      
      if (errorMessages.length > 0) {
        message = String(errorMessages[0]); // Show first error
        code = "validation_error";
      } else if (data.title) {
        message = data.title;
        code = "validation_error";
      }
    }
    // Handle custom API errors (login, etc)
    else if (data.message) {
      message = data.message;
      code = data.error || "api_error";
    }
    // Fallback
    else if (err?.message && !err.message.includes('status code')) {
      message = err.message;
      code = err.code || "unknown_error";
    }

    const status = err?.response?.status ?? err?.status ?? 500;

    return { message, code, status };
  };

  const clearAllStores = () => {
    store.clearUser();
    userStore.clearUser();
    supportStore.clearUser();
  };

  // ===============================
  // LOGIN
  // ===============================
  const loginUser = async (
    data: LoginData,
    expectedRole?: "business_user" | "end_user" | "support_user"
  ) => {
    try {
      clearAllStores();

      const res = await api.post("api/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { access_token, id_token, roles, id } = res.data;
      const role = roles[0];

      if (expectedRole && role !== expectedRole) {
        clearAllStores();
        throw {
          message: "Invalid credentials",
          code: "invalid_credentials",
          status: 401,
        };
      }

      const loginPayload = {
        access_token,
        id_token,
        role,
        expires: new Date(Date.now() + 23 * 60 * 60 * 1000),
      };

      if (role === "business_user") {
        store.setLoginData(loginPayload);
        store.setId(id);
      } else if (role === "end_user") {
        userStore.setLoginData(loginPayload);
        userStore.setId(id);
      } else if (role === "support_user") {
        supportStore.setLoginData(loginPayload);
      }

      return res.data;
    } catch (err: any) {
      clearAllStores();
      throw normalizeError(err);
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const triggerLogout = () => {
    showLogoutModal.value = true;
  };

  const logoutUser = async () => {
    if (isLoggingOut.value) return;

    isLoggingOut.value = true;
    logoutError.value = "";

    try {
      await api.post("api/auth/logout");

      const role = store.role || userStore.role || supportStore.role;

      clearAllStores();
      showLogoutModal.value = false;

      let redirectPath = "/";
      if (role === "business_user") {
        redirectPath = "/business/auth/sign-in";
      } else if (role === "support_user") {
        redirectPath = "/support/auth/sign-in";
      }

      await navigateTo(redirectPath, { replace: true });
    } catch (err: any) {
      logoutError.value = normalizeError(err).message;
    } finally {
      isLoggingOut.value = false;
    }
  };

  // ===============================
  // REGISTRATIONS
  // ===============================
  const registerBusiness = async (data: BusinessUser) => {
    try {
      const res = await api.post("api/User/business", data);
      const user: BusinessUserResponse = res.data;
      store.setUserData(user);
      return user;
    } catch (err: any) {
      throw normalizeError(err);
    }
  };

  const registerSupportUser = async (data: SupportUser) => {
    try {
      const res = await api.post("api/User/support", data);
      const user: SupportUser = res.data;
      supportStore.setUserData(user);
      return user;
    } catch (err: any) {
      throw normalizeError(err);
    }
  };

  const registerEndUser = async (data: EndUser) => {
    try {
      const res = await api.post("api/User/end-user", data);
      const endUser: EndUser = res.data;
      userStore.setUserData(endUser);
      return endUser;
    } catch (err: any) {
      throw normalizeError(err);
    }
  };

  // ===============================
  // PASSWORD METHODS
  // ===============================
  const requestResetPassword = async (id: string, type = "email") => {
    try {
      const res = await api.post("api/password/request-password-reset", {
        id,
        type,
      });
      return { ok: true, data: res.data };
    } catch (err: any) {
      return { ok: false, error: normalizeError(err) };
    }
  };

  const resetPassword = async (id: string, password: string) => {
    try {
      const res = await api.post("api/password/reset-password", {
        id,
        password,
      });
      return { ok: true, data: res.data };
    } catch (err: any) {
      return { ok: false, error: normalizeError(err) };
    }
  };

  const updatePassword = async (
    email: string,
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      const res = await api.post("api/password/update-password", {
        email,
        oldPassword,
        newPassword,
      });
      return { ok: true, data: res.data };
    } catch (err: any) {
      return { ok: false, error: normalizeError(err) };
    }
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
    clearAllStores,
    requestResetPassword,
    resetPassword,
    updatePassword,
  };
}
