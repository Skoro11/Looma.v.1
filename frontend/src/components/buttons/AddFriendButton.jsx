import { addFriend } from "../../services/userService";
import { useUserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
function AddFriendButton({ itemId }) {
  const { setOtherUsers, otherUsers, setUserFriends } = useUserContext();

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
    <button
      onClick={() => AddFriendApi(itemId)}
      className=" cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-[var(--color-primary)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="white"
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}
export default AddFriendButton;
