import axios from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export const loginUser = (payload: LoginPayload) => {
  return API.post<LoginResponse>("/auth/login", payload);
};