import express from "express";
import { TokenVerification } from "../utils/JWToken.js";
import {
  createChat,
  getChatByUserId,
  getAllChats,
  removeChat,
  SendMessage,
  createGroupChat,
  getGroupChats,
  getGroupChatByChatId,
  getChatById,
} from "../controllers/chatController.js";
import User from "../models/User.js";
const router = express.Router();

/* 
POST /api/chats
Creates chat with one person 
requires "friendId"*/
router.post("", TokenVerification, createChat);

/* 
GET /api/chats/users/:id
Finds all chats from te person with this ID */
router.get("/users", TokenVerification, getChatByUserId);

/* 
GET /api/chats
Gets all existing chats independent of user */
router.get("", getAllChats);

/* DELETE /api/chats/{:id}
Deletes chat based on id */
router.delete("/:id", removeChat);

/* POST /api/chats/:id/messages
sends message to another User
requires "chatId" and "content" */
router.post("/:id/messages", TokenVerification, SendMessage);

/* POST /api/chats/groups
Creates a group chat requires "participants:[]" */
router.post("/groups", TokenVerification, createGroupChat);

/* GET /api/chats/groups
Fetches all Chats */
router.get("/groups", TokenVerification, getGroupChats);

/* GET /api/chats/:id/group/
Gets group chat based on chat id */
router.get("/:id/groups", getGroupChatByChatId);

/* GET /api/chats/{:id}
Get chat based on id */
router.get("/:id", getChatById);

export default router;
