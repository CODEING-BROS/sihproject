import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useRooms from "@/hooks/useRooms";
import useAuthStore from "@/store/authStore";

function EndCallButton() {
  const call = useCall();
  const navigate = useNavigate();
  const { id: roomId } = useParams();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const { user: currentUser } = useAuthStore();
  const { updateRoomStatus } = useRooms();

  if (!call || !currentUser || !roomId) {
    return null;
  }

  const isMeetingOwner = currentUser._id === call.state.createdBy?.id;

  if (!isMeetingOwner) {
    return null;
  }

  const endCall = async () => {
    try {
      await call.endCall();
      await updateRoomStatus(roomId, "closed");
      toast.success("Meeting ended for everyone");
      // Navigation will also be handled by the useEffect in DevFinderVideo.jsx for all participants
    } catch (error) {
      console.error("Failed to end meeting:", error);
      toast.error("Failed to end meeting");
    }
  };

  return (
    <button
      onClick={endCall}
      className="
        // Base Styling
        bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors duration-200
        
        // Responsive Sizing: Compact on mobile, larger on desktop
        text-sm sm:text-base 
        py-1 px-4 sm:py-2 sm:px-6
      "
    >
      Close Room
    </button>
  );
}

export default EndCallButton;