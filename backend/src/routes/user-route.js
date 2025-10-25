import express from "express";
import {
  AddFriend,
  DeleteAllUsers,
  GetAllNonFriends,
  GetFriends,
  RemoveFriend,
  searchUsers,
} from "../controllers/user.js";
const router = express.Router();
import { TokenVerification } from "../utils/JWToken.js";

/* GET /users/exclude-me 
Retrieves all users except the current authenticated user (Gets authenticated user ID from token)*/
router.get("/exclude-me", TokenVerification, GetAllNonFriends);

/* POST /users/friends
Adds a new friend to a user */
router.post("/friends", TokenVerification, AddFriend);

/* DELETE /users/friends/remove/{:id}
Remove friend from identified user */
router.delete("/friends/:id", TokenVerification, RemoveFriend);

/* GET /users/friends/all
Get all friends from the user */
router.get("/friends", TokenVerification, GetFriends);

/* POST /users/search
Searches users based on query it excludes me */
router.get("/search", TokenVerification, searchUsers);

router.delete("", DeleteAllUsers);

export default router;
