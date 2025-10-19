// src/context/UserContext.jsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ id: "", email: "", username: "" });
  const [otherUsers, setOtherUsers] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        otherUsers,
        setOtherUsers,
        userFriends,
        setUserFriends,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
