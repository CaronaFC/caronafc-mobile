import axios from "axios";
import { getAccessToken } from "./token";
import { Alert } from "react-native";
import { logoutRef } from "../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.103:3000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert("Erro de autenticação", "Por favor, realize o login novamente.");
      // Just logout - navigation will happen automatically via conditional rendering
      logoutRef.current?.();
    }
    return Promise.reject(error);
  }
);
