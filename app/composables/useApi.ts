import axios, { type AxiosRequestHeaders } from "axios";
import { applyAuthInterceptors } from '~/composables/useApiInterceptors'
export default function () {
  const api_url = useRuntimeConfig().public.apiUrl;
  
  const api = axios.create({
    baseURL: api_url,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  applyAuthInterceptors(api)
  return api;
}