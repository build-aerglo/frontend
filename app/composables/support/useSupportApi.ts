import axios from "axios";

export default function () {
  const support_api_url = useRuntimeConfig().public.supportApiUrl;
  const api = axios.create({
    // @ts-ignore
    baseURL: support_api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return api;
}
