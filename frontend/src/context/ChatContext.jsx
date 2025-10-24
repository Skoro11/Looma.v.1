import { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [allUserChats, setAllUserChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [activeUserId, setActiveUserId] = useState();
  const [activeUsername, setActiveUsername] = useState();
  const [group, setGroup] = useState([]);
  const [listState, setListState] = useState("chats");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isMobileChatVisible, setIsMobileChatVisible] = useState(false);
  const [localGroup, setLocalGroup] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [chatSettingsVisible, setChatSettingsVisible] = useState(false);
  return (
    <ChatContext.Provider
      value={{
        chatSettingsVisible,
        setChatSettingsVisible,
        isMobileChatVisible,
        setIsMobileChatVisible,
        allUserChats,
        setAllUserChats,
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
        localGroup,
        setLocalGroup,
        groupName,
        setGroupName,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
