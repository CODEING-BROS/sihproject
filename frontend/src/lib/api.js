import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5173", // change this to your backend port if different
  withCredentials: true,
});

export const getStreamToken = async () => {
  const response = await api.get("/chat/token");
  return response.data;
};
