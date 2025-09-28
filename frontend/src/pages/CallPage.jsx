import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";
import PageLoader from "../components/frontendComponents/PageLoader";
import axios from "axios";

import {
  StreamVideo,
  StreamCall,
  StreamVideoClient,
  CallControls,
  SpeakerLayout,
  CallingState,
  StreamTheme,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [call, setCall] = useState(null);
  const [client, setClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { user: authUser } = useAuthStore();
  const navigate = useNavigate();
  
  // Use a ref to track if the initialization has already run
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initCall = async () => {
      // Prevent the function from running more than once
      if (hasInitialized.current) {
        return;
      }

      if (!authUser || !callId) {
        setIsConnecting(false);
        return;
      }
      
      // Set the flag to true to indicate initialization has started
      hasInitialized.current = true;

      try {
        console.log("Fetching video token from backend...");
        const tokenRes = await axios.get(
          `http://localhost:4000/video/token?user_id=${authUser._id}`,
          { withCredentials: true }
        );
        const { token } = tokenRes.data;

        if (!token) {
          console.error("Authentication token is missing.");
          toast.error("Authentication token is missing. Please log in again.");
          setIsConnecting(false);
          return;
        }

        console.log("Initializing Stream Video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName || authUser.username,
          image: authUser.profilePicture || "",
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        console.log("Joined call successfully!");
        setCall(callInstance);
        setClient(videoClient);
      } catch (error) {
        console.error("Error initializing call:", error);
        toast.error("Could not join call. Please try again later.");
        
        // Reset the flag on error so a re-attempt can be made
        hasInitialized.current = false;

      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      // This part remains the same for proper cleanup
      if (call) call.leave();
      if (client) client.disconnectUser();
    };
  }, [authUser, callId]); // Dependencies remain the same

  // The rest of the component is unchanged
  if (isConnecting) return <PageLoader />;
  if (!client || !call) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p>Could not initialize call. Please refresh or try again later.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallContent />
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

// ... CallContent component remains unchanged
const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/chats");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme className="w-full h-full bg-black">
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
