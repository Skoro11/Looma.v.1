import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import { DbConnection } from "./src/config/DbConnection.js";
import { chatSockets } from "./src/socket/chatSockets.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach socket logic
chatSockets(io);

// Connect DB and start server
DbConnection(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
