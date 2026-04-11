import axios from "axios";
import { applyAuthInterceptors } from '~/composables/useApiInterceptors'

export default function () {
  const config = useRuntimeConfig();
  const business_api_url = config.public.notification_url;

  const api = axios.create({
    baseURL: business_api_url,
    // withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": config.public.notificationApiKey, 
    },
  });
  applyAuthInterceptors(api)
  return api;
}