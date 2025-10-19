import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const url = "http://localhost:3000";
export default function GroupList({
  users,
  group,
  setGroup,
  setChat,
  setMessages,
}) {
  const [localGroup, setLocalGroup] = useState([]);
  const [groupName, setGroupName] = useState("Frontend Mentors");
  function addToTempGroup(userId, username) {
    if (localGroup.some((user) => user._id === userId)) return;
    setLocalGroup((prev) => [...prev, { _id: userId, username: username }]);
  }
  function removeUserFromTempGroup(userId) {
    let filtered = localGroup.filter((u) => u._id !== userId);
    /*  console.log("Removed", filtered); */
    setLocalGroup(filtered);
  }
  async function createGroup() {
    if (!groupName) {
      toast.error("Group Name required");
      return;
    }
    if (localGroup.length < 2) {
      toast.error("Minimum 2 Participants required");
      return;
    }
    try {
      const response = await axios.post(
        url + "/chats/group",
        {
          participants: localGroup,
          name: groupName,
        },
        {
          withCredentials: true,
        }
      );

      /* console.log("Response from backend", response.data.chat); */
      const chat = response.data.chat;
      getGroup();
      setGroupName("");
      /* setGroup(localGroup); */
      setLocalGroup([]);
    } catch (error) {
      console.log("Error with creating group", error.message);
    }
  }

  async function getGroup() {
    try {
      const response = await axios.post(
        url + "/chats/group/all",
        {},
        { withCredentials: true }
      );
      const chatsArray = response.data.userChats;
      if (response.status === 200) {
        setGroup(chatsArray);
      }
      console.log("GetGroup", chatsArray);
    } catch (error) {
      console.log("Error with getting groups", error.message);
    }
  }

  async function DeleteChat(chatId) {
    try {
      const response = await axios.delete(url + "/chats/delete/" + chatId);
      console.log("Response delete chat", response);
      if (response.status === 200) {
        let filtered = group.filter((u) => u._id !== chatId);
        setGroup(filtered);
        setChat();
      }
    } catch (error) {
      console.log("Error with deleting Chat", error.message);
    }
  }
  useEffect(() => {
    getGroup();
  }, []);

  useEffect(() => {
    console.log("Array changed:", group);
  }, [group]);

  useEffect(() => {
    console.log("Local group", localGroup);
  }, [localGroup]);
  const [showGroup, setShowGroup] = useState(true);

  return (
    <div>
      {showGroup ? <p>True</p> : <p>False</p>}
      Create new group
      {users.map((user) => (
        <li key={user._id} className="flex justify-between mx-2 mb-2">
          <h1>{user.username}</h1>

          {localGroup.some((u) => u._id === user._id) ? (
            <button
              onClick={() => removeUserFromTempGroup(user._id)}
              className="bg-red-100 p-2"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() => addToTempGroup(user._id, user.username)}
              className="bg-blue-100 p-2"
            >
              Add to group
            </button>
          )}
        </li>
      ))}
      <div>
        {localGroup.length > 0 ? (
          localGroup.map((user) => {
            return <li key={user._id}>{user.username}</li>;
          })
        ) : (
          <li>The group is empty</li>
        )}
      </div>
      <button className="mr-2 bg-red-100 p-2" onClick={() => setLocalGroup([])}>
        Remove all
      </button>
      <button className="bg-blue-100 p-2" onClick={() => createGroup()}>
        Create group
      </button>
      <br></br>
      <span>Group name</span>
      <input
        className="border"
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <div>
        <h1>Created Groups</h1>
        {group.map((chat, index) => (
          <li onClick={() => setChat(chat._id)} className="m-2" key={chat._id}>
            {chat.name}
            <button
              className="float-right bg-red-100 "
              onClick={() => DeleteChat(chat._id)}
            >
              Delete Chat
            </button>
          </li>
        ))}
      </div>
    </div>
  );
}
