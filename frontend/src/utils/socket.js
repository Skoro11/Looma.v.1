import { io } from "socket.io-client";

// create ONE socket instance and export it
export const socket = io(
  import.meta.env.VITE_API_URL || "http://localhost:3000",
  {
    withCredentials: true,
  }
);
