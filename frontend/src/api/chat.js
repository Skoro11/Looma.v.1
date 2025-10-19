import { handleApiError } from "../utils/handleApiError";
import axios from "./axiosInstance";

export async function CreateOrOpenChat(friend_id) {
  try {
    const response = await axios.post(`/chats`, {
      friendId: friend_id,
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function RemoveChat(chat_id) {
  try {
    const response = await axios.delete(`/chats/delete/${chat_id}`);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function sendAMessage(currentChat, messageInput) {
  try {
    const response = await axios.post(`/chats/message`, {
      chatId: currentChat,
      content: messageInput,
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
