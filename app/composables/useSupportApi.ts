import axios from "axios";

export function useSupportApi() {
  const api = axios.create({
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
