import { addFriend } from "../../api/user";
import { useUserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
function AddFriendButton({ itemId }) {
  const { setOtherUsers, otherUsers, setUserFriends } = useUserContext();

  async function AddFriendApi(userId) {
    const response = await addFriend(userId);
    /* console.log("AddFriendApi response ", response); */
    if (response.data.success === true && response.data?.user) {
      /* console.log("Add friend response", response); */
      const newFriend = {
        _id: response.data.user._id,
        username: response.data.user.username,
      };
      /* console.log(newFriend); */
      setUserFriends((prev) => [...prev, newFriend]);
      const oldUsers = otherUsers;
      const filtered = oldUsers.filter(
        (user) => user._id.toString() !== newFriend._id
      );
      setOtherUsers(filtered);
      toast.success("User added to friends");
    }

    /* console.log("Response Add friend", response.data); */
  }
  return (
    <div
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
    </div>
  );
}
export default AddFriendButton;
