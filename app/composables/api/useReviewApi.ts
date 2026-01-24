import axios from "axios";
export default function () {
  const search_api_url = useRuntimeConfig().public.reviewApiUrl ?? "https://reviewservice.aerglotechnology.com/";
  const api = axios.create({
    baseURL: search_api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return api;
}
