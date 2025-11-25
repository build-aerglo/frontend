import axios from "axios";
export default function () {
  const business_api_url = useRuntimeConfig().public.businessApiUrl;
  const api = axios.create({
    baseURL: business_api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return api;
}
