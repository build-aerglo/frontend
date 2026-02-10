import axios, { type AxiosRequestHeaders } from "axios";
import useUser from "./useUser";
import useBusinessUser from "./business/useBusinessUser";
import useSupportUser from "./support/useSupportUser";

export default function () {
  const api_url = useRuntimeConfig().public.apiUrl;
  
  const api = axios.create({
    baseURL: api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const userStore = useUser();
  const businessStore = useBusinessUser();
  const supportStore = useSupportUser();

  // Request interceptor for adding auth token
  api.interceptors.request.use(
    async function (config) {
      // Determine which store has an active session
      let activeUser = null;
      let activeStore = null;

      if (businessStore.isAuthenticated && businessStore.accessToken) {
        activeUser = {
          access_token: businessStore.accessToken,
          expires: businessStore.expires_in
        };
        activeStore = businessStore;
      } else if (userStore.isAuthenticated && userStore.accessToken) {
        activeUser = {
          access_token: userStore.accessToken,
          expires: userStore.expires_in
        };
        activeStore = userStore;
      } else if (supportStore.isAuthenticated && supportStore.accessToken) {
        activeUser = {
          access_token: supportStore.accessToken,
          expires: supportStore.expires_in
        };
        activeStore = supportStore;
      }

      if (!activeUser?.access_token || !activeUser?.expires) {
        return config;
      }

      const now = new Date();
      const expires = new Date(activeUser.expires);
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // Auto-refresh token if expiring within 1 hour
      if (expires <= oneHourFromNow) {
        try {
          const response = await axios.post(
            `${api_url}/api/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${activeUser.access_token}`,
              },
            }
          );

          const { access_token, id_token, expires_in, roles } = response.data;
          const role = roles[0];

          const newLoginData = {
            access_token,
            id_token,
            role,
            expires: new Date(Date.now() + 23 * 60 * 60 * 1000),
          };

          // Update the correct store
          if (activeStore) {
            activeStore.setLoginData(newLoginData);
          }

          config.headers.set("Authorization", `Bearer ${access_token}`);
        } catch (err) {
          console.error("Token refresh failed", err);
          // Token refresh failed - will be caught by response interceptor
        }
      } else {
        config.headers.set("Authorization", `Bearer ${activeUser.access_token}`);
      }

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling 401 errors
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If 401 Unauthorized and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Clear all stores and redirect to login
        businessStore.clearUser();
        userStore.clearUser();
        supportStore.clearUser();

        const toast = useToast();
        toast.add({
          severity: 'error',
          summary: 'Session Expired',
          detail: 'Your session has expired. Please log in again.',
          life: 4000
        });

        // Redirect to appropriate login page
        // You can enhance this to detect which login page based on current route
        await navigateTo('/', { replace: true });
      }

      return Promise.reject(error);
    }
  );

  return api;
}