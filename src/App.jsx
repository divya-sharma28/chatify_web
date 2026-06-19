import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useAuthStore } from "./store/useAuthStore";
import DecorativeBg from "./components/DecorativeBg";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";
function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <PageLoader />;
  }
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
        <DecorativeBg />
        <Routes>
          <Route
            path="/"
            element={authUser ? <ChatPage /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
          />
        </Routes>
      <Toaster />
      </div>

    </BrowserRouter>
  );
}

export default App;
