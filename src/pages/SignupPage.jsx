import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AnimatedBorder from "../components/AnimatedBorder";
import {
  LoaderIcon,
  LockIcon,
  MailIcon,
  MessageCircleIcon,
  UserIcon,
} from "lucide-react";
import AuthInput from "../components/AuthInput";
import { Link } from "react-router-dom";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const { isSigningUp, signup } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="w-full flex items-center justify-center bg-slate-900">
      <div className="relative w-full max-w-6xl h-[90vh]">
        <AnimatedBorder>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* HEADING */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Create Account
                  </h2>
                  <p className="text-slate-400">Signup for a new account</p>
                </div>

                {/* FORM */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <AuthInput
                    name={"fullname"}
                    value={formData.fullname}
                    handleChange={handleChange}
                    labelText={"Full Name"}
                    Icon={UserIcon}
                  />
                  <AuthInput
                    name={"email"}
                    value={formData.email}
                    handleChange={handleChange}
                    labelText={"Email"}
                    Icon={MailIcon}
                  />
                  <AuthInput
                    name={"password"}
                    value={formData.password}
                    handleChange={handleChange}
                    labelText={"Password"}
                    Icon={LockIcon}
                  />

                  <button className="auth-btn" disabled={isSigningUp}>
                    {isSigningUp ? (
                      <LoaderIcon className="w-full animate-spin text-center" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Already have an account? Log In
                  </Link>
                </div>
              </div>
            </div>
            {/* ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-linear-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/signup.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Start Your Journey Today
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedBorder>
      </div>
    </div>
  );
};

export default SignupPage;
