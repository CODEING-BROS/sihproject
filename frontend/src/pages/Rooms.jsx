"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn, Shuffle } from "lucide-react";
import RoomCard from "./../components/frontendComponents/RoomCard";
import useRooms from "@/hooks/useRooms";
import useAuthStore from "@/store/authStore";

export default function RoomsPage() {
  const navigate = useNavigate();
  // Get rooms from the hook; no need for a liveParticipants state here.
  const { rooms, isLoading, joinRoom } = useRooms();
  const { user: currentUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);

  if (isLoading) {
    return <p className="text-gray-400 text-center py-10 text-lg">Loading rooms...</p>;
  }

  const allTags = Array.from(
    new Set(
      rooms.flatMap((room) =>
        room.tags.flatMap((tagStr) =>
          tagStr.split(",").map((t) => t.trim()).filter(Boolean)
        )
      )
    )
  ).sort();

  const toggleTagFilter = (tag) => {
    setFilteredTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredRooms = rooms.filter((room) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      room.title.toLowerCase().includes(searchLower) ||
      room.tags.some((tagStr) => tagStr.toLowerCase().includes(searchLower));

    const roomTags = room.tags.flatMap((tagStr) =>
      tagStr.split(",").map((t) => t.trim())
    );

    const matchesTagFilter =
      filteredTags.length === 0 ||
      filteredTags.some((filterTag) => roomTags.includes(filterTag));

    return matchesSearch && matchesTagFilter;
  });

  const handleJoinRoom = async (room) => {
    // The `room.members.length` is accurate because the backend updates it.
    if (room.members.length >= room.maxParticipants) {
      alert(`Room "${room.title}" is full!`);
      return;
    }
    const response = await joinRoom(room._id, room.streamCallId);
    if (response) {
      navigate(`/rooms/${room._id}`);
    }
  };

  const handleJoinRandom = () => {
    const openRooms = rooms.filter((r) => r.members.length < r.maxParticipants);
    if (openRooms.length === 0) {
      alert("No available public rooms to join right now.");
      return;
    }
    const randomRoom = openRooms[Math.floor(Math.random() * openRooms.length)];
    handleJoinRoom(randomRoom);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-white flex gap-3 items-center drop-shadow-lg">
        <LogIn className="w-8 h-8 text-blue-400" />
        Coding Rooms
      </h1>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Search rooms by title or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow max-w-md px-4 py-2 rounded-lg border border-gray-700 bg-[#1e1e2e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
        />

        <Button
          onClick={handleJoinRandom}
          variant="outline"
          size="sm"
          className="flex gap-2 items-center border-blue-500 text-blue-400 hover:bg-blue-500/90 hover:text-white transition font-semibold"
        >
          <Shuffle className="w-4 h-4" /> Join Random
        </Button>

        <Button
          onClick={() => navigate("/create-room")}
          size="sm"
          className="flex items-center gap-2 bg-gradient-to-tr from-blue-700 to-blue-400 text-white hover:from-blue-800 hover:to-blue-500 transition drop-shadow-md font-semibold"
        >
          <UserPlus className="w-5 h-5" /> Create Room
        </Button>
      </div>

      <div className="mb-8 flex flex-wrap gap-3 items-center">
        <span className="text-gray-400 mr-2 select-none font-medium">Filter by Tag:</span>
        {allTags.length === 0 && <span className="text-gray-600 italic">No tags available</span>}
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTagFilter(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition select-none ${
              filteredTags.includes(tag)
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white"
            }`}
          >
            #{tag}
          </button>
        ))}
        {filteredTags.length > 0 && (
          <button
            onClick={() => setFilteredTags([])}
            className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const isJoined = currentUser && room.members.includes(currentUser._id);
          return (
            <RoomCard
              key={room._id}
              title={room.title}
              tags={room.tags.flatMap((t) => t.split(",").map((x) => x.trim()))}
              // The people count is now always from the DB, which is updated on join/leave
              people={room.members.length}
              description={room.description}
              isJoined={isJoined}
              onJoin={() => handleJoinRoom(room)}
            />
          );
        })}
      </div>
    </div>
  );
}