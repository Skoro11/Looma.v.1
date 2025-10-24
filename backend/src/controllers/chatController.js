import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import logger from "../utils/logger.js";
export async function createChat(req, res) {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;
    let chatId = "";
    if (!friendId) {
      logger.warn(`User ${userId} tried to create chat without friendId`);
      return res.status(400).json({ error: "Friend ID required" });
    }

    logger.info(
      `User ${userId} is attempting to create/find chat with friend ${friendId}`
    );
    let chat = await Chat.findOne({
      participants: { $all: [userId, friendId], $size: 2 },
    });

    if (!chat) {
      chat = await Chat.create({ participants: [userId, friendId] });
      logger.info(
        `New chat created with ID ${chatId} for users ${userId} and ${friendId}`
      );
      chatId = chat._id;

      const messages = await Message.find({ chatId })
        .populate("senderId", "username")
        .sort({ createdAt: 1 }); // oldest first
      return res
        .status(201)
        .json({ success: true, chatId: chat._id, messages: messages });
    }
    if (chat) {
      chatId = chat._id;
      logger.info(
        `Existing chat found with ID ${chatId} for users ${userId} and ${friendId}`
      );
      const messages = await Message.find({ chatId })
        .populate("senderId", "username")
        .sort({ createdAt: 1 }); // oldest first

      return res
        .status(200)
        .json({ success: true, chatId: chat._id, messages: messages });
    }
  } catch (error) {
    logger.error(
      `Error creating/finding chat for users ${userId} and ${friendId}: ${error.message}`
    );
    res.status(500).json({ success: false, errorMessage: error.message });
  }
}
export async function createGroupChat(req, res) {
  try {
    const { id } = req.user;
    const { participants, name } = req.body;

    const participantsArray = [participants, id].flat(Infinity);
    const sortedParticipants = participantsArray.sort();
    /* console.log(group); */
    const existingChat = await Chat.findOne({
      participants: {
        $all: sortedParticipants,
        $size: sortedParticipants.length,
      },
    });

    if (existingChat) {
      return res.status(400).json({
        success: false,
        message: "Chat with these participants already exists",
        chatId: existingChat._id,
      });
    }

    const chat = await Chat.create({
      name: name,
      participants: sortedParticipants,
    });

    return res.status(201).json({
      success: true,
      chat,
      message: "Group successfully created",
    });
  } catch (error) {
    console.log("Error with create group chat", error.message);
  }
}
export async function getGroupChats(req, res) {
  try {
    const { id } = req.user;

    const chats = await Chat.find({
      participants: id, // includes this user
      "participants.2": { $exists: true }, // has at least 3 participants
    }).populate("participants", "_id username");

    res.status(200).json({ chats: chats });
  } catch (error) {
    console.log("Error with gettingGroupChat", error.message);
  }
}
export async function getChatByUserId(req, res) {
  try {
    const userId = req.user.id;

    const userChats = await Chat.find({ participants: userId }).populate(
      "participants",
      "username _id"
    );
    const chatsWithLastMessage = await Promise.all(
      userChats.map(async (chat) => {
        const lastMsg = await Message.find({ chatId: chat._id })
          .sort({ createdAt: -1 })
          .limit(1)
          .populate("senderId", "username _id")
          .lean(); // <-- lean here too

        return {
          _id: chat._id,
          name: chat.name || undefined,
          participants: chat.participants,
          lastMessage: lastMsg[0] || null,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        };
      })
    );
    res.status(200).json({ chats: chatsWithLastMessage });
  } catch (error) {
    console.log("Error with user chats ", error.message);
  }
}
export async function getGroupChatByChatId(req, res) {
  try {
    const { id } = req.params;
    const chat = await Chat.findById({ _id: id });

    const messages = await Message.find({ chat_id: id });
    console.log("Parameters id", chat);
    res.status(200).json({
      success: true,
      chatId: chat._id,
      name: chat.name,
      messages: messages,
    });
  } catch (error) {
    console.log("GetGroupChatByChatId Error", error.message);
  }
}
export async function removeChat(req, res) {
  try {
    const { id } = req.params;
    /* console.log("Remove Chat Id", id); */
    const removeChat = await Chat.findByIdAndDelete(id);
    console.log("Removed chat", removeChat._id);
    const removedChatId = removeChat._id;
    const removeMessages = await Message.deleteMany({
      chatId: removedChatId,
    });
    console.log("Deleted ", removeMessages);
    if (!removeChat) {
      return res.status(404).json({ message: "Chat is not found" });
    }

    res.status(200).json({ success: true, removedChat: removeChat });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
}

export async function SendMessage(req, res) {
  try {
    const senderId = req.user.id;
    const chatId = req.params.id;
    const { content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ message: "No Message Data" });
    }
    const chat = await Chat.findById(chatId);

    if (!chat || !chat.participants.includes(senderId)) {
      return res
        .status(403)
        .json({ error: "You cannot send a message to this chat" });
    }

    const receiverId = chat.participants.find(
      (id) => id.toString() !== senderId
    );

    const message = await Message.create({
      chatId,
      senderId,
      receiverId,
      content,
    });

    chat.lastMessage = message._id;
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAllChats(req, res) {
  const allChats = await Chat.find({});

  res.status(200).json({ chats: allChats });
}

export async function getChatById(req, res) {
  try {
    const { id } = req.params;

    const messages = await Message.find({ chatId: id })
      .populate("senderId", "_id username")
      .select("senderId content createdAt receiverId chatId");

    res.status(200).json({ chat: messages });
  } catch (error) {
    console.log("Error getChatsByID", error.message);
  }
}
