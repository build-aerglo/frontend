import axios from "axios";
export default function () {
  const review_api_url = useRuntimeConfig().public.reviewApiUrl;
  const api = axios.create({
    baseURL: review_api_url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return api;
}
