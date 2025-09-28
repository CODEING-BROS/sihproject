import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, XCircle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/frontendComponents/Navbar";
import { toast } from "sonner";
import useRooms from "@/hooks/useRooms";
import { Loader2 } from "lucide-react";

const skillLevels = ["Beginner", "Intermediate", "Advanced"];

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const { createRoom } = useRooms();

  const [newRoom, setNewRoom] = useState({
    title: "",
    tags: "",
    maxParticipants: 4,
    description: "",
    techStack: "",
    skillLevel: "Beginner",
    githubLink: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async () => {
  if (newRoom.title.trim() === "") {
    toast.error("Room title is required.");
    return;
  }
  if (newRoom.techStack.trim() === "") {
    toast.error("Primary tech stack is required.");
    return;
  }

  setIsLoading(true);

  const roomData = {
    ...newRoom,
    techStack: newRoom.techStack.split(",").map(s => s.trim()).filter(Boolean),
    tags: newRoom.tags.split(",").map(t => t.trim()).filter(Boolean),
  };

  const createdRoom = await createRoom(roomData);

  setIsLoading(false);

  if (createdRoom?._id) {
    navigate(`/rooms/${createdRoom._id}`); // ✅ go to the new room
  }
};


  const {
    title,
    tags,
    maxParticipants,
    description,
    techStack,
    skillLevel,
    githubLink,
  } = newRoom;

  return (
    <>
      <div className="sticky top-0 z-50 bg-[#010309]">
        <Navbar />
      </div>

      <main className="min-h-screen bg-[#010309] bg-noise pt-20 px-6 flex justify-center items-start pb-16">
        <section
          className="w-full max-w-3xl p-12 rounded-3xl shadow-2xl border border-blue-700/20
            bg-gradient-to-br from-[#010309] via-[#10192b] to-[#0a1c36]
            ring-2 ring-blue-700/50 backdrop-blur-sm relative"
          aria-label="Create New Room Section"
        >
          <div className="absolute -top-12 right-14 w-32 h-32 rounded-full bg-gradient-to-br from-blue-900 via-blue-600 to-indigo-700 blur-3xl opacity-40 pointer-events-none"></div>

          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-purple-400 drop-shadow-md mb-10 flex items-center gap-4">
            <UserPlus className="w-10 h-10 text-blue-300 drop-shadow" />
            Create New Room
          </h1>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateRoom();
            }}
            noValidate
            aria-label="Create Room Form"
          >
            {/* Room Title */}
            <div className="md:col-span-2">
              <label
                htmlFor="room-title"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Room Title
              </label>
              <input
                id="room-title"
                name="roomTitle"
                type="text"
                placeholder="Enter room title"
                autoFocus
                className="w-full rounded-lg px-5 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 placeholder:text-blue-400 shadow-glow transition"
                value={title}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, title: e.target.value }))
                }
                required
                aria-required="true"
              />
            </div>

            {/* Language / Tech Stack */}
            <div>
              <label
                htmlFor="techStack"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Primary Language / Tech Stack
              </label>
              <input
                id="techStack"
                name="techStack"
                value={techStack}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, techStack: e.target.value }))
                }
                className="w-full rounded-lg px-4 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 shadow-glow transition"
                placeholder="e.g. JavaScript, Python, React"
                required
              />
            </div>

            {/* Skill Level */}
            <fieldset className="space-y-2">
              <legend className="block text-sm font-semibold text-blue-100 mb-1">
                Skill Level
              </legend>
              <div className="flex gap-4">
                {skillLevels.map((level) => (
                  <label
                    key={level}
                    className="inline-flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="skillLevel"
                      value={level}
                      checked={skillLevel === level}
                      onChange={(e) =>
                        setNewRoom((prev) => ({ ...prev, skillLevel: e.target.value }))
                      }
                      className="form-radio accent-blue-600"
                    />
                    <span className="text-blue-300">{level}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Tags */}
            <div>
              <label
                htmlFor="room-tags"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Tags{" "}
                <span className="text-xs text-blue-300">(comma separated)</span>
              </label>
              <input
                id="room-tags"
                name="roomTags"
                type="text"
                placeholder="e.g. React, JavaScript, Beginner"
                className="w-full rounded-lg px-5 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 placeholder:text-blue-400 shadow-glow transition"
                value={tags}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, tags: e.target.value }))
                }
              />
            </div>

            {/* Max Participants */}
            <div>
              <label
                htmlFor="room-max-participants"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Max Participants
              </label>
              <input
                id="room-max-participants"
                name="maxParticipants"
                type="number"
                min={2}
                max={20}
                className="w-full rounded-lg px-5 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 placeholder:text-blue-400 shadow-glow transition"
                value={maxParticipants}
                onChange={(e) =>
                  setNewRoom((prev) => ({
                    ...prev,
                    maxParticipants: Math.max(2, Math.min(20, Number(e.target.value))),
                  }))
                }
              />
            </div>
            
            {/* Github Link */}
            <div>
              <label
                htmlFor="githubLink"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                GitHub Link
              </label>
              <input
                id="githubLink"
                name="githubLink"
                type="url"
                placeholder="https://github.com/project"
                className="w-full rounded-lg px-5 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 placeholder:text-blue-400 shadow-glow transition"
                value={githubLink}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, githubLink: e.target.value }))
                }
              />
            </div>

            {/* Description (full width) */}
            <div className="md:col-span-2">
              <label
                htmlFor="room-description"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Description{" "}
                <span className="text-xs text-blue-300">(optional)</span>
              </label>
              <textarea
                id="room-description"
                name="roomDescription"
                placeholder="Brief description of the room and its purpose"
                rows={4}
                className="w-full rounded-lg px-5 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 placeholder:text-blue-400 shadow-glow transition resize-y"
                value={description}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            {/* Buttons full width */}
            <div className="md:col-span-2 flex justify-end gap-6 mt-8">
              <Button
                variant="outline"
                size="md"
                className="flex gap-3 items-center border-none text-pink-400 py-2 px-4 hover:bg-pink-600 hover:text-white hover:border-pink-400/60 transition"
                onClick={() => navigate("/rooms")}
                type="button"
              >
                <XCircle className="w-6 h-6" />
                Cancel
              </Button>
              <Button
                size="md"
                type="submit"
                disabled={isLoading}
                className="flex gap-3 items-center bg-gradient-to-tr py-2 px-4 from-blue-700 to-sky-500 text-white font-bold shadow-lg shadow-blue-700/20 border-0 hover:bg-blue-800 hover:to-blue-600 transition ring-2 ring-transparent hover:ring-blue-500/80"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Room
              </Button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
