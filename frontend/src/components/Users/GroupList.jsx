import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Check } from "lucide-react";
import {
  createGroupChat,
  deleteGroupChat,
  getGroupChat,
  getGroupChatWithChatId,
} from "../../services/chatService";
import UserIcon from "../icons/UserIcon";
import { useChatContext } from "../../context/ChatContext";
import { useUserContext } from "../../context/UserContext";
export default function GroupList() {
  const { userFriends } = useUserContext();
  const {
    setIsChatVisible,
    setMessages,
    currentChat,
    setCurrentChat,
    setActiveUserId,
    setActiveUsername,
    sctiveUsername,
    group,
    setGroup,
    groupName,
    setGroupName,
    localGroup,
    setLocalGroup,
  } = useChatContext();

  const [showGroup, setShowGroup] = useState(true);

  function addToTempGroup(userId, username) {
    if (localGroup.some((user) => user._id === userId)) return;
    setLocalGroup((prev) => [...prev, { _id: userId, username: username }]);
  }
  function removeUserFromTempGroup(userId) {
    let filtered = localGroup.filter((u) => u._id !== userId);
    setLocalGroup(filtered);
  }
  async function createGroup() {
    try {
      if (!groupName) {
        toast.error("Group Name required");
        return;
      }
      if (localGroup.length < 2) {
        toast.error("Minimum 2 Participants required");
        return;
      }

      const response = await createGroupChat(localGroup, groupName);

      if (response.data.success === true) {
        toast.success(response.data.message);
      }
      if (response.data.success === false) {
        toast.error(response.data.message);
      }
      getGroup();
      setGroupName("");
      /* setGroup(localGroup); */
      setLocalGroup([]);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function getGroup() {
    try {
      const response = await getGroupChat();
      const chatsArray = response.data.chat;
      if (response.status === 200) {
        setGroup(chatsArray);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getGroup();
  }, []);

  return (
    <div className="md:mx-4 min-h-150 md:min-h-0">
      <h1 className="ml-2 mt-2"> New Group</h1>

      <div>
        {userFriends.map((item) => (
          <div
            key={item._id}
            className="md:p-4 md:border md:rounded-2xl  my-4 md:bg-[var(--color-messages)] md:shadow-sm"
          >
            <li className="flex gap-4 items-center">
              {/* Avatar / Icon */}
              <UserIcon />

              {/* Content */}
              <div className=" mr-2 md:mr-0 flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span>{item.username}</span>
                  {localGroup.some((u) => u._id === item._id) ? (
                    <button
                      onClick={() => removeUserFromTempGroup(item._id)}
                      className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="white"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => addToTempGroup(item._id, item.username)}
                      className=" cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-green-400 "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="white"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </li>
          </div>
        ))}
        <div className="">
          <CreateNewGroup
            localGroup={localGroup}
            createGroup={createGroup}
            groupName={groupName}
            setGroupName={setGroupName}
          />
        </div>
      </div>

      {/* <button className="mr-2 bg-red-100 p-2" onClick={() => setLocalGroup([])}>
        Remove all
      </button> */}
    </div>
  );
}

function CreateNewGroup({ localGroup, createGroup, groupName, setGroupName }) {
  return (
    <div className="mx-2 md:mx-0 flex justify-between items-center pb-5 mt-2">
      <input
        className="border w-full mr-2  p-2 rounded-2xl"
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <button
        className="bg-green-400 p-2 rounded-xl cursor-pointer"
        onClick={() => createGroup()}
      >
        <Check />
      </button>
    </div>
  );
}
