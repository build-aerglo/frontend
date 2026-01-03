import axios from "axios";

export default function () {
  const user_profile_api_url = useRuntimeConfig().public.apiUrl;
  
  const api = axios.create({
    baseURL: user_profile_api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add token interceptor (similar to useApi.ts)
  const store = useUser();
  
  api.interceptors.request.use(
    async function (config) {
      const user = store.getUser();
      
      if (user?.access_token) {
        config.headers.set("Authorization", `Bearer ${user.access_token}`);
      }
      
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return api;
}