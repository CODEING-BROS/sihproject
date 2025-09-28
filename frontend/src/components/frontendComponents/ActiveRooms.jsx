"use client";

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "@/components/frontendComponents/RoomCard";
import useRooms from "@/hooks/useRooms";
import useAuthStore from "@/store/authStore";

const ActiveRooms = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { rooms, isLoading, joinRoom } = useRooms();
  const { user: currentUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

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

  // Only show active rooms (members.length > 0)
  const activeRooms = filteredRooms.filter((room) => room.members.length > 0);

  const handleJoinRoom = async (room) => {
    if (room.members.length >= room.maxParticipants) {
      alert(`Room "${room.title}" is full!`);
      return;
    }
    const response = await joinRoom(room._id, room.streamCallId);
    if (response) navigate(`/rooms/${room._id}`);
  };

  return (
    <section aria-labelledby="live-rooms-heading" className="px-4">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Search active rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow max-w-md px-4 py-2 rounded-lg border border-gray-700 bg-[#1e1e2e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
        />
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
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
        </div>
      </div>

      {activeRooms.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No active rooms right now.</p>
      ) : (
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/60 hover:bg-gray-800 text-white p-2 rounded-full shadow"
            onClick={() => scroll(-300)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto py-2 hide-scrollbar"
            style={{ scrollBehavior: "smooth", paddingLeft: "56px", paddingRight: "56px" }}
          >
            {activeRooms.map((room) => {
              const isJoined = currentUser && room.members.includes(currentUser._id);
              return (
                <RoomCard
                  key={room._id}
                  title={room.title}
                  tags={room.tags.flatMap((t) => t.split(",").map((x) => x.trim()))}
                  people={room.members.length}
                  description={room.description}
                  isJoined={isJoined}
                  onJoin={() => handleJoinRoom(room)}
                />
              );
            })}
          </div>

          {/* Right Scroll Button */}
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/60 hover:bg-gray-800 text-white p-2 rounded-full shadow"
            onClick={() => scroll(300)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default ActiveRooms;
