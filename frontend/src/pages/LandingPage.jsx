import { useEffect, useRef } from "react";
import { CheckToken } from "../services/authService.js";

import { toast } from "react-toastify";

import { UserList } from "../components/Users/UserList";
import { FriendList } from "../components/Users/FriendList";
import { getHoursAndMinutes } from "../utils/TimeConverter";
import GroupList from "../components/Users/GroupList";
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
import { MobileLandingPage } from "./MobileLandingPage";
import { socket } from "../utils/socket";
import { ArrowUpButton } from "../components/buttons/ArrowUpButton.jsx";
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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="max-w-[1400px] mx-auto md:pt-10">
      <div className="md:bg-[var(--color-body)] shadow-xl md:rounded-2xl md:p-3 text-white ">
        <div className=" md:hidden">
          <MobileLandingPage />
        </div>

        <div className="hidden md:flex">
          <nav className=" w-1/7 bg-[var(--color-primary)] lg:w-1/15 md:flex flex-col justify-between items-center py-4 rounded-l-xl shadow-md">
            <div className="flex flex-col gap-3 items-center">
              {/* <HomeButton listState={setListState} listStateValue={""} /> */}

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

              {/* <SettingsButton listState={setListState} listStateValue="" /> */}
            </div>
            <div className="mt-2">
              <AccountButton
                listState={setListState}
                listStateValue="userAccount"
              />
            </div>
          </nav>

          <div className="block rounded-r-xl w-full md:w-1/2 lg:w-1/4 bg-[var(--color-accent)] ">
            <SearchBar />
            <ul className="">
              {(() => {
                switch (listState) {
                  case "chats":
                    return <ChatsList />;
                  case "friends":
                    return <FriendList />;
                  case "addUsers":
                    return <UserList />;
                  case "group":
                    return <GroupList />;
                  case "userAccount":
                    return <AccountList />;
                  default:
                    return;
                }
              })()}
            </ul>
          </div>

          <div className="  w-full relative  ">
            {isChatVisible ? (
              <div>
                <div className="mx-2 bg-[var(--color-messages)] rounded-xl  mb-2 py-2 pl-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">
                      <UserIcon />
                    </span>
                    <span>{activeUsername} </span>
                  </div>

                  <div className="mr-4">
                    <span>
                      {/* <DeleteChatButton
                        deleteChat={() => DeleteChat(currentChat)}
                      /> */}
                      <TrashButton onClick={() => DeleteChat(currentChat)} />
                    </span>
                  </div>
                </div>
                {/* <div>Json {JSON.stringify(messages)}</div>
                <div>{JSON.stringify(user)}</div> */}
                <ul className="h-100 overflow-y-auto   ">
                  {messages.map((message) => (
                    <li key={message._id}>
                      {/* <div>{JSON.stringify(message)}</div> */}
                      {message.senderId._id === user.id ||
                      message.senderId === user.id ? (
                        <div className="text-right ">
                          <h1 className="">
                            <span className="font-bold "></span>
                          </h1>
                          <div className="flex justify-end my-2">
                            <p className="bg-[var(--color-primary)] w-max py-1 px-3 mr-2 rounded-lg text-white">
                              {message.content}
                            </p>
                          </div>
                          <span className="mr-2">
                            {getHoursAndMinutes(message.createdAt)}{" "}
                          </span>
                        </div>
                      ) : (
                        <div className="text-left">
                          <h1 className="">
                            <span className="font-bold"></span>
                          </h1>
                          <div className="flex justify-start my-2">
                            <p className="bg-[var(--color-messages)] w-max py-1 px-3 ml-2 rounded-lg text-white">
                              {message.content}
                            </p>
                          </div>
                          <span className="ml-2">
                            {getHoursAndMinutes(message.createdAt)}{" "}
                          </span>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </li>
                  ))}
                </ul>

                <div className="w-full flex px-2 my-3 ">
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    type="text"
                    className="flex-1 py-2 px-3 mr-2 text-white outline-none bg-[var(--color-messages)] rounded-xl"
                    placeholder="Message..."
                  />
                  <ArrowUpButton onClick={() => sendMessage()} />
                </div>
              </div>
            ) : (
              <div className="min-h-130 ">
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
