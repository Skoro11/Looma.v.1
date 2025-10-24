import { handleApiError } from "../utils/handleApiError";
import axios from "./axiosInstance";

export async function getNonFriends() {
  try {
    const response = await axios.get(`/users/exclude-me`);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchUserFriends() {
  try {
    const response = await axios.get(`/users/friends`);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function addFriend(userId) {
  try {
    const response = await axios.post("/users/friends", {
      friendId: userId,
    });
    return response;
  } catch (error) {
    throw new Error(handleApiError(error, "Could not add friend."));
  }
}

export async function removeFriend(userId) {
  try {
    const response = await axios.delete("/users/friends/" + userId);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
