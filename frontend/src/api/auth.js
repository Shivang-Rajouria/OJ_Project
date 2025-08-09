import { backendAxios } from "./axios";

export const signup = (data) => backendAxios.post("/api/auth/signup", data);
export const login = (data) => backendAxios.post("/api/auth/login", data);
