import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("blinkshield_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetcher(request) {
  const response = await request;
  return response.data.data;
}

