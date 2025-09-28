import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Messages = ({ messages, currentUser }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse space-y-4">
      <div className="flex flex-col gap-2">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`flex items-start gap-3 ${
              msg.sender === currentUser._id ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender !== currentUser._id && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={msg.sender.profilePicture} alt={msg.sender.username} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
            <div className={`p-3 rounded-2xl max-w-sm ${
              msg.sender === currentUser._id
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-[#28293e] text-gray-200 rounded-bl-none"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;