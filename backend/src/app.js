import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth-route.js";
import UserRouter from "./routes/user-route.js";
import ChatRouter from "./routes/chat-route.js";

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
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/chats", ChatRouter);

app.get("/", (req, res) => {
  res.status(200).send("This is the backend");
});

export default app;
