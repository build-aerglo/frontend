import axios, { type AxiosRequestHeaders } from "axios";
import useUser from "./useUser";

export default function () {
  const api_url = useRuntimeConfig().public.apiUrl;
  
  const api = axios.create({
    baseURL: api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const store = useUser();

  api.interceptors.request.use(
    async function (config) {
      const user = store.getUser();

      if (!user?.access_token || !user?.expires) {
        return config;
      }

      const now = new Date();
      const expires = new Date(user.expires);
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      if (expires <= oneHourFromNow) {
        try {
          const response = await axios.post(
            `${api_url}/api/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
              },
            }
          );

          const { access_token, id_token, expires_in, roles } = response.data;
          const role = roles[0];

          store.setLoginData({
            access_token,
            id_token,
            role,
            expires: new Date(Date.now() + 23 * 60 * 60 * 1000),
          });

          config.headers.set("Authorization", `Bearer ${access_token}`);
        } catch (err) {
          console.error("Token refresh failed", err);
        }
      } else {
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
