import axios from "axios";

export function useEndUserApi() {
  const api = axios.create({
    baseURL: "https://aerglotechnology.com/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const endpoints = {
    signin: "/auth/login",
    signup: "/User/end-user",
  };

  return { api, endpoints };
}
