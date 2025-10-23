import { useUserContext } from "../context/UserContext";
import { useChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import { RemoveChat } from "../services/chatService";
import { getHoursAndMinutes } from "../utils/TimeConverter";
import { useEffect, useRef, useState } from "react";
import { sendAMessage } from "../services/chatService";
import { socket } from "../utils/socket";
import UserIcon from "./icons/UserIcon";
import { TrashButton } from "./buttons/TrashButton";
import { ArrowUpButton } from "./buttons/ArrowUpButton";
import { ArrowLeft } from "lucide-react";
import { EllipsisVertical } from "lucide-react";
export function ChatWindow() {
  const { user, setUser, setOtherUsers, setUserFriends } = useUserContext();
  const {
    messages,
    setMessages,
    currentChat,
    setCurrentChat,
    messageInput,
    setMessageInput,
    activeUsername,
    group,
    setGroup,
    listState,
    setListState,
    isChatVisible,
    setIsChatVisible,
    allUserChats,
    setAllUserChats,
    setIsMobileChatVisible,
  } = useChatContext();
  const [areSettingsOpen, setAreSettingsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  async function sendMessage() {
    try {
      const response = await sendAMessage(currentChat, messageInput);
      if (response.status === 200) {
        const newMessage = {
          chatId: currentChat,
          senderId: { _id: user.id, username: user.username },
          content: messageInput,
          createdAt: response.data.message.createdAt,
        };
        socket.emit("sendMessage", newMessage);
      }
      setMessageInput("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async function DeleteChat(chat_id) {
    const response = await RemoveChat(chat_id);
    if (response.data.success === true) {
      toast.success("Chat deleted successfully");

      let filtered = group.filter((u) => u._id !== chat_id);
      setGroup(filtered);
      const allChats = allUserChats.filter((item) => item.chatId !== chat_id);
      setAllUserChats(allChats);
      setCurrentChat();

      setMessages([]);
      setCurrentChat();
      setIsChatVisible(false);
    }
  }

  return (
    <div className="">
      <div className="sticky top-0 md:static w-full md:w-auto md:mx-2 bg-[var(--color-messages)] md:rounded-xl md:mb-2 py-2 px-3 flex items-center justify-between shadow-sm z-[50]">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => {
              setListState("chats");
              setAreSettingsOpen(false);
              setIsMobileChatVisible(false);
            }}
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <UserIcon className="w-6 h-6 text-white" />
          <span className="font-medium text-white truncate">
            {activeUsername}
          </span>
        </div>

        {/* Right section: trash / settings */}
        <div className="flex items-center gap-2 relative">
          {/* Trash button for desktop */}
          <span className="hidden md:block">
            <TrashButton onClick={() => DeleteChat(currentChat)} />
          </span>

          {/* Mobile settings button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setAreSettingsOpen((prev) => !prev)}
            aria-label="Settings"
          >
            <EllipsisVertical size={24} className="text-white" />
          </button>

          {/* Mobile settings dropdown */}
          {areSettingsOpen && (
            <div className="absolute top-full right-0 mt-2 p-2 bg-[var(--color-accent)] rounded shadow-lg min-w-[120px] z-[60]">
              <button
                className="w-full text-left px-2 py-1 hover:bg-white/10 rounded transition-colors"
                onClick={() => {
                  DeleteChat(currentChat);
                  setListState("chats");
                  setIsMobileChatVisible(false);
                }}
              >
                Delete chat
              </button>
            </div>
          )}
        </div>
      </div>

      <ul className="overflow-y-scroll h-screen scrollbar-hide  md:max-h-100 bg-[var(--color-body)]  md:pt-0   ">
        {messages.map((message) => (
          <li key={message._id}>
            {/* <div>{JSON.stringify(message)}</div> */}
            {message.senderId._id === user.id ||
            message.senderId === user.id ? (
              <div className="ml-7 text-right ">
                <div className="flex justify-end my-2">
                  <p className="bg-[var(--color-primary)] w-max py-1 px-3 mr-2 rounded-lg text-white text-left">
                    {message.content}
                  </p>
                </div>
                <span className="mr-2">
                  {getHoursAndMinutes(message.createdAt)}{" "}
                </span>
              </div>
            ) : (
              <div className="text-left">
                <h1 className="">
                  <span className="font-bold"></span>
                </h1>
                <div className="flex justify-start my-2">
                  <p className="bg-[var(--color-messages)] w-max py-1 px-3 ml-2 rounded-lg text-white text-left">
                    {message.content}
                  </p>
                </div>
                <span className="ml-2">
                  {getHoursAndMinutes(message.createdAt)}{" "}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </li>
        ))}
      </ul>

      <div className="sticky md:static bg-[var(--color-body)] bottom-0 w-full flex px-2 py-3 ">
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              if (messageInput?.trim()) sendMessage();
            }
          }}
          type="text"
          className="flex-1 py-2 px-3 mr-2 text-white outline-none bg-[var(--color-messages)] rounded-xl"
          placeholder="Message..."
        />
        <ArrowUpButton onClick={() => sendMessage()} />
      </div>
    </div>
  );
}
