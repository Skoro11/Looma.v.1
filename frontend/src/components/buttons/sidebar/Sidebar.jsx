import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Users,
  TextQuote,
  UserRoundPlus,
  CircleUser,
  EllipsisVertical,
} from "lucide-react";
import { useChatContext } from "../../../context/ChatContext";
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { setListState, setIsMobileChatVisible } = useChatContext();
  const navItems = [
    { icon: <MessageCircle size={22} />, label: "My messages", state: "chats" },
    {
      icon: <UserRoundPlus size={22} />,
      label: "Add users",
      state: "addUsers",
    },
    { icon: <Users size={22} />, label: "Friends", state: "friends" },
    { icon: <TextQuote size={22} />, label: "Groups", state: "group" },
    {
      icon: <CircleUser size={22} />,
      label: "My Account",
      state: "userAccount",
    },
  ];

  return (
    <div className="relative flex items-center">
      {/* Menu Button */}
      <button
        className="rounded-lg  text-white  z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {<EllipsisVertical size={24} />}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed  bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-15 right-0  w-64 bg-gray-900 text-white z-50 shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex flex-col h-full p-4">
                <nav className="flex flex-col gap-4">
                  {navItems.map((item, i) => (
                    <button
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
                      onClick={() => {
                        setListState(item.state);
                        setIsMobileChatVisible(false);
                        setIsOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="text-base">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
