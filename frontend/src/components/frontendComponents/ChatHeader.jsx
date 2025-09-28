import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MoreVertical } from "lucide-react";

const ChatHeader = ({ user }) => {
  if (!user) return null;
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#28293e] bg-[#1a1b2a]">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.profilePicture} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-white">{user.username}</span>
          <span className="text-sm text-gray-400">Online</span>
        </div>
      </div>
      <button className="text-gray-400 hover:text-white transition">
        <MoreVertical size={24} />
      </button>
    </div>
  );
};

export default ChatHeader;