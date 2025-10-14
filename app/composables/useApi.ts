import axios from "axios";

export default function () {
  const api_url = useRuntimeConfig().public.apiUrl;
  const api = axios.create({
    // @ts-ignore
    baseURL: api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return api;
}
