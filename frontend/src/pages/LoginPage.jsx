import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginUser } from "../services/authService";
import { useAuthContext } from "../context/AuthContext";
function LoginPage() {
  const { isAuthenticated, setIsAuthenticated, loading } = useAuthContext();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/");
  }

  async function SubmitForm(e) {
    e.preventDefault();
    try {
      const data = await LoginUser(userEmail, userPassword);

      if (data && data.success === true) {
        toast.success(data.message);
        /* navigate("/dashboard"); */
        setIsAuthenticated(data.success);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-body)] px-4">
      <div className="bg-[var(--color-accent)] shadow-2xl rounded-2xl p-8 sm:p-10 w-full max-w-md text-white">
        {/* Logo + Title */}
        <h1 className="flex items-center justify-center text-3xl sm:text-4xl font-bold mb-6 gap-3">
          <img
            src="looma.png"
            alt="Looma Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
          />
          <span className="text-[var(--color-logo)]">Looma</span>
        </h1>

        <p className="text-center text-gray-300 mb-8 text-sm sm:text-base">
          Sign in to your account
        </p>

        {/* Login Form */}
        <form onSubmit={SubmitForm} className="space-y-4">
          <input
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-messages)] border border-transparent focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none placeholder-gray-400 text-white"
          />
          <input
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-messages)] border border-transparent focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none placeholder-gray-400 text-white"
          />

          <button
            type="submit"
            className="w-full mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-logo)] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-[var(--color-primary)] hover:text-[var(--color-logo)] font-semibold transition-colors"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
