import React, { useState } from "react";
import AnimatedBorder from "../components/AnimatedBorder";
import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversation from "../components/NoConversation";
import ChatList from "../components/ChatList";

const ChatPage = () => {
  const activeTab = useChatStore((state) => state.activeTab);
  const selectedUser = useChatStore((state) => state.selectedUser);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-6xl h-[90vh]">
      <AnimatedBorder>
        {/* Hamburger button (mobile only) */}
        {!isOpen && <button
          className="absolute top-4 left-4 md:hidden z-50 text-white"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>}

        {/* LEFT SIDE (Drawer) */}
        <div
          className={`fixed inset-y-0 left-0 w-80 bg-slate-800/90 backdrop-blur-sm transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex flex-col z-40`}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatList /> : <ContactList />}
          </div>

          {/* Close button (mobile only) */}
          <button
            className="absolute top-2 right-4 md:hidden text-white"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Overlay when drawer is open */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-30"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversation />}
        </div>
      </AnimatedBorder>
    </div>
  );
};

export default ChatPage;