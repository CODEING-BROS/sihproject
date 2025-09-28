import { useEffect, useState, useCallback } from "react";
import { StreamChat } from "stream-chat";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";

const useChat = () => {
  const { user: currentUser } = useAuthStore();
  const [streamClient, setStreamClient] = useState(null);
  const [streamChannel, setStreamChannel] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingChannel, setLoadingChannel] = useState(false);

  // 1. Fetch followers/following (This code is fine)
  useEffect(() => {
    const fetchConnections = async () => {
      if (!currentUser?._id) return;

      try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5173';
        const [followersRes, followingRes] = await Promise.all([
          axios.get(`${BASE_URL}/user/followers`, { withCredentials: true }),
          axios.get(`${BASE_URL}/user/following`, { withCredentials: true }),
        ]);

        const merged = [...followersRes.data, ...followingRes.data].filter(
          (u, i, arr) =>
            u &&
            u._id &&
            u._id.toString() !== currentUser._id.toString() &&
            arr.findIndex((x) => x._id === u._id) === i
        );

        setAvailableUsers(merged);
      } catch (err) {
        console.error("❌ Failed to fetch followers/following:", err);
      }
    };

    fetchConnections();
  }, [currentUser]);

  // 2. Initialize Stream client and fetch conversations (REVISED)
  useEffect(() => {
    const initStream = async () => {
      console.log("Init Stream: Starting...");
      console.log("User ID:", currentUser?._id);
      console.log("Stream API Key from .env:", import.meta.env.VITE_STREAM_KEY);

      if (!currentUser?._id || !import.meta.env.VITE_STREAM_KEY) {
        console.error("Init Stream: Failed. Missing user ID or Stream API key.");
        toast.error("Initialization failed.");
        return;
      }

      try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5173';
        console.log("Init Stream: Fetching token from backend...");
        // ✅ Rely on the cookie, no Authorization header needed
        const tokenRes = await axios.get(
          `${BASE_URL}/chats/stream/token`,
          { withCredentials: true }
        );
        console.log("Init Stream: Backend token received.");
        
        console.log("Init Stream: Creating client instance...");
        const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_KEY);
        console.log("Init Stream: Client instance created.");

        console.log("Init Stream: Connecting user...");
        await client.connectUser(
          {
            id: currentUser._id.toString(),
            name: currentUser.username,
            image: currentUser.profilePicture,
          },
          tokenRes.data.token
        );
        console.log("Init Stream: User connected.");

        setStreamClient(client);
        console.log("Init Stream: streamClient state set.");

        const res = await axios.get(`${BASE_URL}/chats/conversations`, {
          withCredentials: true,
        });
        setConversations(res.data || []);
        console.log("Init Stream: Conversations loaded.");

      } catch (err) {
        console.error("❌ Init Stream: An error occurred.", err);
        if (err.response) {
          console.error("Server responded with:", err.response.status, err.response.data);
        }
        toast.error("Failed to connect to chat service.");
      }
    };

    initStream();

    return () => {
      if (streamClient) {
        streamClient.disconnectUser();
        setStreamClient(null);
      }
    };
  }, [currentUser]);

  // 3. Select conversation and create stream channel (No change, as this logic was fine)
  const selectConversationChannel = async (conversation) => {
    if (!streamClient || !currentUser) {
      console.error("Cannot select channel: Stream client or current user is missing.");
      return;
    }

    setLoadingChannel(true);

    try {
      const otherUser = conversation.participants.find(
        (u) => u._id.toString() !== currentUser._id.toString()
      );

      const channel = streamClient.channel("messaging", {
        members: [currentUser._id.toString(), otherUser._id.toString()],
      });

      await channel.watch();

      setSelectedUser(otherUser);
      setStreamChannel(channel);
      setSelectedConversation(conversation._id);
      console.log("Channel selected successfully:", channel.id);
    } catch (err) {
      console.error("❌ Error creating/selecting channel:", err);
      toast.error("Failed to open chat channel.");
      console.log("Current streamClient state:", streamClient);
    } finally {
      setLoadingChannel(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    await selectConversationChannel(conversation);
  };

 const createOrSelectConversation = async (targetUserId) => {
    if (!streamClient) {
        console.error("Stream client not initialized. Cannot create conversation.");
        toast.info("Connecting to chat service. Please try again in a moment.");
        return;
    }

    try {
        // 1. Call the backend to create/get the channel
        const res = await axios.post(
            `${BASE_URL}/chats/conversations/${targetUserId}`,
            {},
            { withCredentials: true }
        );
        let { channelId } = res.data;
        console.log("New conversation created/fetched:", res.data);

        // ✅ FIX: Remove the 'messaging:' prefix from the channelId
        channelId = channelId.replace("messaging:", "");

        // 2. Create the local Stream channel object
        const newChannel = streamClient.channel("messaging", channelId);

        // 3. Watch the channel and set the state
        await newChannel.watch();
        setStreamChannel(newChannel);

        // 4. Find the other user and update the selected user state
        const otherUser = availableUsers.find(u => u._id === targetUserId);
        setSelectedUser(otherUser);

        // 5. Update the conversations list
        setConversations(prev => {
            const exists = prev.some(c => c.cid === newChannel.cid);
            if (exists) return prev;
            return [
                ...prev, 
                {
                    cid: newChannel.cid,
                    participants: [
                        { _id: currentUser._id, ...currentUser },
                        { _id: otherUser._id, ...otherUser }
                    ]
                }
            ];
        });
        setSelectedConversation(newChannel.cid);

        toast.success("Conversation created/fetched successfully.");
    } catch (err) {
        console.error("❌ Error creating/selecting conversation:", err);
        toast.error("Failed to create conversation.");
    }
};

  // 4. Expose all the states and functions
  return {
    availableUsers,
    conversations,
    selectedConversation,
    selectedUser,
    streamClient,
    streamChannel,
    loadingChannel,
    loadConversations: () => { /* No-op, not needed */ },
    handleSelectConversation,
    createOrSelectConversation,
  };
};

export default useChat;

