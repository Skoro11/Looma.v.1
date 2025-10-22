import { useUserContext } from "../../context/UserContext";
import { useChatContext } from "../../context/ChatContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Check } from "lucide-react";

import { createGroupChat, getGroupChat } from "../../api/chat";
export function GroupListMobile() {
  const { userFriends } = useUserContext();
  const {
    setGroup,
    groupName,
    setGroupName,
    localGroup,
    setLocalGroup,
    setListState,
  } = useChatContext();

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
      setListState("chats");
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
  });

  return (
    <div className="mx-2">
      <div>
        <div>New Group</div>
        {userFriends.map((item) => (
          <div key={item._id} className=" rounded-2xl  my-4 b">
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
          createGroup={createGroup}
          groupName={groupName}
          setGroupName={setGroupName}
        />
      </div>

      {/* <button className="mr-2 bg-red-100 p-2" onClick={() => setLocalGroup([])}>
          Remove all
        </button> */}
    </div>
  );
}

function CreateNewGroup({ createGroup, groupName, setGroupName }) {
  return (
    <div className="flex justify-between items-center pb-5 mt-2">
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
