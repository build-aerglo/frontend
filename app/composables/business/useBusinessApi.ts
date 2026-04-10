import axios from "axios";
import { applyAuthInterceptors } from '~/composables/useApiInterceptors'
export default function () {
  const business_api_url = useRuntimeConfig().public.businessApiUrl;
  const api = axios.create({
    baseURL: business_api_url,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  applyAuthInterceptors(api)
  return api;
}
