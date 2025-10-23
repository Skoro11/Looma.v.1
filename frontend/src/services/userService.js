import { handleApiError } from "../utils/handleApiError";
import axios from "./axiosInstance";

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

export async function getNonFriends() {
  try {
    const response = await axios.get(`/user/others`);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchUserFriends() {
  try {
    const response = await axios.get(`/user/friends/all`);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function addFriend(userId) {
  try {
    const response = await axios.post("/user/friends/add", {
      friendId: userId,
    });
    return response;
  } catch (error) {
    throw new Error(handleApiError(error, "Could not add friend."));
  }
}

export async function removeFriend(userId) {
  try {
    const response = await axios.delete("/user/friends/remove/" + userId);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
