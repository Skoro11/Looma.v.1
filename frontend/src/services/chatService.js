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
    const response = await axios.delete(`/chats/${chat_id}`);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function sendAMessage(currentChat, messageInput) {
  try {
    const response = await axios.post(`/chats/${currentChat}/messages`, {
      content: messageInput,
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function createGroupChat(participants, groupName) {
  try {
    const response = await axios.post("/chats/groups", {
      participants: participants,
      name: groupName,
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getGroupChat() {
  try {
    const response = await axios.get("/chats/groups");
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteGroupChat(chatId) {
  try {
    const response = await axios.delete("/chats/" + chatId);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getGroupChatWithChatId(groupChatId) {
  try {
    const response = await axios.get("/chats/" + groupChatId + "/groups");
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getAllUserChats() {
  try {
    const response = await axios.get("/chats/users");
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getChatBasedOnId(chatId) {
  try {
    const response = await axios.get("/chats/" + chatId);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
