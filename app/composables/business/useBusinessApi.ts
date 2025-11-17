import axios from "axios";

export default function () {
  const business_api_url = useRuntimeConfig().public.businessApiUrl;
  const api = axios.create({
    // @ts-ignore
    baseURL: business_api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return api;
}
