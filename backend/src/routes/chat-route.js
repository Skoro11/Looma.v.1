import express from "express";
import { TokenVerification } from "../utils/JWToken.js";
import {
  createChat,
  getChatByUserId,
  getAllChats,
  removeChat,
  SendMessage,
  createGroupChat,
  getGroupChat,
  getGroupChatByChatId,
  getChatById,
} from "../controllers/chatController.js";
import User from "../models/User.js";
const router = express.Router();

/* 
POST /chats 
Creates chat with one person 
requires "friendId"*/
router.post("", TokenVerification, createChat);

/* 
GET /chats/user
Finds all chats from te person with this ID */
router.get("/user", TokenVerification, getChatByUserId);

/* 
GET /chats/all
Gets all existing chats independent of user */
router.get("/all", getAllChats);

/* DELETE /chats/delete/{:id}
Deletes chat based on id */
router.delete("/delete/{:id}", removeChat);

/* POST /chats/message
sends message to another User
requires "chatId" and "content" */
router.post("/message", TokenVerification, SendMessage);

/* POST /chats/createGroupChat
Creates a group chat requires "participants:[]" */
router.post("/group", TokenVerification, createGroupChat);

/* GET /chats/group/all
Fetches all Chats */
router.post("/group/all", TokenVerification, getGroupChat);

/* GET /chats/group/{:id}
Gets group chat based on chat id */
router.get("/group/{:id}", getGroupChatByChatId);
export default router;

/* GET /chats/{:id}
Get chat based on id */
router.get("/{:id}", getChatById);
