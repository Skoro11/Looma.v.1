import { useUserContext } from "../../context/UserContext";
import { ChatButton } from "../buttons/ChatButton";
import { useChatContext } from "../../context/ChatContext";
import { CreateOrOpenChat } from "../../services/chatService";
import { toast } from "react-toastify";
import { RemoveButton } from "../buttons/RemoveButton";
import { removeFriend } from "../../services/userService";
import UserIcon from "../icons/UserIcon";
import { useMediaQuery } from "../../hooks/useMediaQuery";
export function FriendList() {
  const isMobile = useMediaQuery("(max-width: 500px)");
  const {
    setIsChatVisible,
    setMessages,
    setCurrentChat,
    setActiveUserId,
    setActiveUsername,
    setListState,
  } = useChatContext();
  async function StartChat(friend_id, itemUsername) {
    try {
      const response = await CreateOrOpenChat(friend_id);
      console.log(response);
      if (response.data.success === true) {
        toast.success("Chat successfully created");
        setIsChatVisible(true);
        if (isMobile) {
          setListState("mobileChat");
        }
      }
      setActiveUserId(friend_id);
      setActiveUsername(itemUsername);
      const chatId = response.data.chatId;
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
    <ul className="md:overflow-y-scroll h-screen scrollbar-hide md:max-h-115">
      <h1 className=" mx-2 md:mx-4">My Friends</h1>
      {userFriends.map((item) => (
        <div
          key={item._id}
          className="hover:scale-[1.02] md:p-4 md:border md:rounded-2xl md:mx-4 my-4 md:bg-[var(--color-messages)] md:shadow-sm"
        >
          <li className="flex gap-4 items-center">
            {/* Avatar / Icon */}
            <UserIcon />

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <button
                  className="cursor-pointer"
                  onClick={() => StartChat(item._id, item.username)}
                >
                  {item.username}
                </button>
                <span className="flex gap-2">
                  <span className="hidden md:block">
                    <ChatButton
                      onClick={() => StartChat(item._id, item.username)}
                    />
                  </span>
                  <span className="mr-2 md:mr-0">
                    <RemoveButton onClick={() => RemoveFriendAxios(item._id)} />
                  </span>
                </span>
              </div>
            </div>
          </li>
        </div>
      ))}
    </ul>
  );
}
