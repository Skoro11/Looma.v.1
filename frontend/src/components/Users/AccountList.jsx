import { useUserContext } from "../../context/UserContext";
import { LogOut } from "lucide-react";
import { LogoutUser } from "../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export function AccountList() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();
  async function Logout() {
    try {
      const response = await LogoutUser();
      if (response) {
        setIsAuthenticated(false);
        navigate("/login");
        toast.success("Successfully logged out");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const { user } = useUserContext();
  return (
    <section className="min-h-150 md:min-h-0 mx-2 md:mx-4 flex flex-col justify-between mb-4">
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

        <button onClick={() => Logout()} className="">
          <LogOut />
        </button>
      </div>
    </section>
  );
}

export default AccountList;
