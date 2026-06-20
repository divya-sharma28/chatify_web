import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import NoChatHistory from "./NoChatHistory";
import MessageInput from "./MessageInput";
import MessagesLoader from "./MessagesLoader";

const ChatContainer = () => {
  const {
    selectedUser,
    getMessaagesbyUserId,
    messages,
    isMessageLoading,
    subscribeToMessage,
    unsubscribeFromMessage,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser && authUser && socket) {
      getMessaagesbyUserId(selectedUser._id);
      subscribeToMessage();

      //clean up

      return () => unsubscribeFromMessage();
    }
  }, [selectedUser, authUser, socket, getMessaagesbyUserId]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages?.length > 0 && !isMessageLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages?.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderID === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderID === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : isMessageLoading ? (
          <MessagesLoader />
        ) : (
          <NoChatHistory name={selectedUser.fullname} />
        )}
        {/* Scroll target */}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </>
  );
};

export default ChatContainer;
