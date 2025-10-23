import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createGroupChat,
  deleteGroupChat,
  getGroupChat,
  getGroupChatWithChatId,
} from "../../api/chat";
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

  async function DeleteChat(chatId) {
    try {
      const response = await deleteGroupChat(chatId);
      if (response.status === 200) {
        let filtered = group.filter((u) => u._id !== chatId);
        setGroup(filtered);
        setCurrentChat();
        setMessages();
        setCurrentChat();
        setActiveUserId();
        setActiveUsername();
        setIsChatVisible(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function getGroupChatByChatId(chatId) {
    try {
      const response = await getGroupChatWithChatId(chatId);
      if (response) {
        setMessages(response.data.messages);
        setCurrentChat(response.data.chat_id);
        setActiveUserId(response.data.chat_id);
        setActiveUsername(response.data.name);
        setIsChatVisible(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    getGroup();
  }, []);

  return (
    <div className="mx-4">
      <div className="flex justify-between">
        <button
          onClick={() => setShowGroup(true)}
          className="bg-[var(--color-primary)]   p-2 border-0 rounded-2xl cursor-pointer  hover:brightness-115 transition "
        >
          My groups
        </button>
        <button
          onClick={() => setShowGroup(false)}
          className="bg-green-400   p-2 border-0 rounded-2xl cursor-pointer  hover:brightness-115 transition "
        >
          New group
        </button>
      </div>

      {showGroup === true ? (
        <>
          <h1 className="mt-2"> My Groups</h1>
          <HandleCreatedGroups group={group} DeleteChat={DeleteChat} />
        </>
      ) : (
        <div>
          <h1 className="mt-2">Group Participants</h1>
          {userFriends.map((item) => (
            <div
              key={item._id}
              className="p-4 border rounded-2xl  my-4 bg-[var(--color-messages)] shadow-sm"
            >
              <li className="flex gap-4 items-center">
                {/* Avatar / Icon */}
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1">
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
          <CreateNewGroup
            localGroup={localGroup}
            createGroup={createGroup}
            groupName={groupName}
            setGroupName={setGroupName}
          />
          <AddedUsersToLocalGroup localGroup={localGroup} />
        </div>
      )}

      {/* <button className="mr-2 bg-red-100 p-2" onClick={() => setLocalGroup([])}>
        Remove all
      </button> */}
    </div>
  );

  function HandleCreatedGroups() {
    return (
      <>
        {group.map((item) => (
          <div
            key={item._id}
            className="p-4 border rounded-2xl  my-4 bg-[var(--color-messages)] shadow-sm"
          >
            <li className="flex gap-4 items-center">
              {/* Avatar / Icon */}
              <UserIcon />

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => {
                      getGroupChatByChatId(item._id);
                    }}
                    className="cursor-pointer"
                  >
                    {item.name}
                  </button>
                  <button
                    onClick={() => DeleteChat(item._id)}
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
                </div>
              </div>
            </li>
          </div>
        ))}
      </>
    );
  }

  function AddedUsersToLocalGroup({ localGroup }) {
    return (
      <>
        {localGroup.length > 0 ? (
          localGroup.map((user) => {
            return <li key={user._id}>{user.username}</li>;
          })
        ) : (
          <li></li>
        )}
      </>
    );
  }
}

function CreateNewGroup({ localGroup, createGroup, groupName, setGroupName }) {
  return (
    <>
      {localGroup.length > 0 ? (
        <div>
          <div className="flex justify-between items-center">
            {" "}
            <span>New Group</span>
            <button
              className="bg-green-400 p-2 rounded-xl cursor-pointer"
              onClick={() => createGroup()}
            >
              Create group
            </button>
          </div>

          <div className="mb-5">
            <span className="">Group name</span>
            <input
              className="border mt-2"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
