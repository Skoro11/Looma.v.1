import { useEffect, useState, useRef } from "react";
import { CheckToken } from "../api/authApi";

import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { UserList } from "../components/Users/UserList";
import { FriendList } from "../components/Users/FriendList";
import { getHoursAndMinutes } from "../helpers/TimeConverter";
import GroupList from "../components/Users/GroupList";
import HomeButton from "../components/buttons/HomeButton";
import ChatsButton from "../components/buttons/ChatsButton";
import ContactsButton from "../components/buttons/ContactsButton";
import GroupButton from "../components/buttons/GroupButton";
import SettingsButton from "../components/buttons/SettingsButton";
import AccountButton from "../components/buttons/AccountButton";
import SearchBar from "../components/SearchBar";
import SendMessageButton from "../components/buttons/SendMessageButton";
import UserIcon from "../components/icons/UserIcon";
import DeleteChatButton from "../components/buttons/DeleteChatButton";
import RemoveFriendButton from "../components/buttons/RemoveFriendButton";
import { useChatContext } from "../context/ChatContext";
import { useUserContext } from "../context/UserContext";
import { fetchUserFriends, getNonFriends } from "../api/user";
import { CreateOrOpenChat, RemoveChat, sendAMessage } from "../api/chat";
const socket = io("http://localhost:3000");

export function LandingPage() {
  const {
    user,
    setUser,
    otherUsers,
    setOtherUsers,
    userFriends,
    setUserFriends,
  } = useUserContext();
  const {
    messages,
    setMessages,
    currentChat,
    setCurrentChat,
    messageInput,
    setMessageInput,
    activeUserId,
    setActiveUserId,
    activeUsername,
    setActiveUsername,
    group,
    setGroup,
    listState,
    setListState,
    isChatVisible,
    setIsChatVisible,
  } = useChatContext();
  const messagesEndRef = useRef(null);
  useEffect(() => {
    console.log("userFriends changed:", userFriends);
  }, [userFriends]);
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
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("newMessage");
  }, []);

  async function StartChat(friend_id) {
    const response = await CreateOrOpenChat(friend_id);
    /*  console.log("Friend ID", friend_id); */
    if (response.data.success === true) {
      toast.success("Chat successfully created");
      setIsChatVisible(true);
    }
    setActiveUserId(friend_id);
    console.log("Start chat response data", response.data);
    const chatId = response.data.chat;
    setCurrentChat(chatId);
    /*       socket.emit("joinChat", chatId);
     */ const messages = response.data.messages;
    console.log("Response Messages", messages);
    setMessages(messages);
  }

  async function DeleteChat(chat_id) {
    const response = await RemoveChat(chat_id);
    if (response.data.success === true) {
      toast.success("Chat deleted successfully");
      setMessages([]);
      setCurrentChat();
      setIsChatVisible(false);
    }
  }
  async function sendMessage() {
    const response = await sendAMessage(currentChat, messageInput);
    console.log("Send message response", response.data.message);
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
  }
  async function TokenResponse() {
    const response = await CheckToken();

    const user = response.data.user;
    setUser({ id: user.id, email: user.email, username: user.username });
    /* console.log("User Token ", user); */
  }
  async function getUsers() {
    const response = await getNonFriends();
    console.log("Response of getUsers ", response.data.user);
    const users = response.data.user;
    setOtherUsers(users);
  }
  async function getUserFriends() {
    /*  Returns an array of id and username */
    const response = await fetchUserFriends();
    if (response.data.success === true) {
      const userFriends = response.data.friends;
      /* console.log("User Friends", response); */
      setUserFriends(userFriends);
    }
  }
  useEffect(() => {
    TokenResponse();
    getUsers();
    getUserFriends();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto pt-10">
      <div className="bg-[var(--color-body)] shadow-xl rounded-2xl p-10 text-white ">
        <h1 className="flex items-center justify-between mb-6 w-full">
          <img
            src="looma.png"
            alt="Looma Logo"
            className="w-10 h-10 object-contain"
          />
          <span>{user.username}</span>
          <a href="/" className="text-gray-500">
            <button className="cursor-pointer bg-red-400 p-2 rounded text-white hover:bg-red-200">
              {" "}
              Logout
            </button>
          </a>
        </h1>
        <div>
          {" "}
          <h1>
            Chat Messages || UserId -- {user.id}{" "}
            {currentChat ? (
              <button
                onClick={() => DeleteChat(currentChat)}
                className="float-right bg-red-100 p-2 "
              >
                Delete Chat
              </button>
            ) : (
              <button></button>
            )}{" "}
          </h1>
          <h1>Current Chat {currentChat}</h1>
        </div>
        <div className="flex">
          <nav className="bg-[var(--color-primary)] w-1/15 flex flex-col justify-between items-center py-4 rounded-l-xl shadow-md">
            <div className="flex flex-col gap-3 items-center">
              <HomeButton listStateValue={""} />

              <ChatsButton
                listState={setListState}
                listStateValue={"friends"}
              />

              <ContactsButton
                listState={setListState}
                listStateValue="addUsers"
              />

              <GroupButton listState={setListState} listStateValue="group" />

              <SettingsButton listState={setListState} listStateValue="" />
            </div>
            <div className="mt-2">
              <AccountButton
                listState={setListState}
                listStateValue="friends"
              />
            </div>
          </nav>

          <div className="border w-1/5 bg-[var(--color-accent)] ">
            <SearchBar />
            <ul className="">
              {(() => {
                switch (listState) {
                  case "friends":
                    return (
                      <FriendList
                        friends={userFriends}
                        StartChat={StartChat}
                        setFriends={setUserFriends}
                      />
                    );
                  case "addUsers":
                    return (
                      <UserList
                        otherUsers={otherUsers}
                        StartChat={StartChat}
                        setFriends={setUserFriends}
                        setActiveUsername={setActiveUsername}
                      />
                    );
                  case "group":
                    return (
                      <GroupList
                        group={group}
                        setGroup={setGroup}
                        users={userFriends}
                        setChat={setCurrentChat}
                        setMessages={setMessages}
                      />
                    );
                  default:
                    return <p>Nothing selected</p>;
                }
              })()}
            </ul>
          </div>

          <div className="border w-full relative ">
            {isChatVisible ? (
              <div>
                <div className="mx-2 bg-[var(--color-messages)] rounded-xl mt-4 mb-2 py-2 pl-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">
                      <UserIcon />
                    </span>
                    <span>{activeUsername} </span>
                  </div>

                  <div className="mr-2 flex gap-5">
                    <span>
                      <RemoveFriendButton
                        friends={userFriends}
                        setFriends={setUserFriends}
                        itemId={activeUserId}
                      />
                    </span>
                    <span>
                      <DeleteChatButton
                        deleteChat={() => DeleteChat(currentChat)}
                      />
                    </span>
                  </div>
                </div>

                <ul className="h-100 overflow-y-auto   ">
                  {messages.map((message) => (
                    <li key={message._id}>
                      {message.senderId._id === user.id ? (
                        <div className="text-right ">
                          <h1 className="">
                            <span className="font-bold ">
                              {/* {message.senderId.username}{" "} */}
                            </span>
                          </h1>
                          <div className="flex justify-end my-2">
                            <p className="bg-[var(--color-primary)] w-max py-1 px-3 rounded-lg text-white">
                              {message.content}
                            </p>
                          </div>
                          {getHoursAndMinutes(message.createdAt)}{" "}
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

                <div className="w-full flex px-2 my-5 ">
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    type="text"
                    className="flex-1 py-2 px-3 mr-2 text-white outline-none bg-[var(--color-messages)] rounded-xl"
                    placeholder="Message..."
                  />
                  <SendMessageButton sendMessage={sendMessage} />
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
        </div>
        <h1>Chat Visible</h1>
        {isChatVisible ? <p>True</p> : <p>False</p>}
        {isChatVisible}
        <h1>Friends</h1>
        {userFriends.map((item, index) => {
          return (
            <li key={index} className="">
              {item.username}
              {item._id}
            </li>
          );
        })}
        <h1>Other users</h1>
        {otherUsers.map((item, index) => {
          return (
            <li key={index}>
              {item.username} {item._id}
            </li>
          );
        })}
      </div>
    </div>
  );
}
