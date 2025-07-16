import path from "path";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./db/connecttoMongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import friendsRoutes from "./routes/friends.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";

import { app, server } from "./socket/socket.js";
import { fileURLToPath } from "url";

dotenv.config();

const PORT: string | number = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/conversations", conversationRoutes);

// use the client app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`server Running on port ${PORT}`);
});
