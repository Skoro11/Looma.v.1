import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
export async function createChat(req, res) {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;
    let chatId = "";

    if (!friendId) return res.status(400).json({ error: "Friend ID required" });

    let chat = await Chat.findOne({
      participants: { $all: [userId, friendId], $size: 2 },
    });

    /* console.log(chat); */
    if (!chat) {
      chat = await Chat.create({ participants: [userId, friendId] });

      chatId = chat._id;

      /* console.log("Chat Id is " + chatId); */
      const messages = await Message.find({ chatId })
        .populate("senderId", "username")
        .sort({ createdAt: 1 }); // oldest first
      return res
        .status(201)
        .json({ success: true, chat: chat._id, messages: messages });
    }
    if (chat) {
      chatId = chat._id;
      /* console.log("Chat Id is " + chatId); */
      const messages = await Message.find({ chatId })
        .populate("senderId", "username")
        .sort({ createdAt: 1 }); // oldest first

      return res
        .status(200)
        .json({ success: true, chat: chat._id, messages: messages });
    }
  } catch (error) {
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
export async function getGroupChat(req, res) {
  try {
    const { id } = req.user;

    const chats = await Chat.find({
      participants: id, // includes this user
      "participants.2": { $exists: true }, // has at least 3 participants
    }).populate("participants", "_id username");

    res.status(200).json({ chat: chats });
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
    res.status(200).json({ chat: chatsWithLastMessage });
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
      chat_id: chat._id,
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
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ error: "Missing fields" });
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

  res.status(200).json({ allChats });
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
