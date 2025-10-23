import { useChatContext } from "../../context/ChatContext";
import { CreateOrOpenChat } from "../../services/chatService";
import { toast } from "react-toastify";
/* import { socket } from "../../utils/socket"; */
export function StartChatButton({ itemId, itemUsername }) {
  const {
    setIsChatVisible,
    setMessages,
    setCurrentChat,
    setActiveUserId,
    setActiveUsername,
  } = useChatContext();
  async function StartChat(friend_id) {
    try {
      const response = await CreateOrOpenChat(friend_id);
      if (response.data.success === true) {
        toast.success("Chat successfully created");
        setIsChatVisible(true);
      }
      setActiveUserId(friend_id);
      setActiveUsername(itemUsername);
      const chatId = response.data.chat;
      setCurrentChat(chatId);
      /*   socket.emit("joinChat", chatId); */
      const messages = response.data.messages;
      setMessages(messages);
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <button className="cursor-pointer" onClick={() => StartChat(itemId)}>
      {" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="var(--color-logo)"
        className="size-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
        />
      </svg>
    </button>
  );
}

export default StartChatButton;
