import axios from "axios";

export default function () {
  const config = useRuntimeConfig();
  const api_url = config.public.apiUrl;
  const api = axios.create({
    baseURL: api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return api;
}
