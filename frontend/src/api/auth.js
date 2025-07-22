import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

export const signup = (userData) =>
  axios.post(`${API}/api/auth/signup`, userData)

export const login = (userData) =>
  axios.post(`${API}/api/auth/login`, userData)
