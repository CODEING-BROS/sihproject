// src/hooks/useGetAllUsers.js
import { useEffect, useState } from "react";
import axios from "axios";

const useGetAllUsers = (token) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5173';
        const res = await axios.get(`${BASE_URL}/user/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        // Extract users array from the response
        setUsers(res.data.users || []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(
          err?.response?.data?.message || err.message || "Failed to load users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      controller.abort();
    };
  }, [token]);

  return { users, loading, error };
};

export default useGetAllUsers;
