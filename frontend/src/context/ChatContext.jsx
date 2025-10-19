import { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [activeUserId, setActiveUserId] = useState();
  const [activeUsername, setActiveUsername] = useState();
  const [group, setGroup] = useState([]);
  const [listState, setListState] = useState("addUsers");
  const [isChatVisible, setIsChatVisible] = useState(false);
  return (
    <ChatContext.Provider
      value={{
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
