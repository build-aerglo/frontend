import axios from "axios";
import { applyAuthInterceptors } from '~/composables/useApiInterceptors'
export default function () {
  const search_api_url = useRuntimeConfig().public.reviewApiUrl ?? "https://reviewservice-api-cc.azurewebsites.net/";
  // const search_api_url = "http://localhost:5187";
  const api = axios.create({
    baseURL: search_api_url,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  applyAuthInterceptors(api)
  return api;
}
