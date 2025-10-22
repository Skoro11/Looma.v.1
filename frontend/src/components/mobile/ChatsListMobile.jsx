import { getAllUserChats, getChatBasedOnId } from "../../api/chat";
import { useChatContext } from "../../context/ChatContext";
import { useUserContext } from "../../context/UserContext";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatsListMobile() {
  const {
    setIsMobileChatVisible,
    allUserChats,
    setAllUserChats,
    setMessages,
    messages,
    setCurrentChat,
    setActiveUsername,
    setListState,
    setIsChatVisible,
  } = useChatContext();

  const { user } = useUserContext();
  let myId = user.id;

  async function fetchUserChats() {
    const response = await getAllUserChats();
    const chats = response.data.chat;
    const sideBarChats = chats.map((chat) => {
      if (chat.participants.length === 2) {
        const other = chat.participants.find((item) => item._id !== myId);
        const lastMessage = chat.lastMessage;
        return {
          chatId: chat._id,
          name: other.username,
          lastMessage: lastMessage || "",
        };
      } else {
        const lastMessage = chat.lastMessage;
        return {
          chatId: chat._id,
          name: chat.name,
          lastMessage: lastMessage || "",
        };
      }
    });

    setAllUserChats(sideBarChats);
  }
  useEffect(() => {
    fetchUserChats();
  }, []);
  async function openChat(chatId, username) {
    const response = await getChatBasedOnId(chatId);
    if (response) {
      setCurrentChat(chatId);
      setMessages(response.data.chat);
      setIsMobileChatVisible(true);
      setListState("none");
    }
    setActiveUsername(username);
  }
  return (
    <AnimatePresence>
      {allUserChats.map((item) => (
        <motion.div
          key={item.chatId}
          initial={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          exit={{ opacity: 0 }}
          className="rounded-2xl my-4 cursor-pointer"
          onClick={() => openChat(item.chatId, item.name)}
        >
          <li className="flex gap-4 items-center">
            {/* Avatar / Icon */}
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>

            {/* Content */}
            <div>
              <span className="font-bold">{item.name}</span>
              <div className="text-gray-400">
                {item.lastMessage ? item.lastMessage.content : ""}
              </div>
            </div>
          </li>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
