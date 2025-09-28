import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import useChatStore from "@/store/chatStore";
import { MessageSquare } from "lucide-react";

const Messages = ({ selectedUser }) => {
    const { user: currentUser } = useAuthStore();
    const { streamChannel } = useChatStore();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!streamChannel) {
            setMessages([]);
            return;
        }

        const fetchInitialMessages = async () => {
            try {
                const { messages: initialMessages } = await streamChannel.query({ sort: { created_at: 1 } });
                setMessages(initialMessages);
            } catch (error) {
                console.error("Failed to fetch initial messages from Stream:", error);
            }
        };

        const handleNewMessage = (event) => {
            if (event.type === "message.new") {
                setMessages(prevMessages => [...prevMessages, event.message]);
            }
        };

        fetchInitialMessages();
        streamChannel.on(handleNewMessage);

        return () => {
            streamChannel.off(handleNewMessage);
        };
    }, [streamChannel]);

    if (!selectedUser) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-400">
                <MessageSquare size={80} className="mb-4 text-blue-500 opacity-50" />
                <h2 className="text-xl font-semibold mb-2 text-white">Your messages</h2>
                <p className="mb-6">Send a message to start a chat.</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 py-3 shadow-lg">
                    Send message
                </Button>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto flex-1 p-4">
            <div className="flex justify-center mb-4">
                <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                        <AvatarFallback>{selectedUser?.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold mt-2">{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?.id}`}>
                        <Button className="h-8 my-2" variant="secondary">
                            View profile
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.user.id === currentUser?._id ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`p-2 rounded-lg max-w-xs break-words ${
                                msg.user.id === currentUser?._id ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Messages;