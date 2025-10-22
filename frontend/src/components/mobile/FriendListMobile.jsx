import RemoveFriendButton from "../buttons/RemoveFriendButton";
import { useUserContext } from "../../context/UserContext";
import { useChatContext } from "../../context/ChatContext";
import { CreateOrOpenChat } from "../../api/chat";

export function FriendListMobile({ setIsMobileChatVisible }) {
  const {
    setIsChatVisible,
    setMessages,
    setCurrentChat,
    setActiveUserId,
    setActiveUsername,
    setListState,
  } = useChatContext();
  const { userFriends } = useUserContext();
  async function StartChat(friend_id, itemUsername) {
    const response = await CreateOrOpenChat(friend_id);
    if (response.data.success === true) {
      setIsChatVisible(true);
    }
    setActiveUserId(friend_id);
    setActiveUsername(itemUsername);
    const chatId = response.data.chat;
    setCurrentChat(chatId);
    /*       socket.emit("joinChat", chatId);
     */ const messages = response.data.messages;
    setMessages(messages);
  }
  return (
    <ul>
      {userFriends.map((item) => (
        <div key={item._id} className=" rounded-2xl my-4 ">
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
              <div className="flex justify-between items-center mb-1 mr-2">
                <span>
                  <button
                    onClick={() => {
                      StartChat(item._id, item.username);
                      setIsMobileChatVisible(true);
                      setListState("nothing");
                    }}
                  >
                    {item.username}
                  </button>
                </span>
                <span className="flex gap-2">
                  <RemoveFriendButton itemId={item._id} />
                </span>
              </div>
            </div>
          </li>
        </div>
      ))}
    </ul>
  );
}
