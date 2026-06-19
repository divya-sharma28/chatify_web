import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const ProfileHeader = () => {
  const { logout, authUser, updateProfile ,isProfileUpdating} = useAuthStore();
  const { isSoundOn, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file); // Convert to base64 string
    reader.onloadend = async () => {
      const base64Image = reader.result; // Get base64 string
      setSelectedImg(base64Image); // Update local preview
      await updateProfile({ profile_pic: base64Image }); // Update profile in store/backend
    }
  };
  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avtar */}
          {isProfileUpdating? <div className="size-14 rounded-full bg-slate-700 animate-pulse"/> :
            <div className="avatar avatar-online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profile_pic || "avatar.png"}
                alt="User Image"
                className="size-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>}
          {/* username & online text */}
          <div>
            <h3 className="text-slate-200 font-medium text-base mas-w-[180px] truncate">
              {authUser.fullname}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>
        {/* buttons */}
        <div className="flex items-center gap-4">
          {/* logout btn */}
          <button className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"  onClick={logout}>
            <LogOutIcon className={"size-5"} />
          </button>
          {/* sound btn */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0;
              mouseClickSound
                .play()
                .catch((e) => console.log("Audio play failed", e));
              toggleSound();
            }}
          >
            {isSoundOn ? (
              <Volume2Icon className={"size-5"} />
            ) : (
              <VolumeOffIcon className={"size-5"} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
