// RoomCallPage.jsx (Responsive Styling)
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import useRooms from "@/hooks/useRooms";
import { DevFinderVideo } from "@/components/frontendComponents/DevFinderVideo";
import { FaGithub } from "react-icons/fa";
import { User, Hash, ChartBar, Users, Clock } from "lucide-react";

export default function RoomCallPage() {
  const { id } = useParams();
  const { fetchRoomById } = useRooms();
  const [room, setRoom] = useState(null);
  const [liveParticipants, setLiveParticipants] = useState(null);

  const handleParticipantsChange = useCallback((participants) => {
    setLiveParticipants(participants);
  }, []);

  const hasFetchedRoom = useRef(false);
  useEffect(() => {
    if (hasFetchedRoom.current) return;
    hasFetchedRoom.current = true;

    const loadRoom = async () => {
      const data = await fetchRoomById(id);
      if (data) setRoom(data);
    };
    loadRoom();
  }, [id, fetchRoomById]);

  if (!room) return <p className="text-white text-center mt-20">Loading...</p>;

  const participantCount = liveParticipants
    ? liveParticipants.length
    : room.members?.length;

  const skillColors = {
    beginner: "bg-green-500/10 text-green-400 border border-green-500/30",
    intermediate: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
    advanced: "bg-red-500/10 text-red-400 border border-red-500/30",
  };
  const statusColors = {
    open: "bg-green-600/10 text-green-400 border border-green-500/30",
    "in-progress":
      "bg-yellow-600/10 text-yellow-400 border border-yellow-500/30",
    closed: "bg-red-600/10 text-red-400 border border-red-500/30",
  };

  return (
    // Responsive grid: 1 column on small screens, 4 columns on large screens (lg)
    // Removed min-h-screen to let content scroll naturally on small screens
    <div className="grid grid-cols-1 lg:grid-cols-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      
      {/* Left: Video Area */}
      {/* Takes full width on small screens, 3/4 width on large screens */}
      <div className="lg:col-span-3 p-4 lg:pr-2">
        {/* Video container with a fixed aspect ratio for clean scaling */}
        <div className="rounded-2xl border-4 border-white shadow-md shadow-blue-900/30 bg-gradient-to-br from-gray-800 to-gray-900 p-2 sm:p-5 ">
          <DevFinderVideo onParticipantsChange={handleParticipantsChange} />
        </div>
      </div>

      {/* Right: Room Info Sidebar */}
      {/* Takes full width on small screens, 1/4 width on large screens */}
      <div className="lg:col-span-1 p-4 lg:pl-2">
        {/* The sticky behavior ensures the info panel stays in view on desktop/scroll */}
        {/* Adjusted borders to be less intrusive on mobile */}
        <div className="rounded-2xl border-2 border-white/50 lg:border-4 lg:border-white shadow-xl bg-gradient-to-b from-gray-850 to-gray-900 text-white p-6 flex flex-col gap-6 lg:sticky lg:top-4 lg:mb-4">
          
          {/* Title - Smaller on mobile */}
          <h1 className="text-xl sm:text-2xl font-bold text-blue-400 leading-tight">
            {room.title}
          </h1>

          {/* GitHub Link */}
          {room.githubLink && (
            <a
              href={room.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
            >
              <FaGithub className="w-5 h-5" />
              <span>View GitHub</span>
            </a>
          )}

          {/* Description */}
          {room.description && (
            <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-blue-500/50 pl-3">
              {room.description}
            </p>
          )}

          {/* Tags */}
          {room.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {room.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-purple-600/10 text-purple-300 border border-purple-600/30 px-3 py-1 rounded-full text-xs font-medium"
                >
                  <Hash className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Tech Stack */}
          {room.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {room.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-blue-600/10 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Skill + Status */}
          <div className="flex flex-wrap gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${skillColors[room.skillLevel]}`}
            >
              <ChartBar className="w-4 h-4" />
              {room.skillLevel.charAt(0).toUpperCase() +
                room.skillLevel.slice(1)}
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${statusColors[room.status]}`}
            >
              <Clock className="w-4 h-4" />
              {room.status.replace("-", " ")}
            </div>
          </div>

          {/* Admin + Participants */}
          <div className="flex flex-col gap-2 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span>
                <span className="font-medium text-white">
                  {room.admin?.name}
                </span>{" "}
                (Admin)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span>
                <span className="font-semibold text-white">
                  {participantCount}
                </span>{" "}
                / {room.maxParticipants} participants
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}