import { useChatContext } from "../../context/ChatContext";
import { useUserContext } from "../../context/UserContext";
import { getHoursAndMinutes } from "../../utils/TimeConverter";
import { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { RemoveChat } from "../../api/chat";
import { ArrowLeft, UserIcon, EllipsisVertical } from "lucide-react";
import SendMessageButton from "../buttons/SendMessageButton";
export function MobileChat() {
  const { user } = useUserContext();
  const {
    isMobileChatVisible,
    setIsMobileChatVisible,
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
    setIsChatVisible,
    allUserChats,
    setAllUserChats,
    setChatSettingsVisible,
    chatSettingsVisible,
  } = useChatContext();

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  async function DeleteChat(chat_id) {
    try {
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
        setIsMobileChatVisible(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div>
      {/* Chat Header */}
      <div className="z-50 fixed w-full bg-[var(--color-messages)] mb-2 py-5 pl-3 flex items-center justify-between">
        <div className="flex items-center">
          <span className="flex items-center mr-2">
            <button
              className="mr-2"
              onClick={() => {
                setListState("chats");
                setIsMobileChatVisible(false);
                setChatSettingsVisible(false);
              }}
            >
              <ArrowLeft />
            </button>
            <UserIcon />
          </span>
          <span>{activeUsername}</span>
        </div>

        <div className="mr-4 flex">
          <button onClick={() => setChatSettingsVisible((prev) => !prev)}>
            <EllipsisVertical />
          </button>
          {chatSettingsVisible && (
            <div className="fixed bg-[var(--color-accent)] top-15 right-2 p-2 rounded">
              <ul>
                <li className="mb-2">
                  <button
                    onClick={() => {
                      setIsChatVisible(false);
                      setListState("chats");
                      setChatSettingsVisible(false);
                      DeleteChat(currentChat);
                    }}
                  >
                    Delete chat
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Messages List */}
      <ul className="pt-16 pb-16 overflow-y-auto h-full">
        {messages.map((message) => (
          <li key={message._id}>
            {message.senderId._id === user.id ||
            message.senderId === user.id ? (
              <div className="text-right">
                <div className="flex justify-end my-2">
                  <p className="bg-[var(--color-primary)] w-max py-1 px-3 mr-2 rounded-lg text-white">
                    {message.content}
                  </p>
                </div>
                <span className="mr-2">
                  {getHoursAndMinutes(message.createdAt)}
                </span>
              </div>
            ) : (
              <div className="text-left">
                <div className="flex justify-start my-2">
                  <p className="bg-[var(--color-messages)] w-max py-1 px-3 ml-2 rounded-lg text-white">
                    {message.content}
                  </p>
                </div>
                <span className="ml-2">
                  {getHoursAndMinutes(message.createdAt)}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </li>
        ))}
      </ul>
      {/* Input Box */}
      <div className="bg-[var(--color-body)] z-50 bottom-0 fixed w-full flex px-2 py-3">
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          type="text"
          className="flex-1 py-2 px-3 mr-2 text-white outline-none bg-[var(--color-messages)] rounded-xl"
          placeholder="Message..."
        />
        <SendMessageButton />
      </div>
    </div>
  );
}
