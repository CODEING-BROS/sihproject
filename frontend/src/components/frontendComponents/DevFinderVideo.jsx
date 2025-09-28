// DevFinderVideo.jsx (Responsive Styling)

"use client";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  CallControls,
  CallParticipantsList,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks
} from "@stream-io/video-react-sdk";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useRooms from "@/hooks/useRooms";
import EndCallButton from "./EndCallButton";

const apiKey = import.meta.env.VITE_STREAM_KEY;

export function DevFinderVideo({ onParticipantsChange }) {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { leaveRoom, updateRoomStatus } = useRooms();
  
  const clientRef = useRef(null);
  const callRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... (Hooks and State Logic remain unchanged)
  const { useCallState } = useCallStateHooks();
  const callState = useCallState();
  const isCallEnded = callState.isEnded;

  const onParticipantsChangeRef = useRef(onParticipantsChange);
  useEffect(() => {
    onParticipantsChangeRef.current = onParticipantsChange;
  }, [onParticipantsChange]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    async function init() {
      setIsLoading(true);
      try {
        const { data: userResp } = await axios.get(
          "http://localhost:4000/auth/me",
          { withCredentials: true }
        );
        const loggedInUser = userResp.user;
        setUser(loggedInUser);
        if (!loggedInUser) throw new Error("User not logged in");

        const { data: tokenResp } = await axios.post(
          "http://localhost:4000/rooms/token",
          { userId: loggedInUser._id },
          { withCredentials: true }
        );

        const streamClient = new StreamVideoClient({
          apiKey,
          user: {
            id: loggedInUser._id,
            name: loggedInUser.username,
            image: loggedInUser.profilePicture || "",
          },
          token: tokenResp.token,
        });

        const streamCall = streamClient.call("default", roomId);
        await streamCall.join({ create: true });

        clientRef.current = streamClient;
        callRef.current = streamCall;

        const updateParticipants = () => {
          const live = Object.values(streamCall.state.participants);
          if (onParticipantsChangeRef.current) {
            onParticipantsChangeRef.current(live);
          }
        };

        streamCall.on("participant.joined", updateParticipants);
        streamCall.on("participant.left", updateParticipants);
        updateParticipants();
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    }
    init();

    return () => {
      if (callRef.current && callRef.current.state.isLeft === false) {
        callRef.current.leave().then(() => clientRef.current?.disconnectUser());
      }
    };
  }, [roomId, navigate]);
  
  useEffect(() => {
      if (isCallEnded) {
          console.log("Call ended by admin. Navigating to rooms page.");
          navigate("/");
      }
  }, [isCallEnded, navigate]);

  const handleLeave = async () => {
    try {
      if (callRef.current && callRef.current.state.isLeft === false) {
        await callRef.current.leave();
      }
      if (clientRef.current) {
        await clientRef.current.disconnectUser();
      }
      await leaveRoom(roomId);
      navigate("/");
    } catch (err) {
      console.error(err);
      console.log("Failed to leave room");
    }
  };

  const handleEndCall = async () => {
    try {
      if (callRef.current && callRef.current.state.isLeft === false) {
        await callRef.current.endCall();
      }
    } catch (error) {
      console.error("Failed to end meeting:", error);
    } finally {
      await updateRoomStatus(roomId, "closed");
      // The admin will also be navigated by the new useEffect
    }
  };

  if (isLoading || !clientRef.current || !callRef.current) {
    return (
      <div className="flex justify-center items-center h-full w-full text-4xl bg-gray-900 text-gray-400">
        Joining call...
      </div>
    );
  }

  return (
    // Outer container takes full height (h-full) of the parent RoomCallPage div
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg shadow-blue-900/30">
      <StreamVideo client={clientRef.current}>
        {/* Force a dark theme for aesthetic consistency */}
        <StreamTheme appearance={{ theme: 'dark' }}> 
          <StreamCall call={callRef.current}>
            
            {/* The main video area (takes up all available space) */}
            <div className="relative flex-grow min-h-0"> 
              <SpeakerLayout />
            </div>

            {/* Controls Bar */}
            <div className="flex justify-center items-center gap-4 p-4 sticky bottom-0 z-10 bg-gray-900/50 backdrop-blur-sm">
              <CallControls 
                onLeave={handleLeave} 
                // Hide unnecessary controls on smaller screens
                options={{ 
                  mic: true, 
                  camera: true, 
                  screenShare: false, // Hide ScreenShare on Mobile
                  // ... you can add more options to control button visibility
                }}
              />
              <EndCallButton onEndCall={handleEndCall} />
            </div>
            
            {/* Participants List - Hidden on small screens, shown on large screens */}
            {/* On mobile, the participant count is available in the Room Info sidebar */}
            <div className="hidden lg:block">
              <CallParticipantsList />
            </div>
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    </div>
  );
}