// useRooms.js (FIXED)
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5173";
const API_URL = `${BASE_URL}/rooms`;

const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuthStore();

  // Memoize fetchRooms to ensure its reference is stable
  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/all`, { withCredentials: true });
      if (res.data.success) setRooms(res.data.rooms || []);
      return res.data.rooms || [];
    } catch (err) {
      console.error("❌ Failed to fetch rooms:", err);
      setError("Failed to load rooms. Please try again.");
      toast.error("Failed to load rooms. Please try again.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoize createRoom to ensure its reference is stable
  const createRoom = useCallback(async (roomData) => {
    try {
      const res = await axios.post(`${API_URL}/create`, roomData, { withCredentials: true });
      if (res.data.success) {
        toast.success("Room created successfully!");
        setRooms((prev) => [...prev, res.data.room]);
        return res.data.room;
      }
    } catch (err) {
      console.error("❌ Failed to create room:", err);
      toast.error(err.response?.data?.message || "Failed to create room.");
      return null;
    }
  }, []);

  const joinRoom = useCallback(async (roomId) => { // Removed streamCallId since it's not needed in this function
    if (!currentUser) {
      toast.error("You must be logged in to join a room.");
      return null;
    }
    try {
      const res = await axios.post(`${API_URL}/join/${roomId}`, {}, { withCredentials: true }); // Removed streamCallId
      if (res.data.success) {
        toast.success("Joined room successfully!");
        // The backend should return the updated room, so update the state with it.
        setRooms((prev) =>
          prev.map((r) => (r._id === res.data.room._id ? res.data.room : r))
        );
        return res.data.room;
      }
    } catch (err) {
      console.error("❌ Failed to join room:", err);
      toast.error(err.response?.data?.message || "Failed to join room.");
      return null;
    }
  }, [currentUser]);

  // Corrected leaveRoom function
  const leaveRoom = useCallback(async (roomId) => {
    if (!currentUser) {
      toast.error("You must be logged in to leave a room.");
      return null;
    }
    try {
      // The `leaveRoom` API call to the backend is still useful for historical tracking and updating member count.
      const res = await axios.post(`${API_URL}/leave/${roomId}`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success("Left room successfully!");
        setRooms((prev) =>
          prev.map((r) => (r._id === res.data.room._id ? res.data.room : r))
        );
        return res.data.room;
      }
    } catch (err) {
      console.error("❌ Failed to leave room:", err);
      toast.error(err.response?.data?.message || "Failed to leave room.");
      return null;
    }
  }, [currentUser]);

  // New function to update room status
  const updateRoomStatus = useCallback(async (roomId, status) => {
    try {
      await axios.patch(`${API_URL}/${roomId}/status`, { status }, { withCredentials: true });
      toast.success("Room status updated.");
      setRooms((prev) =>
        prev.map((r) => (r._id === roomId ? { ...r, status } : r))
      );
      return true;
    } catch (err) {
      console.error("❌ Failed to update room status:", err);
      toast.error(err.response?.data?.message || "Failed to update room status.");
      return false;
    }
  }, []);

  const fetchRoomById = useCallback(async (roomId) => {
    try {
      const res = await axios.get(`${API_URL}/${roomId}`, { withCredentials: true });
      if (process.env.NODE_ENV === "development") {
        console.log("Fetched room:", res.data);
      }
      if (res.data.success) {
        return res.data.room;
      }
    } catch (err) {
      console.error("❌ Failed to fetch room:", err);
      toast.error("Failed to load room.");
      return null;
    }
  }, []);


  // This is the extra block that needs to be removed
  // }, []);

  useEffect(() => {
    let ignore = false;
    console.log("Current user:", currentUser);
    if (currentUser) {
      (async () => {
        const data = await fetchRooms();
        if (ignore) return;
        setRooms(data);
      })();
    }
    return () => {
      ignore = true;
    };
  }, [currentUser, fetchRooms]);

  return { rooms, isLoading, error, fetchRooms, createRoom, joinRoom, leaveRoom, updateRoomStatus, fetchRoomById };
};

export default useRooms;