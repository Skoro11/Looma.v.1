import { sendAMessage } from "../../api/chat";
import { useChatContext } from "../../context/ChatContext";
import { useUserContext } from "../../context/UserContext";
/* import { socket } from "../../utils/socket"; */
function SendMessageButton() {
  const { currentChat, messageInput, setMessageInput } = useChatContext();
  const { user } = useUserContext();
  async function sendMessage() {
    const response = await sendAMessage(currentChat, messageInput);
    if (response.status === 200) {
      const newMessage = {
        chatId: currentChat,
        senderId: { _id: user.id, username: user.username },
        content: messageInput,
        createdAt: response.data.message.createdAt,
      };
      /*      socket.emit("sendMessage", newMessage); */
    }
    setMessageInput("");
  }
  return (
    <button
      onClick={() => sendMessage()}
      className="bg-[var(--color-primary)] p-2 rounded-xl cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
        />
      </svg>
    </button>
  );
}

export default SendMessageButton;
