// src/hooks/useFollowToggle.js
import { useState } from "react";
import axios from "axios";
import useAuthStore from "@/store/authStore"; // ✅ Updated to use Zustand store

const useFollowToggle = (userId) => {
  // ✅ Get state and action directly from the store
  const user = useAuthStore((state) => state.user);
  const toggleFollowUser = useAuthStore((state) => state.toggleFollowUser);
  
  const [followLoading, setFollowLoading] = useState(false);

  const isFollowing = user?.following?.includes(userId) || false;

  const handleFollowToggle = async () => {
    if (!user || !userId) {
      console.warn("No logged-in user or no target userId provided. Aborting follow toggle.");
      return;
    }
    
    setFollowLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5173';
      const url = isFollowing
        ? `${BASE_URL}/user/unfollow/${userId}`
        : `${BASE_URL}/user/follow/${userId}`;

      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.status === 200) {
        // ✅ Call the Zustand action to update state
        toggleFollowUser(userId);
      }
    } catch (error) {
      console.error("Follow/unfollow failed:", error.response?.data || error.message);
    } finally {
      setFollowLoading(false);
    }
  };

  return {
    isFollowing,
    followLoading,
    handleFollowToggle,
  };
};

export default useFollowToggle;