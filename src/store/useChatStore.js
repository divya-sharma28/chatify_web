import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const notificationSound = new Audio("/sounds/notification.mp3");
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isSoundOn: JSON.parse(localStorage.getItem("isSoundOn") || "true"),

  toggleSound: () => {
    const newValue = !get().isSoundOn;
    localStorage.setItem("isSoundOn", JSON.stringify(newValue));
    set({ isSoundOn: newValue });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUserLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/contacts");
      set({ allContacts: data });
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getChatPartners: async () => {
    set({ isMessageLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/chats");
      set({ chats: data });
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      toast.error(error.response.data.message || "Failed to fetch chats");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  getMessaagesbyUserId: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const { data } = await axiosInstance.get(`/messages/${userId}`);

      set({ messages: data });
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      toast.error(error.response.data.message || "Failed to fetch messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { messages, selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now}`;

    const optimisticMessage = {
      _id: tempId,
      senderID: authUser._id,
      receiverID: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // optional to identify optimistic messages
    };

    set({ messages: [...messages, optimisticMessage] }); // append new message

    try {
      const { data } = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: messages.concat(data) }); // append new message
    } catch (error) {
      console.error("Failed to send message:", error);
      // remove optimistic message on failure
      set({ messages: messages });
      toast.error(error.response.data.message || "Failed to send message");
    }
  },

  subscribeToMessage: () => {
    const { selectedUser, isSoundOn } = get();
    if (!selectedUser) return;
    const socketio = useAuthStore.getState().socket;

    socketio.on("newMessage", (newMessage) => {
      const isMsgFrmSelectedUser = newMessage.senderID === selectedUser._id;
      if (!isMsgFrmSelectedUser) return;
      const currentMessages = get().messages;

      set({ messages: [...currentMessages, newMessage] });

      if (isSoundOn) {
        notificationSound.currentTime = 0; // reset to start
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed", e));
      }
    });
  },
  unsubscribeFromMessage: () => {
    const socketio = useAuthStore.getState().socket;
    socketio.off("newMessage");
  },
}));
