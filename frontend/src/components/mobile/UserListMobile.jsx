import AddFriendButton from "../buttons/AddFriendButton";
import { useUserContext } from "../../context/UserContext";
export function UserListMobile() {
  const { otherUsers, setUserFriends } = useUserContext();
  return (
    <ul>
      <h1 className="mx-2">Add friends</h1>
      {otherUsers.map((item) => (
        <div key={item._id} className=" rounded-2xl my-4 ">
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
              <div className="flex justify-between items-center mb-1 mr-2">
                <span className="font-semibold text-whit ">
                  {item.username}
                </span>
                <AddFriendButton
                  itemId={item._id}
                  setFriends={setUserFriends}
                />{" "}
              </div>
            </div>
          </li>
        </div>
      ))}
    </ul>
  );
}
