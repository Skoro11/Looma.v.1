import { useUserContext } from "../../context/UserContext";
import { LogOut } from "lucide-react";
export function AccountList() {
  const { user } = useUserContext();
  return (
    <section className=" mx-2 md:mx-4 flex flex-col justify-between mb-4">
      <div>
        <h1 className="mb-2">Account details</h1>
        <h1 className="font-bold">User id</h1>
        <div className="bg-[var(--color-body)] rounded-xl p-2 mb-2">
          <h2>{user.id}</h2>
        </div>
        <h1 className="font-bold">Username</h1>
        <div className="bg-[var(--color-body)] rounded-xl p-2 mb-2">
          <h2>{user.username}</h2>
        </div>
        <h1 className="font-bold">Email</h1>
        <div className="bg-[var(--color-body)] rounded-xl p-2 mb-10">
          <h2>{user.email}</h2>
        </div>
      </div>
      <a href="/" className="">
        <button className="">
          <LogOut />
        </button>
      </a>
    </section>
  );
}

export default AccountList;
