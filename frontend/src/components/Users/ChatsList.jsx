import { useEffect } from "react";
import { getAllUserChats, getChatBasedOnId } from "../../services/chatService";
import { useChatContext } from "../../context/ChatContext";
import { useUserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import UserIcon from "../icons/UserIcon";
import { ChatButton } from "../buttons/ChatButton";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
export function ChatsList() {
  const isMobile = useMediaQuery("(max-width: 500px)");

  const {
    allUserChats,
    setAllUserChats,
    setMessages,
    setCurrentChat,
    setActiveUsername,
    setIsChatVisible,
    setListState,
  } = useChatContext();

  const { user } = useUserContext();

  let myId = user.id;
  async function fetchUserChats() {
    try {
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
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function openChat(chatId, username) {
    try {
      const response = await getChatBasedOnId(chatId);

      if (response) {
        setCurrentChat(chatId);
        setMessages(response.data.chat);
        setIsChatVisible(true);
        if (isMobile) {
          setListState("mobileChat");
        }
      }

      setActiveUsername(username);
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    fetchUserChats();
  }, []);
  return (
    <div className="overflow-y-scroll h-full scrollbar-hide md:max-h-115">
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
            <div
              key={item.chatId}
              className="my-4 md:rounded-2xl cursor-pointer pb-2  md:p-4 md:border  md:mx-4  md:bg-[var(--color-messages)] md:shadow-sm"
            >
              <li className="flex gap-4 items-center">
                <span className="min-w-1/7">
                  <UserIcon />
                </span>

                <div className="flex-1 max-w-5/7 ">
                  <div
                    onClick={() => {
                      openChat(item.chatId, item.name);
                    }}
                    className="flex justify-between items-center mb-1 cursor-pointer "
                  >
                    <span className="font-bold">{item.name}</span>
                    <span className="md:flex gap-2 hidden">
                      <ChatButton
                        onClick={() => openChat(item.chatId, item.name)}
                      />
                    </span>
                  </div>
                  <div className="text-gray-400 max-w-5/6 truncate ">
                    {item.lastMessage ? item.lastMessage.content : ""}
                  </div>
                </div>
              </li>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
