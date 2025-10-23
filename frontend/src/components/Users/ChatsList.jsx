import { useEffect } from "react";
import { getAllUserChats, getChatBasedOnId } from "../../services/chatService";
import { useChatContext } from "../../context/ChatContext";
import { useUserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
export function ChatsList() {
  const {
    allUserChats,
    setAllUserChats,
    setMessages,
    setCurrentChat,
    setActiveUsername,
    setIsChatVisible,
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
    <div className="">
      {allUserChats.map((item) => (
        <div
          key={item.chatId}
          className="p-4 border rounded-2xl mx-4 my-4 bg-[var(--color-messages)] shadow-sm"
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
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span>{item.name}</span>
                <span className="flex gap-2">
                  <button
                    className="cursor-pointer"
                    onClick={() => openChat(item.chatId, item.name)}
                  >
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
                    {/* <div>{JSON.stringify(item)}</div> */}
                  </button>
                </span>
              </div>
            </div>
          </li>
          <div>{item.lastMessage ? item.lastMessage.content : ""}</div>
        </div>
      ))}
      {/* <div>{JSON.stringify(allUserChats)}</div> */}
    </div>
  );
}
