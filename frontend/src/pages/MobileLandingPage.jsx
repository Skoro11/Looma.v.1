import { useChatContext } from "../context/ChatContext";
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { getHoursAndMinutes } from "../utils/TimeConverter";
import { sendAMessage, RemoveChat } from "../api/chat";
import { UserListMobile } from "../components/mobile/UserListMobile";
import SearchBar from "../components/SearchBar";
import UserIcon from "../components/icons/UserIcon";
import { motion, AnimatePresence } from "framer-motion";
import AccountList from "../components/Users/AccountList";
import Sidebar from "../components/buttons/sidebar/Sidebar";
import SendMessageButton from "../components/buttons/SendMessageButton";
import { ChatsListMobile } from "../components/mobile/ChatsListMobile";
import { EllipsisVertical, ArrowLeft } from "lucide-react";
import { FriendListMobile } from "../components/mobile/FriendListMobile";
import { GroupListMobile } from "../components/mobile/GroupListMobile";
import { MobileChat } from "../components/mobile/MobileChat";
export function MobileLandingPage() {
  const [chatSettingsVisible, setChatSettingsVisible] = useState(false);
  const { user, otherUsers, userFriends } = useUserContext();
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
  } = useChatContext();

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
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
      setIsMobileChatVisible(false);
    }
  }
  return (
    <section className=" ">
      <div></div>
      <div className="flex">
        <div className="block rounded-r-xl w-full lg:w-1/5  ">
          <ul className="">
            <AnimatePresence mode="wait">
              <motion.div
                key={listState} // key must change to trigger animation
                initial={{ x: listState === "chats" ? -300 : 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: listState === "chats" ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute w-full h-full bg-[var(--color-accent)]"
              >
                {(() => {
                  switch (listState) {
                    case "chats":
                      return (
                        <>
                          <div className="z-[100] flex fixed top-0 left-0 bg-[var(--color-accent)] w-full justify-between items-center py-3 px-2">
                            <h1 className="text-2xl">Looma</h1>
                            <Sidebar />
                          </div>
                          <div className="mt-15">
                            <div className="ml-2">My messages</div>
                            <ChatsListMobile />
                          </div>
                        </>
                      );

                    case "friends":
                    case "addUsers":
                      return (
                        <>
                          <div className="z-[100] flex fixed top-0 left-0 bg-[var(--color-accent)] w-full items-center py-3 px-2">
                            <button
                              onClick={() => setListState("chats")}
                              className="mr-2"
                            >
                              <ArrowLeft />
                            </button>
                            <span className="w-full">
                              <SearchBar />
                            </span>
                            <Sidebar />
                          </div>

                          <div className="mt-15">
                            <div className="ml-2">Users</div>
                            {otherUsers.length > 0 ? (
                              <UserListMobile />
                            ) : (
                              <div className="ml-2">No other users</div>
                            )}
                          </div>
                          <div>
                            <div className="ml-2">My friends</div>
                            {userFriends.length > 0 ? (
                              <FriendListMobile
                                isMobileChatVisible={isMobileChatVisible}
                                setIsMobileChatVisible={setIsMobileChatVisible}
                              />
                            ) : (
                              <div className="ml-2">No friends</div>
                            )}
                          </div>
                        </>
                      );

                    case "group":
                      return (
                        <>
                          <div className="z-[100] flex fixed top-0 left-0 bg-[var(--color-accent)] w-full items-center py-3 px-2">
                            <button
                              onClick={() => setListState("chats")}
                              className="mr-2"
                            >
                              <ArrowLeft />
                            </button>
                            <span className="w-full">
                              <SearchBar />
                            </span>
                            <Sidebar />
                          </div>
                          <div className="mt-15">
                            <GroupListMobile />
                          </div>
                        </>
                      );

                    case "userAccount":
                      return (
                        <>
                          <div className="z-[100] flex fixed top-0 left-0 bg-[var(--color-accent)] w-full justify-between items-center py-3 px-2">
                            <h1 className="text-2xl">Looma</h1>
                            <Sidebar />
                          </div>
                          <div className="mt-15">
                            <AccountList />
                          </div>
                        </>
                      );

                    default:
                      return null;
                  }
                })()}
              </motion.div>
            </AnimatePresence>
          </ul>
        </div>

        <div></div>
      </div>
      <div className=" chat w-full  bg-[var(--color-body)] relative ">
        {isMobileChatVisible && <MobileChat />}
      </div>
    </section>
  );
}
