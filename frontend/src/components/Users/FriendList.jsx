import { useUserContext } from "../../context/UserContext";
import { ChatButton } from "../buttons/ChatButton";
import { useChatContext } from "../../context/ChatContext";
import { CreateOrOpenChat } from "../../services/chatService";
import { toast } from "react-toastify";
import { RemoveButton } from "../buttons/RemoveButton";
import { removeFriend } from "../../services/userService";
export function FriendList() {
  const {
    setIsChatVisible,
    setMessages,
    setCurrentChat,
    setActiveUserId,
    setActiveUsername,
  } = useChatContext();
  async function StartChat(friend_id, itemUsername) {
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
  const { setOtherUsers, setUserFriends, userFriends } = useUserContext();

  async function RemoveFriendAxios(userId) {
    try {
      const response = await removeFriend(userId);
      if (response.data.success === true) {
        const removedFriend = response.data.user;

        toast.success("User removed from friends");

        setOtherUsers((prev) => [...prev, removedFriend]);

        const updatedFriends = userFriends.filter(
          (friend) => friend._id != userId
        );

        setUserFriends(updatedFriends);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <ul>
      <h1 className="mx-4">My Friends</h1>
      {userFriends.map((item) => (
        <div
          key={item._id}
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
                <span>{item.username}</span>
                <span className="flex gap-2">
                  {/* <StartChatButton
                    itemId={item._id}
                    itemUsername={item.username}
                  /> */}
                  <ChatButton
                    onClick={() => StartChat(item._id, item.username)}
                  />
                  {/* <RemoveFriendButton itemId={item._id} /> */}
                  <RemoveButton onClick={() => RemoveFriendAxios(item._id)} />
                </span>
              </div>
            </div>
          </li>
        </div>
      ))}
    </ul>
  );
}
