import { useUserContext } from "../../context/UserContext";
import { AddButton } from "../buttons/AddButton";
import { addFriend } from "../../services/userService";
import { toast } from "react-toastify";
import UserIcon from "../icons/UserIcon";
export function UserList() {
  const { otherUsers, setUserFriends, setOtherUsers } = useUserContext();

  async function AddFriendApi(userId) {
    try {
      const response = await addFriend(userId);

      if (response?.data?.success && response.data.user) {
        const newFriend = {
          _id: response.data.user._id,
          username: response.data.user.username,
        };

        setUserFriends((prev) => [...prev, newFriend]);

        setOtherUsers((prev) =>
          prev.filter((user) => user._id.toString() !== newFriend._id)
        );

        toast.success("User added to friends");
      } else {
        toast.error(response?.data?.message || "Failed to add friend");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <ul>
      <h1 className="mx-4">Add friends</h1>
      {otherUsers.map((item) => (
        <div
          key={item._id}
          className="p-4 border rounded-2xl mx-4 my-4 bg-[var(--color-messages)] shadow-sm"
        >
          <li className="flex gap-4 items-center">
            <UserIcon />
            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-whit ">
                  {item.username}
                </span>
                <AddButton
                  onClick={() => AddFriendApi(item._id)}
                  color={"primary"}
                />
              </div>
            </div>
          </li>
        </div>
      ))}
    </ul>
  );
}
