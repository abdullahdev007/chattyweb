import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model.js";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../types/jwt.js";

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: "Unauthorized - No Token Provided" });

      return;
    }

    const jwt_secret: string = process.env.JWT_SECRET || "";
    const decoded = jwt.verify(token, jwt_secret) as JwtPayload;

    if (!decoded) {
      res.status(401).json({ error: "Unauthorized - Invalid token" });
      return;
    }

    const user: IUser | null = await User.findById(decoded.userId)
      .select("-password")
      .exec();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    req.user = user;

    next();
  } catch (error: any) {
    console.log("error in protectRoute middleware :", error.message);
    res.status(500).json("Internal server error");
  }
};

export default protectRoute;
