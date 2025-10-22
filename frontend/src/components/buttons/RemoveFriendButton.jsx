import { toast } from "react-toastify";
import { removeFriend } from "../../api/user";
import { useUserContext } from "../../context/UserContext";
function RemoveFriendButton({ itemId }) {
  const { setOtherUsers, setUserFriends, userFriends } = useUserContext();

  async function RemoveFriendAxios(userId) {
    try {
      const response = await removeFriend(userId);
      if (response.data.success === true) {
        const removedFriend = response.data.user;

        toast.success("User removed from friends");

        setOtherUsers((prev) => [...prev, removedFriend]);

        const updatedFriends = userFriends.filter(
          (friend) => friend._id != userId
        );

        setUserFriends(updatedFriends);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div
      onClick={() => RemoveFriendAxios(itemId)}
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
      </svg>
    </div>
  );
}
export default RemoveFriendButton;
