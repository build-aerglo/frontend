import axios from "axios";
export default function () {
  const business_api_url = useRuntimeConfig().public.notification_url;
  const api = axios.create({
    baseURL: business_api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return api;
}
