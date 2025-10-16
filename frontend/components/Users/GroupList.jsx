import { useEffect, useState } from "react";

export default function GroupList({ users, group, setGroup }) {
  const [localGroup, setLocalGroup] = useState([]);

  function addToTempGroup(userId, username) {
    if (localGroup.some((user) => user._id === userId)) return;
    setLocalGroup((prev) => [...prev, { _id: userId, username: username }]);
  }
  function removeUserFromTempGroup(userId) {
    let filtered = localGroup.filter((u) => u._id !== userId);
    /*  console.log("Removed", filtered); */
    setLocalGroup(filtered);
  }

  function createGroup() {
    setGroup(localGroup);
  }
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
      <button onClick={() => setLocalGroup([])}>Remove all</button>
      <button onClick={() => createGroup()}>Create group</button>
      <div>
        <h1>Created Groups</h1>
      </div>
    </div>
  );
}
