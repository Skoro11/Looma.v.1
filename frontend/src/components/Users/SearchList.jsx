import { ChatButton } from "../buttons/ChatButton";
import UserIcon from "../icons/UserIcon";
import { RemoveButton } from "../buttons/RemoveButton";
import { useUserContext } from "../../context/UserContext";
import { useChatContext } from "../../context/ChatContext";
import { CreateOrOpenChat } from "../../services/chatService";
import { toast } from "react-toastify";
import { useMediaQuery } from "../../hooks/useMediaQuery";
export function SearchList() {
  const isMobile = useMediaQuery("(max-width: 500px)");
  const { searchTerm, setSearchTerm, searchResult, setSearchResult } =
    useUserContext();
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
  return (
    <ul className="md:overflow-y-scroll h-screen scrollbar-hide md:max-h-115">
      <div className=" mx-2 md:mx-4 flex justify-between">Search Results</div>
      {searchResult.length < 1 ? (
        <div className=" mx-2 md:mx-4 flex justify-between"></div>
      ) : (
        <>
          {searchResult.map((item) => (
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
                      onClick={() => StartChat(item._id, item.username)}
                      className="cursor-pointer"
                    >
                      {item.username}
                    </button>
                    <span className="flex gap-2">
                      <span className="block mr-2">
                        <ChatButton
                          onClick={() => StartChat(item._id, item.username)}
                        />
                      </span>
                    </span>
                  </div>
                </div>
              </li>
            </div>
          ))}
        </>
      )}
    </ul>
  );
}
