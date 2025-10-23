import { useEffect, useRef } from "react";
import { CheckToken } from "../services/authService.js";
import Sidebar from "../components/buttons/sidebar/Sidebar.jsx";
import { toast } from "react-toastify";

import { UserList } from "../components/Users/UserList";
import { FriendList } from "../components/Users/FriendList";
import { getHoursAndMinutes } from "../utils/TimeConverter";
import GroupList from "../components/Users/GroupList";
import { ArrowLeft } from "lucide-react";
import {
  ChatsButton,
  GroupButton,
  FriendsButton,
  ContactsButton,
  AccountButton,
} from "../components/buttons/sidebar/SidebarButtons.jsx";
import SearchBar from "../components/SearchBar";
import UserIcon from "../components/icons/UserIcon";
import { TrashButton } from "../components/buttons/TrashButton.jsx";
import { useChatContext } from "../context/ChatContext";
import { useUserContext } from "../context/UserContext";
import { fetchUserFriends, getNonFriends } from "../services/userService";
import { RemoveChat, sendAMessage } from "../services/chatService";
import AccountList from "../components/Users/AccountList";
import { ChatsList } from "../components/Users/ChatsList";
import { socket } from "../utils/socket";
import { ArrowUpButton } from "../components/buttons/ArrowUpButton.jsx";
import { ChatWindow } from "../components/ChatWindow.jsx";
import { useMediaQuery } from "../hooks/useMediaQuery.jsx";
import { useState } from "react";
export function LandingPage() {
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
  } = useChatContext();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showChat, setShowChat] = useState(false);
  useEffect(() => {
    socket.emit("connection", () => {
      console.log("Connected to server with id:", socket.id);
    });
  });
  useEffect(() => {
    socket.emit("joinChat", currentChat);
  }, [currentChat]);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("newMessage");
  });

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
  async function TokenResponse() {
    const response = await CheckToken();
    const user = response.data.user;
    setUser({ id: user.id, email: user.email, username: user.username });
  }
  async function getUsers() {
    const response = await getNonFriends();
    const users = response.data.user;
    setOtherUsers(users);
  }
  async function getUserFriends() {
    /*  Returns an array of id and username */
    const response = await fetchUserFriends();
    if (response.data.success === true) {
      const userFriends = response.data.friends;
      setUserFriends(userFriends);
    }
  }
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
  useEffect(() => {
    TokenResponse();
    getUsers();
    getUserFriends();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto md:pt-10">
      <div className="md:mx-5 md:bg-[var(--color-body)] md:shadow-xl md:rounded-2xl md:p-3 text-white ">
        <div className="md:flex">
          <nav className="hidden md:flex md:w-1/10 lg:min-w-1/18 bg-[var(--color-primary)]  flex-col justify-between items-center py-4 rounded-l-xl shadow-md">
            <div className="flex flex-col gap-3 items-center">
              <ChatsButton listState={setListState} listStateValue={"chats"} />
              <ContactsButton
                listState={setListState}
                listStateValue="addUsers"
              />
              <FriendsButton
                listState={setListState}
                listStateValue="friends"
              />
              <GroupButton listState={setListState} listStateValue={"group"} />
            </div>
            <div className="mt-2">
              <AccountButton
                listState={setListState}
                listStateValue="userAccount"
              />
            </div>
          </nav>

          <div className="block md:rounded-r-xl w-full md:w-1/2 lg:min-w-1/4 bg-[var(--color-accent)] ">
            <span className="hidden md:block">
              <SearchBar />
            </span>

            <div className="">
              {(() => {
                switch (listState) {
                  case "chats":
                    return (
                      <>
                        <div className="md:hidden fixed top-0 left-0 z-[100] w-full bg-[var(--color-accent)] flex justify-between items-center px-4 py-3 shadow-md border-b border-[var(--color-messages)]">
                          {/* Logo + Text */}
                          <div className="flex items-center gap-2">
                            <img
                              src="looma.png"
                              alt="Looma Logo"
                              className="h-8 w-8 object-contain"
                            />
                            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-logo)] tracking-wide">
                              Looma
                            </h1>
                          </div>

                          {/* Sidebar / Three dots */}
                          <Sidebar />
                        </div>

                        <div className="mt-7 md:mt-0 ">
                          <div className="ml-2 md:ml-4">My messages</div>
                          <ChatsList />
                        </div>
                      </>
                    );

                  case "friends":
                    return (
                      <>
                        <div className="md:hidden fixed top-0 left-0 z-[100] w-full bg-[var(--color-accent)] flex items-center px-4 py-3 shadow-md border-b border-[var(--color-messages)]">
                          {/* Back button */}
                          <button
                            onClick={() => setListState("chats")}
                            className="mr-3 p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Go Back"
                          >
                            <ArrowLeft className="w-5 h-5 text-white" />
                          </button>

                          {/* Search bar */}
                          <div className="flex-1">
                            <SearchBar />
                          </div>

                          {/* Sidebar / Three dots */}
                          <div className="ml-3">
                            <Sidebar />
                          </div>
                        </div>
                        <div className=" md:min-h-0">
                          <div className="md:hidden mt-15 md:mt-0">
                            <UserList />
                          </div>
                          <div>
                            <FriendList />
                          </div>
                        </div>
                      </>
                    );
                  case "addUsers":
                    return (
                      <>
                        <div className="md:hidden fixed top-0 left-0 z-[100] w-full bg-[var(--color-accent)] flex items-center px-4 py-3 shadow-md border-b border-[var(--color-messages)]">
                          {/* Back button */}
                          <button
                            onClick={() => setListState("chats")}
                            className="mr-3 p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Go Back"
                          >
                            <ArrowLeft className="w-5 h-5 text-white" />
                          </button>

                          {/* Search bar */}
                          <div className="flex-1">
                            <SearchBar />
                          </div>

                          {/* Sidebar / Three dots */}
                          <div className="ml-3">
                            <Sidebar />
                          </div>
                        </div>
                        <div className=" md:min-h-0">
                          <div className="mt-15 md:mt-0">
                            <UserList />
                          </div>
                          <div className="md:hidden">
                            <FriendList />
                          </div>
                        </div>
                      </>
                    );
                  case "group":
                    return (
                      <>
                        <div className="md:hidden fixed top-0 left-0 z-[100] w-full bg-[var(--color-accent)] flex items-center px-4 py-3 shadow-md border-b border-[var(--color-messages)]">
                          {/* Back button */}
                          <button
                            onClick={() => setListState("chats")}
                            className="mr-3 p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Go Back"
                          >
                            <ArrowLeft className="w-5 h-5 text-white" />
                          </button>

                          {/* Search bar */}
                          <div className="flex-1">
                            <SearchBar />
                          </div>

                          {/* Sidebar / Three dots */}
                          <div className="ml-3">
                            <Sidebar />
                          </div>
                        </div>
                        <div className="mt-15 md:mt-0">
                          <GroupList />
                        </div>
                      </>
                    );

                  case "userAccount":
                    return (
                      <>
                        <div className="md:hidden fixed top-0 left-0 z-[100] w-full bg-[var(--color-accent)] flex justify-between items-center px-4 py-3 shadow-md border-b border-[var(--color-messages)]">
                          <div className="flex items-center gap-2">
                            <img
                              src="looma.png"
                              alt="Looma Logo"
                              className="h-8 w-8 object-contain"
                            />
                            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-logo)] tracking-wide">
                              Looma
                            </h1>
                          </div>

                          <Sidebar />
                        </div>

                        <div className="mt-13 md:mt-0">
                          <AccountList />
                        </div>
                      </>
                    );
                  case "mobileChat":
                    return (
                      <>
                        <ChatWindow />
                      </>
                    );
                  default:
                    return;
                }
              })()}
            </div>
          </div>

          <div className="hidden md:block w-full relative  ">
            {isChatVisible ? (
              <ChatWindow />
            ) : (
              <div className="hidden md:block min-h-130 ">
                <div className="mx-2 bg-[var(--color-messages)] rounded-xl mt-4 mb-2 py-2 pl-3 flex items-center justify-between">
                  <span className="mr-2">No chats Selected</span>
                </div>
              </div>
            )}
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
