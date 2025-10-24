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
    <ul className=" md:min-h-0 md:overflow-y-scroll md:h-screen md:scrollbar-hide md:max-h-[460px] relative  md:p-0">
      <h1 className="ml-2 md:mx-4">Add friends</h1>
      {otherUsers.map((item) => (
        <div
          key={item._id}
          className="md:p-4 md:border md:rounded-2xl md:mx-4 my-4 md:bg-[var(--color-messages)] md:shadow-sm"
        >
          <li className="flex gap-4 items-center">
            <UserIcon />
            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1 mr-2 md:mr-0">
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
