import axios from "./axiosInstance";

export async function CheckToken() {
  try {
    const response = await axios.get(`/auth/me`);

    return response;
  } catch (error) {
    return error.message;
  }
}
