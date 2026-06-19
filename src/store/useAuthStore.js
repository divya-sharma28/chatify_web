import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isProfileUpdating: false,
  socket: null,
  onlineUsers: [],

  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Signup successful");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message || "Signup failed");
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Login successful");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message || "Login failed");
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      set({ isLoggingOut: true });
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message || "Logout failed");
    } finally {
      set({ isLoggingOut: false });
    }
  },
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in authCheck", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  updateProfile: async (data) => {
    try {
      set({ isProfileUpdating: true });
      const res = await axiosInstance.put("/auth/profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile", error);
      toast.error(error.response.data.message || "Profile update failed");
    } finally {
      set({ isProfileUpdating: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser || socket?.connected) return;

    const socketio = io(import.meta.env.VITE_BASE_URL, {
      withCredentials: true, // enabling cookies sending to request
      
    });

    socketio.connect();

    set({ socket: socketio });

    // listening to online users event
    socketio.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
