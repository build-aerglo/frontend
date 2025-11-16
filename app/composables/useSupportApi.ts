import axios from "axios";

export function useSupportApi() {
  const api = axios.create({
    baseURL: "https://aerglotechnology.com/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const endpoints = {
    signin: "/auth/login",
    signup: "/User/support",
  };

  return { api, endpoints };
}
