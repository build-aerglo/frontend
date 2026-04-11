import axios from "axios";
import { applyAuthInterceptors } from '~/composables/useApiInterceptors'

export default function () {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.businessApiUrl as string,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": config.public.businessApiKey as string, 
    },
  });

  applyAuthInterceptors(api);
  return api;
}