import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth-route.js";
import UserRouter from "./routes/user-route.js";
import ChatRouter from "./routes/chat-route.js";
import morgan from "morgan";
import logger from "./utils/logger.js";
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/chats", ChatRouter);

app.get("/api", (req, res) => {
  res.status(200).send("This is the backend");
});

export default app;
