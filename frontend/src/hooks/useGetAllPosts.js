// src/hooks/useGetAllPosts.js
import { useEffect } from "react";
import axios from "axios";
import usePostStore from "@/store/postStore"; // ✅ Updated to use Zustand store

const useGetAllPosts = () => {
  const setPosts = usePostStore((state) => state.setPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5173';
        const res = await axios.get(`${BASE_URL}/post/all`, {
          withCredentials: true,
        });

        // ✅ Call the Zustand store action directly
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [setPosts]);
};

export default useGetAllPosts;