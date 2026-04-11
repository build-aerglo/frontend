import axios from "axios";
import { applyAuthInterceptors } from '~/composables/useApiInterceptors'
export default function () {
  const search_api_url = useRuntimeConfig().public.reviewApiUrl ?? "https://reviewservice.aerglotechnology.com/";
  const api = axios.create({
    baseURL: search_api_url,
    // withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  applyAuthInterceptors(api)
  return api;
}
