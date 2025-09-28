"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/frontendComponents/Navbar";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import useAuthStore from "@/store/authStore";
import useChat from "@/hooks/useChat";
import CallButton from "@/components/frontendComponents/CallButton";
import { useSearchParams } from "react-router-dom";

const ChatsPage = () => {
  const { user: currentUser } = useAuthStore();
  const {
    availableUsers,
    streamClient,
    streamChannel,
    loadingChannel,
    loadConversations,
    createOrSelectConversation,
  } = useChat();

  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get("user");

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [selectedUserId, setSelectedUserId] = useState(initialUserId || null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleVideoCall = () => {
    if (streamChannel) {
      const callUrl = `${window.location.origin}/call/${streamChannel.id}`;
      streamChannel.sendMessage({
        text: `📞 Calling... Join here: ${callUrl}`,
      });
      toast.success("Video call initiated!");
    }
  };

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load conversations when client is ready
  useEffect(() => {
    if (streamClient && currentUser) loadConversations();
  }, [streamClient, currentUser, loadConversations]);

  // Automatically select user if navigated via query param
  useEffect(() => {
    if (initialUserId && createOrSelectConversation) {
      createOrSelectConversation(initialUserId);
      setSelectedUserId(initialUserId);
    }
  }, [initialUserId, createOrSelectConversation]);

  // Filtered users based on search
  const filteredUsers = availableUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-[#0e0f1a] text-gray-200">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`flex flex-col border-r border-[#1c1d2d] bg-[#151626] transition-all duration-300 ${
            isMobileView ? "w-[80px]" : "w-[320px]"
          }`}
          style={{ height: "calc(100vh - 64px)" }}
        >
          {/* Mobile back button */}
          {isMobileView && selectedUserId && (
            <Button
              variant="ghost"
              onClick={() => setSelectedUserId(null)}
              className="m-3 flex items-center gap-2 text-white bg-[#222437] hover:bg-[#2d3045] rounded-lg px-3 py-2"
            >
              <ArrowLeft size={18} />
            </Button>
          )}

          {/* Search */}
          {!isMobileView && (
            <div className="p-3">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-3 py-2 rounded-lg bg-[#1a1b2e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          {/* User List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredUsers.map((user) => {
              const isActive = selectedUserId === user._id;
              return (
                <div
                  key={user._id}
                  onClick={() => {
                    createOrSelectConversation(user._id);
                    setSelectedUserId(user._id);
                  }}
                  className={`flex items-center cursor-pointer rounded-xl transition-all ${
                    isMobileView ? "justify-center" : "gap-3"
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-[#2a2d4a] to-[#1f2035] shadow-md"
                      : "hover:bg-[#1a1b2e]"
                  } p-2`}
                >
                  <Avatar className="w-12 h-12 ring-2 ring-transparent group-hover:ring-blue-500 transition">
                    <AvatarImage src={user.profilePicture} alt={user.username} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {!isMobileView && (
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">
                        {user.username}
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {user.bio || "No bio available"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex flex-col flex-1 relative bg-[#0e0f1a]">
          {loadingChannel ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="animate-pulse">Loading chat...</div>
            </div>
          ) : streamClient && streamChannel && selectedUserId ? (
            <Chat client={streamClient} theme="str-chat__theme-dark">
              <Channel channel={streamChannel}>
                <div className="w-full p-5 h-full relative">
                  {/* Call button at the top */}
                  <div className="absolute top-6 right-16 z-10">
                    <CallButton handleVideoCall={handleVideoCall} />
                  </div>
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput focus />
                  </Window>
                </div>
                <Thread />
              </Channel>
            </Chat>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-6">
              <MessageSquare
                size={80}
                className="mb-6 text-blue-500 opacity-60"
              />
              <h2 className="text-2xl font-bold mb-2 text-white">
                Welcome to Dev-Pair Chat
              </h2>
              <p className="max-w-sm text-gray-400">
                Select a user from the left panel to start chatting. Click the
                video icon anytime to start a call.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
