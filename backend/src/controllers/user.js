import User from "../models/User.js";
import { RefreshTokenCreation, TokenCreation } from "../utils/JWToken.js";
import { HashPassword, ComparePasswords } from "../utils/Bcrypt.js";
export async function RegisterUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "There are missing fields",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
    const hashedPassword = await HashPassword(password);

    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering",
      errorMessage: error.message,
    });
  }
}

export async function LoginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "There are missing fields",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userDbPassword = user.password;

    //Checks hashed password with the plain text password

    const isPasswordCorrrect = await ComparePasswords(password, userDbPassword);
    if (!isPasswordCorrrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    } else {
      const accessToken = TokenCreation(user._id, user.email, user.username);
      res.cookie("looma_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 1500 * 60 * 1000,
      });

      /* Adds refresh Token to the user object */
      const refreshToken = RefreshTokenCreation(user._id, user.email);
      user.refreshToken = refreshToken;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: {
          user: { _id: user._id, email: user.email, username: user.username },
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
      errorMessage: error.message,
    });
  }
}
export async function Logout(req, res) {
  try {
    // Clear the cookie with all the same options used when setting it
    res.clearCookie("looma_token", {
      httpOnly: true,
      secure: true, // must match login cookie
      sameSite: "none", // must match login cookie
      path: "/", // ensure path matches login cookie
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function GetAllNonFriends(req, res) {
  try {
    const { id } = req.user;

    const mainUser = await User.findById(id);
    //Gets all main user friends
    const friendsArray = mainUser.friends || [];

    const friendsAsStrings = friendsArray.map((friend) => friend.toString());

    const mainUserFriends = new Set(friendsAsStrings);

    // Excludes all the users that are mainUser friends and mainUser itself

    const allUsers = await User.find({}, "username _id");

    const currentUserId = id.toString();

    const nonFriends = allUsers.filter((user) => {
      const userId = user._id.toString();

      if (userId === currentUserId) return false;

      if (mainUserFriends.has(userId)) return false;

      return true;
    });

    return res.status(200).json({ success: true, users: nonFriends });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
}

export async function AddFriend(req, res) {
  try {
    const { id } = req.user;
    const { friendId } = req.body;
    const user = await User.findById(id);

    const existingFriend = user.friends.includes(friendId);
    const usernameFriend = await User.findById(friendId);
    const username = usernameFriend.username;
    if (!existingFriend) {
      user.friends.push(friendId);
      await user.save();
      res.status(201).json({
        success: true,
        user: { _id: friendId, username: username },
      });
    } else {
      res.status(200).json({ success: true, message: "Friend already exists" });
    }
  } catch (error) {
    console.log("Error with adding friend ", error.message);
  }
}

export async function RemoveFriend(req, res) {
  try {
    const { id } = req.params;
    const friendId = id;
    const user = req.user;

    const findUser = await User.findById(user.id);
    const friend = await User.findById(friendId);
    const removedFriend = findUser.friends.find(
      (friend) => friend._id.toString() === friendId
    );

    if (!removedFriend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    findUser.friends = findUser.friends.filter(
      (friend) => friend._id != friendId
    );

    await findUser.save();
    res.status(200).json({
      success: true,
      user: { _id: removedFriend, username: friend.username },
    });
  } catch (error) {
    console.log("Error with RemoveFriend ", error.message);
  }
}

export async function GetFriends(req, res) {
  try {
    const { id } = req.user;

    // Fetch user and populate friends
    const user = await User.findById(id).populate("friends", "username _id");

    // Make sure friends is always an array
    const friends = user && Array.isArray(user.friends) ? user.friends : [];

    res.status(200).json({
      success: true,
      friends: friends,
      message: "Friends fetched successfully",
    });
  } catch (error) {
    console.error("Error getting friends:", error.message);
    res.status(500).json({
      success: false,
      friends: { friends: [] },
      message: "Failed to get friends",
    });
  }
}

export async function DeleteAllUsers(req, res) {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "Deleted all users" });
  } catch (error) {
    console.log("Error with DeleteAllUsers", error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function searchUsers(req, res) {
  try {
    const { id } = req.user;
    const query = req.query.q?.trim();
    console.log("Main user id", id);

    if (!query) return res.json({ message: "No query", users: [] });

    const users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: id }, // exclude logged-in user
    })
      .select("-password")
      .limit(10);

    res.status(200).json({ users: users });
  } catch (error) {
    console.log("Search users error", error.message);
    res.status(500).json({ message: "Server error" });
  }
}
