import axios from "axios";
import { getAccessToken } from "./token";

const API_URL = "http://192.168.0.4:3000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
