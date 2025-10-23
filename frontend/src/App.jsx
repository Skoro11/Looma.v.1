import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LandingPage } from "./pages/LandingPage";
import "react-toastify/dist/ReactToastify.css";
import { ChatProvider } from "./context/ChatContext.jsx";
import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ChatProvider>
          <div className="min-h-screen bg-[var(--color-accent)] w-full bg-center bg-cover md:bg-[url('/background.jpg')]">
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SignupPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <LandingPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
            <ToastContainer position="bottom-right" autoClose={1000} />
          </div>
        </ChatProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
