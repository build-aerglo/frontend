import axios from "axios";
import useDeviceFingerprint from "~/composables/device/useDeviceFingerprint";

export default function () {
  const review_api_url = useRuntimeConfig().public.reviewApiUrl;
  const { generateFingerprint } = useDeviceFingerprint();

  const api = axios.create({
    baseURL: review_api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });


  api.interceptors.request.use(async (config) => {
    const deviceId = await generateFingerprint();
    config.headers['X-Device-Id'] = deviceId;
    return config;
  });

  return api;
}
