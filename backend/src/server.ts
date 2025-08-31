import dotenv from "dotenv";

dotenv.config();

import path from "path";
import express, { Request, Response } from "express";
import connectToMongoDB from "@/db/connecttoMongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import {
  authRoutes,
  messageRoutes,
  userRoutes,
  friendsRoutes,
  notificationRoutes,
  conversationRoutes,
} from "@/routes";

import { app, server } from "@/socket/socket.js";
import { fileURLToPath } from "url";

const PORT: string | number = process.env.PORT || 5000;

// Adds security headers to protect against common web vulnerabilities
app.use(helmet());

// Compresses response bodies to reduce size and improve load times
app.use(compression());

// Parses incoming JSON payloads in request bodies
app.use(express.json());

// Parses cookies from request headers into req.cookies
app.use(cookieParser());

// Enables Cross-Origin Resource Sharing (CORS) with specific origin and credentials
app.use(
  cors({
    origin: [process.env.APP_URL as string],
    credentials: true,
  })
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

// Serve static client files
const clientPath = path.join(__dirname, "../../public");
app.use(express.static(clientPath));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`server Running on port ${PORT}`);
});
