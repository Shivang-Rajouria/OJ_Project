import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "";
const COMPILER = import.meta.env.VITE_COMPILER_URL || "";

const backendInstance = axios.create({
  baseURL: BACKEND,
  headers: { "Content-Type": "application/json" }
});

// auto attach token
backendInstance.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export { backendInstance as backendAxios, COMPILER };
