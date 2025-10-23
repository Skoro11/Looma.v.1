import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LandingPage } from "./pages/LandingPage";
import "react-toastify/dist/ReactToastify.css";
import { ChatProvider } from "./context/ChatContext.jsx";
import { UserProvider } from "./context/UserContext";
function App() {
  return (
    <UserProvider>
      <ChatProvider>
        <div
          className="min-h-screen w-full bg-center bg-cover"
          style={{ backgroundImage: "url('/background.jpg')" }}
        >
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/dashboard" element={<LandingPage />} />
            </Routes>
          </Router>
          <ToastContainer position="bottom-right" autoClose={1000} />
        </div>
      </ChatProvider>
    </UserProvider>
  );
}

export default App;
