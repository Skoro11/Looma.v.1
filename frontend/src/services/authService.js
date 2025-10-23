import axios from "./axiosInstance";
import { handleApiError } from "../utils/handleApiError";
export async function CheckToken() {
  try {
    const response = await axios.get(`/auth/me`);

    return response;
  } catch (error) {
    return error.message;
  }
}

export async function LoginUser(email, password) {
  try {
    const { data } = await axios.post(`/auth/login`, {
      email: email,
      password: password,
    });
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function RegisterUser(username, email, password) {
  try {
    const { data } = await axios.post(`/auth/register`, {
      username: username,
      email: email,
      password: password,
    });

    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function LogoutUser() {
  try {
    const response = await axios.post("/auth/logout", {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
