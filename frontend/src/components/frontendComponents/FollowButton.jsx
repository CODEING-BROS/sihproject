import React from "react";
import useFollowToggle from "@/hooks/useFollowToggle";
import useAuthStore from "@/store/authStore";

export default function FollowButton({ userId }) {
  // Get the current user from the global Zustand store
  const { user: authUser } = useAuthStore();

  // The custom hook handles all the follow/unfollow logic
  const { isFollowing, followLoading, handleFollowToggle } = useFollowToggle(userId);

  // Hide the button on your own profile
  if (authUser?._id === userId) {
    return null;
  }

  let buttonText;
  if (followLoading) {
    buttonText = "Loading...";
  } else if (isFollowing) {
    buttonText = "Unfollow";
  } else {
    buttonText = "Follow";
  }

  return (
    <button
      disabled={followLoading}
      onClick={handleFollowToggle}
      className={`px-4 py-1.5 rounded-full text-sm transition ${
        isFollowing
          ? "bg-gray-700 hover:bg-gray-600 text-white"
          : "bg-blue-600 hover:bg-blue-500 text-white"
      } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={buttonText}
    >
      {buttonText}
    </button>
  );
}